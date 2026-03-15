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
    headline1:        'Online booking that',
    headline2:        'just works',
    subheadline:      'Give your business a professional booking page in minutes. Customers book, you get notified, everyone knows what\'s happening.',
    emailPlaceholder: 'Enter your email',
    cta:              'Get started',
    trialNote:        '7-day free trial · No credit card required',
  },

  // ── Overview (mock UI preview on landing) ─────────────────────────────────
  overview: {
    statsToday:      "Today's bookings",
    statusConfirmed: 'confirmed',
    statusPending:   'pending',
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
    tagline:    '© 2026 BookFlow. Built for businesses that take appointments.',
    signIn:     'Sign in',
    getStarted: 'Get started',
    privacy:    'Privacy',
    terms:      'Terms',
  },

  // ── Booking wizard ────────────────────────────────────────────────────────
  booking: {
    locale:              'en',
    // Step nav labels
    stepService:         'Service',
    stepStaff:           'Specialist',
    stepDateTime:        'Date & time',
    stepDetails:         'Details',
    stepConfirm:         'Confirm',
    back:                'Back',
    // Step titles / subtitles
    stepServiceTitle:    'Choose a service',
    stepServiceSub:      'Select the service you\'d like to book.',
    stepStaffTitle:      'Choose a specialist',
    stepDateTimeTitle:   'Pick a date & time',
    stepDetailsTitle:    'Your details',
    stepDetailsSub:      'We need a few details to confirm your booking.',
    stepConfirmTitle:    'Review your booking',
    stepConfirmSub:      'Please check everything before confirming.',
    // Staff
    anyoneAvailable:     'Anyone available',
    anyoneAvailableSub:  'We\'ll assign the first available specialist.',
    noStaff:             'No specialists available for this service.',
    // Date / time
    selectDate:          'Select a date',
    selectTime:          'Select a time',
    noAvailableDatesTitle: 'No available dates',
    noAvailableDatesSub:   'The business may not have set their schedule yet.',
    noSlots:             'No available slots for this date.',
    // Details form
    labelName:           'Full name',
    labelEmail:          'Email',
    labelPhone:          'Phone number',
    labelNotes:          'Notes',
    optional:            'optional',
    placeholderName:     'Anna Smith',
    placeholderNotes:    'Anything we should know?',
    looksGood:           'Looks good',
    reviewBooking:       'Review booking',
    // Confirm step
    bookingSummary:      'Booking summary',
    rowService:          'Service',
    rowDuration:         'Duration',
    rowPrice:            'Price',
    rowStaff:            'Specialist',
    rowDate:             'Date',
    rowTime:             'Time',
    rowName:             'Name',
    rowEmail:            'Email',
    rowPhone:            'Phone',
    rowNotes:            'Notes',
    cancellationPolicy:  'Cancellation policy',
    confirmBooking:      'Confirm booking',
    confirming:          'Confirming…',
    // Success
    successTitle:        'You\'re booked!',
    successEmailSent:    'Confirmation sent to {{email}}',
    successSaveRef:      'Check your details below — please save your booking reference.',
    bookingRef:          'Booking ref',
    at:                  'at',
    followUs:            'Follow us',
    // Misc
    min:                 'min',
    errorGeneric:        'Something went wrong. Please try again.',
    errorNameParts:      'Please enter your first and last name',
    errorNameShort:      'Each name must be at least 2 characters',
    errorEmailRequired:  'Email is required',
    errorEmailInvalid:   'Please enter a valid email address',
    errorPhoneRequired:  'Phone number is required',
    errorPhoneShort:     'Please enter a valid phone number (min 7 digits)',
    errorPhoneInvalid:   'Only digits, spaces, +, - and () allowed',
    anyoneAvailableStaffName: 'Anyone available',
  },

  // ── Signup ────────────────────────────────────────────────────────────────
  signup: {
    heading:                 'Create your BookFlow account',
    subheading:              'Start your 7-day free trial. No credit card required.',
    labelFirstName:          'First name',
    labelLastName:           'Last name',
    labelBusinessName:       'Business name',
    labelUrl:                'Your booking URL',
    labelEmail:              'Email',
    labelPassword:           'Password',
    labelConfirmPassword:    'Confirm password',
    placeholderFirstName:    'Anna',
    placeholderLastName:     'Smith',
    placeholderBusinessName: 'Glow Beauty Studio',
    placeholderEmail:        'anna@example.com',
    placeholderPassword:     '········',
    placeholderConfirmPassword: '········',
    slugWarning:             'Choose carefully — your booking URL cannot be changed after signup.',
    submit:                  'Create account',
    submitting:              'Creating…',
    noCreditCard:            'No credit card required · Cancel anytime',
    alreadyHaveAccount:      'Already have an account?',
    signIn:                  'Sign in',
    errorPasswordMismatch:   'Passwords don\'t match',
    errorPasswordShort:      'Password must be at least 8 characters',
    errorGeneric:            'Something went wrong. Please try again.',
  },
} as const

export type PublicDict = typeof en
export default en
