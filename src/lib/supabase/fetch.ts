/**
 * Fetch wrapper that opts Supabase requests out of Next.js's Data Cache.
 *
 * Next.js patches the global `fetch` and may cache GET responses (PostgREST
 * reads) across requests — even in routes marked `force-dynamic`. This served
 * year-stale slot-availability data in /api/slots and would let customers
 * double-book. Every server-side Supabase client must pass this as
 * `global.fetch`.
 */
export const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: 'no-store' })
