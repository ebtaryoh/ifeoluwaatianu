import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://odunayoandibitayo.com'),
  title: 'Odunayo & Ibitayo | Wedding | November 28, 2026',
  description: 'Join Odunayo Janet Akinde and Ibitayo Martins Akinnibosun as they celebrate their wedding on November 28, 2026.',
  openGraph: {
    title: 'Odunayo & Ibitayo | Our Wedding Day',
    description: 'Two hearts. One covenant. A lifetime together.',
    type: 'website',
    images: ['/wedding-hero.jpeg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odunayo & Ibitayo | Our Wedding Day',
    description: 'November 28, 2026 · Ogun State, Nigeria',
    images: ['/wedding-hero.jpeg'],
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
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
