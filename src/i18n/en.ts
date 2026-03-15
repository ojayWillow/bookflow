/**
 * English translations — public-facing pages
 * (landing, booking wizard, signup)
 */
const en = {
  // ── Nav ──────────────────────────────────────────────────────────────────
  nav: {
    features:  'Features',
    pricing:   'Pricing',
    signIn:    'Sign in',
    tryFree:   'Try free for 7 days',
  },

  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    headline1:   'Online booking that',
    headline2:   'just works',
    subheadline: 'Give your business a professional booking page in minutes. Customers book, you get notified, everyone knows what\'s happening.',
    emailPlaceholder: 'Enter your email',
    cta:         'Get started',
    trialNote:   '7-day free trial · No credit card required',
  },

  // ── Features ─────────────────────────────────────────────────────────────
  features: {
    sectionTitle: 'Everything a booking system needs',
    sectionSub:   'Simple to set up. Powerful enough for any business.',
    items: [
      { title: 'Smart scheduling',     desc: 'Set your open days, hours, and slot intervals. The system handles the rest.' },
      { title: 'Custom durations',     desc: 'Each service has its own duration. No double-bookings, ever.' },
      { title: 'Fully configurable',   desc: 'Service names, prices, descriptions — all editable in seconds.' },
      { title: 'Instant confirmation', desc: 'Every booking sends a full summary by email. Customers always know what to expect.' },
      { title: 'Any business type',    desc: 'Beauty, medical, auto, fitness, consulting — one platform fits all.' },
      { title: 'Up in minutes',        desc: 'No technical setup. Add your services, set your hours, share your link.' },
    ],
  },

  // ── Pricing ───────────────────────────────────────────────────────────────
  pricing: {
    sectionTitle: 'Simple pricing',
    sectionSub:   'Try any plan free for 7 days. No credit card required.',
    mostPopular:  'Most popular',
    perMonth:     '/mo',
    afterTrial:   'after 7-day free trial',
    cancelNote:   'Cancel anytime. No contracts.',
    cta:          'Start free trial',
    plans: [
      {
        name: 'Starter',
        features: ['1 location', 'Up to 5 services', 'Email confirmations', 'Basic branding'],
      },
      {
        name: 'Pro',
        features: ['Unlimited services', 'Custom domain', 'SMS reminders', 'Analytics dashboard', 'Priority support'],
      },
      {
        name: 'Agency',
        features: ['Multiple locations', 'White-label resale', 'API access', 'Dedicated support', 'Custom integrations'],
      },
    ],
  },

  // ── Testimonials ──────────────────────────────────────────────────────────
  testimonials: {
    sectionTitle: 'Businesses love it',
    items: [
      {
        name: 'Marina K.',
        business: 'Marina BeautyRoom',
        text: 'My clients book online now instead of messaging me at midnight. Life changing.',
      },
      {
        name: 'Andris P.',
        business: 'AutoPro Rīga',
        text: 'We went from a paper diary to a fully digital booking system in one afternoon.',
      },
      {
        name: 'Jekaterina S.',
        business: 'Old Riga SPA',
        text: 'The confirmation emails alone save me 20 messages a day. Customers always know their details.',
      },
    ],
  },

  // ── Final CTA ─────────────────────────────────────────────────────────────
  cta: {
    headline: 'Ready to take bookings online?',
    sub:      'Try BookFlow free for 7 days. No credit card, no contracts.',
    button:   'Start your free trial →',
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    tagline: '© 2026 BookFlow. Built for businesses that take appointments.',
    signIn:     'Sign in',
    getStarted: 'Get started',
    privacy:    'Privacy',
    terms:      'Terms',
  },

  // ── Booking page ──────────────────────────────────────────────────────────
  booking: {
    stepService:  'Choose service',
    stepStaff:    'Choose specialist',
    stepDatetime: 'Choose time',
    stepDetails:  'Your details',
    stepConfirm:  'Confirm',
    next:         'Next',
    back:         'Back',
    confirm:      'Confirm booking',
    bookAgain:    'Book again',
    namePlaceholder:  'Full name',
    emailPlaceholder: 'Email address',
    phonePlaceholder: 'Phone number',
    notesPlaceholder: 'Any notes for us? (optional)',
    duration:    'min',
    successTitle: 'You\'re booked!',
    successSub:   'A confirmation has been sent to your email.',
    ref:          'Booking reference',
    noStaffPref:  'No preference',
    selectDate:   'Select a date',
    selectTime:   'Select a time',
    noSlots:      'No available slots for this date.',
    cancelLink:   'Need to cancel?',
  },

  // ── Signup ────────────────────────────────────────────────────────────────
  signup: {
    title:            'Create your account',
    sub:              'Start your 7-day free trial. No credit card required.',
    emailLabel:       'Email',
    passwordLabel:    'Password',
    businessLabel:    'Business name',
    submit:           'Create account',
    alreadyAccount:   'Already have an account?',
    signInLink:       'Sign in',
    passwordHint:     'At least 8 characters',
  },
} as const

export type PublicDict = typeof en
export default en
