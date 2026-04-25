import { detectBot } from '@arcjet/next';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import arcjet from '@/libs/Arcjet';
import { Env } from '@/libs/Env';
import { contactFormSchema } from '@/validations/contact-form';
import type {
  ContactFormResponse,
  ContactFormResponseMessage,
} from '@/validations/contact-form';

export const runtime = 'nodejs';

const contactRouteProtection = arcjet.withRule(
  detectBot({
    mode: 'LIVE',
    allow: [],
  })
);

function createContactErrorResponse(props: {
  status: number;
  message: ContactFormResponseMessage;
}) {
  const body: ContactFormResponse = {
    ok: false,
    message: props.message,
  };

  return NextResponse.json(body, {
    status: props.status,
  });
}

async function getRequestJson(request: NextRequest) {
  try {
    const value: unknown = await request.json();

    return value;
  } catch {
    return null;
  }
}

export function GET() {
  return createContactErrorResponse({
    status: 405,
    message: 'submit_error',
  });
}

export async function POST(request: NextRequest) {
  if (Env.ARCJET_KEY !== undefined) {
    const decision = await contactRouteProtection.protect(request);

    if (decision.isDenied()) {
      return createContactErrorResponse({
        status: 403,
        message: 'forbidden',
      });
    }
  }

  const requestBody = await getRequestJson(request);
  const parsedBody = contactFormSchema.safeParse(requestBody);

  if (!parsedBody.success) {
    return createContactErrorResponse({
      status: 400,
      message: 'invalid_request',
    });
  }

  const upstreamResponse = await fetch(
    `https://formsubmit.co/ajax/${Env.FORMSUBMIT_EMAIL}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: parsedBody.data.name,
        email: parsedBody.data.email,
        phone: parsedBody.data.phone,
        message: parsedBody.data.message,
        _captcha: 'false',
        _subject: 'New contact form submission',
      }),
      signal: AbortSignal.timeout(10_000),
    }
  ).catch(() => null);

  if (upstreamResponse === null || !upstreamResponse.ok) {
    return createContactErrorResponse({
      status: 502,
      message: 'submit_error',
    });
  }

  const responseBody: ContactFormResponse = {
    ok: true,
  };

  return NextResponse.json(responseBody);
}
