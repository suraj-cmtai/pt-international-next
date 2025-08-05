import { NextResponse } from 'next/server';

const BASE_URL = 'https://yourdomain.com'; // Change this to your global URL

export async function GET() {
  const routes = [
    '',
    'about-us',
    'gallery',
    'products',
    'services',
    'contact',
  ];

  const urls = routes.map(
    (route) => `
    <url>
      <loc>${BASE_URL}/${route}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
  ).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
