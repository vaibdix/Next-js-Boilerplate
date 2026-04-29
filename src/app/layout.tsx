import '@/styles/global.css';

/**
 * Pass-through root layout. The locale layout at [locale]/layout.tsx provides
 * the real html/body shell. This file exists so global CSS is bundled for the
 * root not-found page and any other non-locale routes.
 * @param props - Layout props containing children.
 * @returns The children without additional wrapping.
 */
export default function RootLayout(props: {
  children: React.ReactNode;
}): React.ReactNode {
  return props.children;
}
