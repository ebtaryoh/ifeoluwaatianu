import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ibitayo & Odunayo | Wedding | November 28, 2026',
  description: 'Join Ibitayo Martins Akinnibosun and Odunayo Janet Akinde as they celebrate their wedding on November 28, 2026.',
  openGraph: {
    title: 'Ibitayo & Odunayo | Our Wedding Day',
    description: 'Two hearts. One covenant. A lifetime together.',
    type: 'website',
    images: ['/wedding-hero.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ibitayo & Odunayo | Our Wedding Day',
    description: 'November 28, 2026 · Ogun State, Nigeria',
    images: ['/wedding-hero.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
