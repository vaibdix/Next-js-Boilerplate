export const HeroSkeleton = () => {
  return (
    <section aria-hidden className="animate-pulse">
      <div className="flex flex-col items-center justify-center gap-5 px-4 py-12 md:px-4 md:py-24 lg:py-28">
        <div className="h-6 w-48 rounded-full bg-muted" />
        <div className="h-10 w-3/4 max-w-2xl rounded-md bg-muted md:h-12" />
        <div className="h-10 w-2/3 max-w-xl rounded-md bg-muted md:h-12" />
        <div className="h-5 w-full max-w-md rounded bg-muted" />
        <div className="flex gap-3">
          <div className="h-10 w-32 rounded-md bg-muted" />
          <div className="h-10 w-32 rounded-md bg-muted" />
        </div>
      </div>
    </section>
  );
};
