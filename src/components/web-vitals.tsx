'use client';

import { useReportWebVitals } from 'next/web-vitals';

import { trackEvent } from '@/libs/Analytics';

/**
 * Reports Core Web Vitals (LCP, FID, CLS, FCP, TTFB) to Google Analytics.
 * @returns null — renders nothing.
 */
export function WebVitals() {
  /* oxlint-disable typescript/no-unsafe-assignment, typescript/no-unsafe-argument -- metric type from next/dist/compiled/web-vitals lacks .d.ts declarations */
  useReportWebVitals((metric) => {
    const { name, delta, id, rating } = metric;

    trackEvent(name, {
      value: Math.round(name === 'CLS' ? delta * 1000 : delta),
      event_label: id,
      metric_rating: rating,
      non_interaction: true,
    });
  });
  /* oxlint-enable typescript/no-unsafe-assignment, typescript/no-unsafe-argument */
  return null;
}
