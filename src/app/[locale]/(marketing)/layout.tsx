import { setRequestLocale } from 'next-intl/server';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { cn } from '@/lib/utils';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden px-4 supports-[overflow:clip]:overflow-clip">
      <Header />
      <main
        className={cn(
          'relative mx-auto w-full max-w-7xl grow',
          'before:absolute before:-inset-y-14 before:-left-px before:w-px before:bg-border',
          'after:absolute after:-inset-y-14 after:-right-px after:w-px after:bg-border'
        )}
      >
        {props.children}
      </main>
      <Footer />
    </div>
  );
}
