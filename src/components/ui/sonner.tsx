'use client';

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { Toaster as Sonner } from 'sonner';
import type { ToasterProps } from 'sonner';
import { useTheme } from '@/components/theme-provider';

function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme();

  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- CSS custom properties require type assertion
  const toasterStyle = {
    '--normal-bg': 'var(--popover)',
    '--normal-text': 'var(--popover-foreground)',
    '--normal-border': 'var(--border)',
    '--border-radius': 'var(--radius)',
  } as React.CSSProperties;

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={toasterStyle}
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
