import * as z from 'zod';

export const CONTACT_FORM_FIELD_LIMITS = {
  name: 80,
  email: 120,
  phone: 30,
  message: 2000,
} as const;

type ContactFormValidationMessages = {
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string;
};

const defaultContactFormValidationMessages: ContactFormValidationMessages = {
  name: 'Enter your full name.',
  email: 'Enter a valid email address.',
  phone: 'Enter a valid phone number.',
  message: 'Enter a message with at least 10 characters.',
  website: 'invalid_request',
};

export function getContactFormSchema(props?: {
  messages?: ContactFormValidationMessages;
}) {
  const messages = props?.messages ?? defaultContactFormValidationMessages;

  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, messages.name)
        .max(CONTACT_FORM_FIELD_LIMITS.name, messages.name),
      email: z
        .string()
        .trim()
        .min(1, messages.email)
        .max(CONTACT_FORM_FIELD_LIMITS.email, messages.email)
        .pipe(z.email(messages.email)),
      phone: z
        .string()
        .trim()
        .min(1, messages.phone)
        .max(CONTACT_FORM_FIELD_LIMITS.phone, messages.phone)
        .regex(/^[+\d().\-\s]{7,}$/, messages.phone),
      message: z
        .string()
        .trim()
        .min(10, messages.message)
        .max(CONTACT_FORM_FIELD_LIMITS.message, messages.message),
      website: z.string().trim().max(0, messages.website).default(''),
    })
    .strict();
}

export const contactFormSchema = getContactFormSchema();

export type ContactFormInput = z.input<typeof contactFormSchema>;

export type ContactFormValues = z.output<typeof contactFormSchema>;

export const contactFormResponseMessageSchema = z.enum([
  'forbidden',
  'invalid_request',
  'submit_error',
]);

export type ContactFormResponseMessage = z.infer<
  typeof contactFormResponseMessageSchema
>;

export const contactFormResponseSchema = z.discriminatedUnion('ok', [
  z.object({
    ok: z.literal(true),
  }),
  z.object({
    ok: z.literal(false),
    message: contactFormResponseMessageSchema,
  }),
]);

export type ContactFormResponse = z.infer<typeof contactFormResponseSchema>;

export function parseContactFormJsonResponse(value: unknown) {
  return contactFormResponseSchema.safeParse(value);
}
