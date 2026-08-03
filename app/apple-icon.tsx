import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/**
 * iOS ignores SVG favicons for home-screen shortcuts, so it needs a raster
 * one. Generated rather than committed as a binary: the colours stay tied
 * to the design tokens and there is no image file to keep in sync.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1815',
          color: '#faf8f3',
          fontSize: 84,
          fontWeight: 600,
          letterSpacing: -3,
          fontFamily: 'sans-serif',
        }}
      >
        SF
      </div>
    ),
    size,
  );
}
