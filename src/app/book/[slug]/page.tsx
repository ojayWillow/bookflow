import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import BookingWizard from './BookingWizard'

// Always fetch fresh from Supabase — business settings and staff hours
// must reflect instantly when the owner makes changes.
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: business } = await supabase
    .from('business_settings')
    .select('name, tagline, logo_url, cover_url')
    .eq('slug', slug)
    .single()

  if (!business) {
    return { title: 'Book an appointment' }
  }

  const appUrl   = process.env.NEXT_PUBLIC_APP_URL ?? 'https://bookflow.app'
  const ogImage  = business.cover_url || business.logo_url || undefined
  const description = business.tagline
    ? `${business.tagline} — Book your appointment online.`
    : `Book an appointment with ${business.name} online.`

  return {
    title: `Book with ${business.name}`,
    description,
    openGraph: {
      title:       `Book with ${business.name}`,
      description,
      url:         `${appUrl}/book/${slug}`,
      siteName:    business.name,
      images:      ogImage ? [{ url: ogImage }] : [],
      type:        'website',
    },
    twitter: {
      card:        ogImage ? 'summary_large_image' : 'summary',
      title:       `Book with ${business.name}`,
      description,
      images:      ogImage ? [ogImage] : [],
    },
  }
}

export default async function BookingPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: business, error } = await supabase
    .from('business_settings')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !business) {
    notFound()
  }

  return <BookingWizard business={business} />
}
