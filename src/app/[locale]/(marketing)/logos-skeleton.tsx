export const LogosSkeleton = () => {
  return (
    <section aria-hidden className="mb-12 animate-pulse">
      <div className="mx-auto h-7 w-64 rounded bg-muted py-6" />
      <div className="mt-6 flex items-center justify-center gap-8">
        <div className="h-8 w-24 rounded bg-muted" />
        <div className="h-8 w-24 rounded bg-muted" />
        <div className="hidden h-8 w-24 rounded bg-muted md:block" />
        <div className="hidden h-8 w-24 rounded bg-muted md:block" />
      </div>
    </section>
  );
};
