import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n/index'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export async function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = {
    lv: 'BookFlow — Online rezervāciju sistēma',
    ru: 'BookFlow — Онлайн-запись',
    en: 'BookFlow — Online booking for any business',
  }
  const descs: Record<string, string> = {
    lv: 'Vienkārša un ātra online rezervāciju sistēma jebkuram biznesam.',
    ru: 'Простая система онлайн-zapisи для любого бизнеса.',
    en: 'Simple online booking for any business. Up in minutes.',
  }
  return {
    title:       titles[locale] ?? titles.lv,
    description: descs[locale]  ?? descs.lv,
    alternates: {
      languages: {
        'lv': '/lv',
        'ru': '/ru',
        'en': '/en',
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!(locales as readonly string[]).includes(locale)) notFound()

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}
