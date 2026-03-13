import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BookingWizard from './BookingWizard'

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * Server Component — resolves the business slug from Supabase.
 * Returns a 404 for unknown slugs.
 * Passes the resolved business data down to the client-side BookingWizard.
 */
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
