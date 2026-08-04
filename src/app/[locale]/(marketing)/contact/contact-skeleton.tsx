const CONTACT_INFO_COUNT = 2;
const INPUT_FIELD_COUNT = 3;

export const ContactSkeleton = () => {
  return (
    <div
      aria-hidden
      className="relative grid h-full w-full animate-pulse border md:grid-cols-2"
    >
      <div className="col-span-1 flex flex-col space-y-4 p-8">
        <div className="h-8 w-64 rounded-md bg-muted md:h-9" />
        <div className="space-y-2">
          <div className="h-4 w-full max-w-md rounded bg-muted" />
          <div className="h-4 w-3/4 max-w-md rounded bg-muted" />
        </div>
        <div className="h-3 w-2/3 max-w-md rounded bg-muted" />
        <div className="grid gap-4">
          {Array.from({ length: CONTACT_INFO_COUNT }, (_, index) => (
            <div key={index} className="flex items-center gap-3 py-3">
              <div className="size-11 rounded-lg border bg-card" />
              <div className="space-y-2">
                <div className="h-4 w-20 rounded bg-muted" />
                <div className="h-3 w-32 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-1 flex items-center border-t p-8 md:border-t-0 md:border-l">
        <div className="w-full space-y-6">
          {Array.from({ length: INPUT_FIELD_COUNT }, (_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-10 w-full rounded-md border bg-card" />
            </div>
          ))}
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-24 w-full rounded-md border bg-card" />
          </div>
          <div className="h-10 w-full rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
};
