export const HelloSkeleton = () => {
  return (
    <div aria-hidden className="animate-pulse [&_div]:my-6">
      <div className="h-5 w-64 max-w-full rounded bg-muted" />
      <div className="h-5 w-full max-w-2xl rounded bg-muted" />
    </div>
  );
};
