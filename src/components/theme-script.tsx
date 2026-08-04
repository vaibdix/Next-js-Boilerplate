'use client';

import { useServerInsertedHTML } from 'next/navigation';
import { useRef } from 'react';

import { MEDIA_QUERY, THEME_COOKIE_NAME } from '@/lib/theme';

export const ThemeScript = () => {
  const inserted = useRef(false);
  const script = `(function(){try{var m=document.cookie.match(/(?:^|;\\s*)${THEME_COOKIE_NAME}=([^;]+)/);var t=m?m[1]:'system';if(t!=='light'&&t!=='dark'&&t!=='system')t='system';if(t==='system')t=matchMedia('${MEDIA_QUERY}').matches?'dark':'light';var d=document.documentElement;d.classList.remove('light','dark');d.classList.add(t);d.style.colorScheme=t}catch(e){}})();`;

  useServerInsertedHTML(() => {
    if (inserted.current) {
      return null;
    }
    inserted.current = true;
    return <script dangerouslySetInnerHTML={{ __html: script }} />;
  });

  return null;
};
