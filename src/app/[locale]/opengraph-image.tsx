import { ImageResponse } from 'next/og';

import { AppConfig } from '@/utils/app-config';

export const alt = AppConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const Image = () => {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 700 }}>{AppConfig.name}</div>
      <div style={{ fontSize: 28, marginTop: 16, color: '#a1a1aa' }}>
        Built with Next.js, Tailwind CSS, and TypeScript
      </div>
    </div>,
    { ...size }
  );
};

export default Image;
