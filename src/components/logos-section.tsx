import { LogoCloud } from '@/components/logo-cloud'; // @efferd/logo-cloud-2
import { DecorIcon } from '@/components/ui/decor-icon';
import { FullWidthDivider } from '@/components/ui/full-width-divider';

export function LogosSection() {
  return (
    <section className="mb-12">
      <h2 className="py-6 text-center text-lg font-medium tracking-tight text-muted-foreground md:text-xl">
        Trusted by <span className="text-foreground">experts</span>
      </h2>
      <div className="relative *:border-0">
        <DecorIcon className="size-4" position="top-left" />
        <DecorIcon className="size-4" position="top-right" />
        <DecorIcon className="size-4" position="bottom-left" />
        <DecorIcon className="size-4" position="bottom-right" />

        <FullWidthDivider className="-top-px" />
        <LogoCloud />
        <FullWidthDivider className="-bottom-px" />
      </div>
    </section>
  );
}
