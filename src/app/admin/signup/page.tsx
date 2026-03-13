import { redirect } from 'next/navigation'

// /admin/signup has been moved to /signup.
// Redirect any old links so nothing breaks.
export default function AdminSignupRedirect() {
  redirect('/signup')
}
