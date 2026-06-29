import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Meaningful toys for curious minds`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF7E6',
    theme_color: '#6B4FA0',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
  };
}
