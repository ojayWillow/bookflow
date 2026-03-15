/**
 * Root layout — minimal shell.
 * The <html lang> attribute is set in [locale]/layout.tsx.
 * globals.css and the font are loaded here so they apply
 * to all routes including /admin (which bypasses [locale]).
 */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
})

export const metadata: Metadata = {
  title: 'BookFlow',
  description: 'Simple booking for any business',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
