'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

function Label(props: React.ComponentProps<'label'>) {
  return (
    <label
      {...props}
      data-slot="label"
      htmlFor={props.htmlFor}
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        props.className
      )}
    />
  );
}

export { Label };
