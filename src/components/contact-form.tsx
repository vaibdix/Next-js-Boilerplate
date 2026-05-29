'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAnnounce } from '@/components/announcer';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  CONTACT_FORM_FIELD_LIMITS,
  getContactFormSchema,
  parseContactFormJsonResponse,
} from '@/validations/contact-form';
import type {
  ContactFormInput,
  ContactFormValues,
} from '@/validations/contact-form';

const defaultContactFormValues: ContactFormInput = {
  name: '',
  email: '',
  phone: '',
  message: '',
  website: '',
};

type SubmitState = 'idle' | 'success' | 'error';

async function getResponseJson(response: Response) {
  try {
    const value: unknown = await response.json();

    return value;
  } catch {
    return null;
  }
}

export function ContactForm() {
  const t = useTranslations('Contact');
  const announce = useAnnounce();
  const [submitState, setSubmitState] = React.useState<SubmitState>('idle');
  const contactFormSchema = getContactFormSchema({
    messages: {
      name: t('form_name_error'),
      email: t('form_email_error'),
      phone: t('form_phone_error'),
      message: t('form_message_error'),
      website: 'invalid_request',
    },
  });

  const form = useForm<ContactFormInput, undefined, ContactFormValues>({
    defaultValues: defaultContactFormValues,
    mode: 'onBlur',
    resolver: zodResolver(contactFormSchema),
  });

  async function handleSubmit(values: ContactFormValues) {
    setSubmitState('idle');

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    }).catch(() => null);

    if (response === null) {
      setSubmitState('error');
      toast.error(t('form_submit_error'));
      announce(t('form_submit_error'));
      return;
    }

    const responseJson = await getResponseJson(response);
    const parsedResponse = parseContactFormJsonResponse(responseJson);

    if (!response.ok || !parsedResponse.success || !parsedResponse.data.ok) {
      setSubmitState('error');
      toast.error(t('form_submit_error'));
      announce(t('form_submit_error'));
      return;
    }

    form.reset(defaultContactFormValues);
    setSubmitState('success');
    toast.success(t('form_success'));
    announce(t('form_success'));
  }

  return (
    <form
      className="w-full"
      noValidate
      onSubmit={(event) => {
        void form.handleSubmit(handleSubmit)(event);
      }}
    >
      <div
        aria-hidden="true"
        className="absolute top-auto h-px w-px overflow-hidden"
      >
        <Input
          autoComplete="off"
          tabIndex={-1}
          type="text"
          {...form.register('website')}
        />
      </div>
      <FieldGroup>
        <Field data-invalid={form.formState.errors.name !== undefined}>
          <FieldLabel htmlFor="name">{t('form_name')}</FieldLabel>
          <FieldContent>
            <Input
              aria-invalid={form.formState.errors.name !== undefined}
              autoComplete="name"
              id="name"
              maxLength={CONTACT_FORM_FIELD_LIMITS.name}
              placeholder={t('form_name_placeholder')}
              {...form.register('name')}
            />
            <FieldError errors={[form.formState.errors.name]} />
          </FieldContent>
        </Field>
        <Field data-invalid={form.formState.errors.email !== undefined}>
          <FieldLabel htmlFor="email">{t('form_email')}</FieldLabel>
          <FieldContent>
            <Input
              aria-invalid={form.formState.errors.email !== undefined}
              autoComplete="email"
              id="email"
              maxLength={CONTACT_FORM_FIELD_LIMITS.email}
              placeholder={t('form_email_placeholder')}
              type="email"
              {...form.register('email')}
            />
            <FieldError errors={[form.formState.errors.email]} />
          </FieldContent>
        </Field>
        <Field data-invalid={form.formState.errors.phone !== undefined}>
          <FieldLabel htmlFor="phone">{t('form_phone')}</FieldLabel>
          <FieldContent>
            <Input
              aria-invalid={form.formState.errors.phone !== undefined}
              autoComplete="tel"
              id="phone"
              maxLength={CONTACT_FORM_FIELD_LIMITS.phone}
              placeholder={t('form_phone_placeholder')}
              type="tel"
              {...form.register('phone')}
            />
            <FieldError errors={[form.formState.errors.phone]} />
          </FieldContent>
        </Field>
        <Field data-invalid={form.formState.errors.message !== undefined}>
          <FieldLabel htmlFor="message">{t('form_message')}</FieldLabel>
          <FieldContent>
            <Textarea
              aria-invalid={form.formState.errors.message !== undefined}
              id="message"
              maxLength={CONTACT_FORM_FIELD_LIMITS.message}
              placeholder={t('form_message_placeholder')}
              {...form.register('message')}
            />
            <FieldError errors={[form.formState.errors.message]} />
          </FieldContent>
        </Field>
      </FieldGroup>
      {submitState === 'error' && (
        <p className="mt-6 text-sm text-destructive" role="alert">
          {t('form_submit_error')}
        </p>
      )}
      {submitState === 'success' && (
        <output className="mt-6 block text-sm text-muted-foreground">
          {t('form_success')}
        </output>
      )}
      <Button
        className="mt-8 w-full"
        disabled={form.formState.isSubmitting}
        type="submit"
      >
        {form.formState.isSubmitting
          ? t('form_submit_pending')
          : t('form_submit')}
      </Button>
    </form>
  );
}
