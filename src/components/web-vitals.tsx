'use client';

import { useReportWebVitals } from 'next/web-vitals';

import { trackEvent } from '@/libs/analytics';

interface WebVitalMetric {
  delta: number;
  id: string;
  name: string;
  rating: string;
}

export const WebVitals = () => {
  useReportWebVitals((metric: WebVitalMetric) => {
    const { name, delta, id, rating } = metric;

    trackEvent(name, {
      value: Math.round(name === 'CLS' ? delta * 1000 : delta),
      event_label: id,
      metric_rating: rating,
      non_interaction: true,
    });
  });
  return null;
};
