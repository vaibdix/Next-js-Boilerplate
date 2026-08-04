import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

export const Env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    ARCJET_KEY: z.string().startsWith('ajkey_').optional(),
    BETTER_STACK_INGESTING_HOST: z.string().optional(),
    BETTER_STACK_SOURCE_TOKEN: z.string().optional(),
    CLERK_SECRET_KEY: z.string().min(1),
    FORMSUBMIT_EMAIL: z.email(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_LOGGING_LEVEL: z
      .enum(['error', 'info', 'debug', 'warning', 'trace', 'fatal'])
      .default('info'),
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().startsWith('G-').optional(),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  runtimeEnv: {
    ARCJET_KEY: process.env['ARCJET_KEY'],
    BETTER_STACK_INGESTING_HOST: process.env['BETTER_STACK_INGESTING_HOST'],
    BETTER_STACK_SOURCE_TOKEN: process.env['BETTER_STACK_SOURCE_TOKEN'],
    CLERK_SECRET_KEY: process.env['CLERK_SECRET_KEY'],
    FORMSUBMIT_EMAIL: process.env['FORMSUBMIT_EMAIL'],
    NEXT_PUBLIC_APP_URL: process.env['NEXT_PUBLIC_APP_URL'],
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env['NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'],
    NEXT_PUBLIC_LOGGING_LEVEL: process.env['NEXT_PUBLIC_LOGGING_LEVEL'],
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'],
    NODE_ENV: process.env.NODE_ENV,
  },
});
