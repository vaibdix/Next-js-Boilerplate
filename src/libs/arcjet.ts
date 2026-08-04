import arcjet, { shield } from '@arcjet/next';

export const createArcjetClient = (key: string) =>
  arcjet({
    key,
    characteristics: ['ip.src'],
    rules: [
      shield({
        mode: 'LIVE',
      }),
    ],
  });
