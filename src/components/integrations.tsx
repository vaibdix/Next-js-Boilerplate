import {
  ArrowUpRightIcon,
  BotIcon,
  BugIcon,
  CheckCircle2Icon,
  FileCode2Icon,
  FolderGit2Icon,
  GlobeIcon,
  KeyRoundIcon,
  SearchIcon,
  ShieldCheckIcon,
  SquareCodeIcon,
  WrenchIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Integration = {
  icon: LucideIcon;
  name: string;
  description: string;
};

const data: Integration[] = [
  {
    icon: SquareCodeIcon,
    name: 'Next.js',
    description:
      'App Router support with modern full-stack React architecture.',
  },
  {
    icon: FileCode2Icon,
    name: 'TypeScript',
    description: 'Type safety, autocomplete, and scalable maintainable code.',
  },
  {
    icon: KeyRoundIcon,
    name: 'Clerk Auth',
    description:
      'Passwordless login, social auth, sessions, and multi-factor authentication.',
  },
  {
    icon: GlobeIcon,
    name: 'Internationalization',
    description:
      'Multi-language support using next-intl with Crowdin translations.',
  },
  {
    icon: CheckCircle2Icon,
    name: 'Forms & Validation',
    description:
      'React Hook Form handling with robust schema validation using Zod.',
  },
  {
    icon: WrenchIcon,
    name: 'Linting & Formatting',
    description: 'Automated code quality with OxLint and formatting via OxFmt.',
  },
  {
    icon: FolderGit2Icon,
    name: 'Git Workflow',
    description:
      'Pre-commit hooks and commit message linting using Lefthook and Commitlint.',
  },
  {
    icon: BotIcon,
    name: 'CodeRabbit',
    description:
      'AI-powered pull request reviews for cleaner and faster shipping.',
  },
  {
    icon: BugIcon,
    name: 'Monitoring',
    description:
      'Production monitoring with Sentry and structured logging via LogTape.',
  },
  {
    icon: ShieldCheckIcon,
    name: 'Security',
    description:
      'Bot protection, abuse prevention, and rate limiting with Arcjet.',
  },
  {
    icon: SearchIcon,
    name: 'SEO',
    description:
      'Metadata, Open Graph, JSON-LD, and search engine optimization.',
  },
  {
    icon: WrenchIcon,
    name: 'Developer Tools',
    description:
      'VSCode config, bundle analyzer, release workflow, and changelog tools.',
  },
];

export function Integrations() {
  return (
    <>
      <h2 className="my-5 text-xl font-medium">
        Boilerplate code for your Next.js project with Tailwind CSS
      </h2>
      <div
        className={cn(
          'mx-auto grid gap-1 overflow-hidden rounded-md bg-secondary p-1 sm:grid-cols-2 lg:grid-cols-4 dark:bg-secondary/50'
        )}
      >
        {data.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.name}
              className="group relative flex flex-col justify-between gap-3 rounded-md bg-background p-6 shadow-sm transition-colors hover:bg-muted/50"
            >
              <div className="w-fit rounded-md border bg-muted p-2">
                <Icon className="size-5" />
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-xs text-muted-foreground md:text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}

        <div className="relative flex items-center justify-center p-1 sm:col-span-2 lg:col-span-4">
          <Button className="group text-xs" size="sm" variant="link">
            View all integrations
            <ArrowUpRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </>
  );
}
