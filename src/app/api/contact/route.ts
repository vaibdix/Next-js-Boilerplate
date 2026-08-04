import { detectBot } from '@arcjet/next';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { createArcjetClient } from '@/libs/arcjet';
import { Env } from '@/libs/env';
import { logger } from '@/libs/logger';
import { contactFormSchema } from '@/validations/contact-form';
import type {
  ContactFormResponse,
  ContactFormResponseMessage,
  ContactFormValues,
} from '@/validations/contact-form';

const contactRouteProtection =
  Env.ARCJET_KEY === undefined
    ? undefined
    : createArcjetClient(Env.ARCJET_KEY).withRule(
        detectBot({
          mode: 'LIVE',
          allow: [],
        })
      );

const createContactErrorResponse = (props: {
  status: number;
  message: ContactFormResponseMessage;
}) => {
  const body: ContactFormResponse = {
    ok: false,
    message: props.message,
  };

  return NextResponse.json(body, {
    status: props.status,
  });
};

const getRequestJson = async (request: NextRequest) => {
  try {
    const value: unknown = await request.json();

    return value;
  } catch (error) {
    logger.warn('Contact request body was not valid JSON', { error });

    return null;
  }
};

const getProtectionError = async (request: NextRequest) => {
  if (contactRouteProtection === undefined) {
    return null;
  }

  const decision = await contactRouteProtection.protect(request);

  if (!decision.isDenied()) {
    return null;
  }

  logger.warn('Contact request denied by Arcjet', {
    reason: decision.reason,
  });

  return createContactErrorResponse({
    status: 403,
    message: 'forbidden',
  });
};

const submitContactForm = async (values: ContactFormValues) => {
  const response = await fetch(
    `https://formsubmit.co/ajax/${Env.FORMSUBMIT_EMAIL}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
        _captcha: 'false',
        _subject: 'New contact form submission',
      }),
      signal: AbortSignal.timeout(10_000),
    }
  ).catch((error: unknown) => {
    logger.error('Contact form upstream request failed', { error });

    return null;
  });

  if (response !== null && !response.ok) {
    logger.error('Contact form upstream returned {status}', {
      status: response.status,
    });
  }

  return response?.ok === true;
};

export const GET = () => {
  return createContactErrorResponse({
    status: 405,
    message: 'submit_error',
  });
};

export const POST = async (request: NextRequest) => {
  const protectionError = await getProtectionError(request);

  if (protectionError !== null) {
    return protectionError;
  }

  const requestBody = await getRequestJson(request);
  const parsedBody = contactFormSchema.safeParse(requestBody);

  if (!parsedBody.success) {
    return createContactErrorResponse({
      status: 400,
      message: 'invalid_request',
    });
  }

  if (!(await submitContactForm(parsedBody.data))) {
    return createContactErrorResponse({
      status: 502,
      message: 'submit_error',
    });
  }

  const responseBody: ContactFormResponse = {
    ok: true,
  };

  return NextResponse.json(responseBody);
};
