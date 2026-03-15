/**
 * English translations — admin panel
 */
const adminEn = {
  // ── Nav / layout ──────────────────────────────────────────────────────────
  nav: {
    overview:  'Overview',
    bookings:  'Bookings',
    services:  'Services',
    staff:     'Staff',
    settings:  'Settings',
    signOut:   'Sign out',
    signingOut: 'Signing out…',
  },

  // ── Overview ──────────────────────────────────────────────────────────────
  overview: {
    title:          'Overview',
    day:            'Day',
    week:           'Week',
    today:          'Today',
    statsToday:     "Today's appointments",
    statsPending:   'Pending confirmation',
    statsRevenue:   'Total revenue',
    statsStaff:     'Active staff',
  },

  // ── Bookings ──────────────────────────────────────────────────────────────
  bookings: {
    title:            'Bookings',
    confirmedCount:   '{{count}} confirmed booking',
    confirmedCountPlural: '{{count}} confirmed bookings',
    refresh:          'Refresh',
    searchPlaceholder: 'Search by name, email, service or ref...',
    filterAll:        'All',
    noBookings:       'No bookings yet',
    noBookingsSub:    'Bookings will appear here once customers book through your booking page.',
    noResults:        'No bookings match your search',
    reschedule:       'Reschedule',
    markComplete:     'Mark complete',
    cancel:           'Cancel',
    restore:          'Restore',
    completed:        'Completed ✓',
    rescheduleTitle:  'Reschedule booking',
    newDate:          'New date',
    newTime:          'New time',
    saveChanges:      'Save changes',
    saving:           'Saving…',
    // toasts
    toastRestored:    'Booking restored',
    toastCompleted:   'Marked as complete',
    toastCancelled:   'Booking cancelled',
    toastRescheduled: 'Booking rescheduled',
    toastStatusFail:  'Failed to update booking status',
    toastRescheduleFail: 'Failed to reschedule',
  },

  // ── Services ──────────────────────────────────────────────────────────────
  services: {
    title:            'Services',
    sub:              'Manage what you offer and your pricing',
    addService:       '+ Add service',
    noServices:       'No services yet',
    noServicesSub:    'Add your first service to start taking bookings.',
    editService:      'Edit service',
    newService:       'New service',
    nameLabel:        'Service name',
    namePlaceholder:  'e.g. Deep Tissue Massage',
    descLabel:        'Description',
    descPlaceholder:  'Short description shown to clients',
    durationLabel:    'Duration (minutes)',
    priceLabel:       'Price (€)',
    save:             'Save service',
    edit:             'Edit',
    delete:           'Delete',
    deleteConfirm:    'Delete this service?',
    // toasts
    toastCreated:     'Service created',
    toastUpdated:     'Service updated',
    toastDeleted:     'Service deleted',
    toastSaveFail:    'Failed to save service',
    toastDeleteFail:  'Failed to delete service',
  },

  // ── Staff ─────────────────────────────────────────────────────────────────
  staff: {
    title:            'Staff',
    activeSub:        '{{active}} active · {{total}} total',
    addMember:        'Add staff member',
    noStaff:          'No staff members yet',
    noStaffSub:       'Add your first team member to get started.',
    inactive:         'Inactive',
    noServices:       'No services assigned',
    edit:             'Edit',
    remove:           'Remove',
    setInactive:      'Set inactive',
    setActive:        'Set active',
    removeConfirm:    'Remove this staff member?',
    // modal
    editTitle:        'Edit staff member',
    newTitle:         'New staff member',
    avatarColour:     'Avatar colour',
    fullName:         'Full name',
    namePlaceholder:  'e.g. Laura Bērziņa',
    roleLabel:        'Role / title',
    rolePlaceholder:  'e.g. Senior Therapist',
    bioLabel:         'Bio',
    bioOptional:      '(optional)',
    bioPlaceholder:   'Short description shown to customers',
    skillsLabel:      'Skills',
    skillsSub:        '(services from your catalogue)',
    skillsSearch:     'Search services...',
    allAssigned:      'All services assigned',
    skillsHint:       'Services are pulled from your Services page — add new ones there first.',
    workingDays:      'Working days',
    startTime:        'Start time',
    endTime:          'End time',
    save:             'Save',
    cancel:           'Cancel',
    selected:         '{{count}} selected',
    // toasts
    toastAdded:       'Staff member added',
    toastUpdated:     'Staff member updated',
    toastRemoved:     'Staff member removed',
    toastActivated:   '{{name}} set to active',
    toastDeactivated: '{{name}} set to inactive',
    toastSaveFail:    'Failed to save staff member',
    toastRemoveFail:  'Failed to remove staff member',
    toastToggleFail:  'Failed to update staff member',
  },

  // ── Settings ──────────────────────────────────────────────────────────────
  settings: {
    title:    'Settings',
    save:     'Save changes',
    saving:   'Saving…',
    saved:    'Changes saved',
    saveFail: 'Failed to save settings',
  },

  // ── Common ────────────────────────────────────────────────────────────────
  common: {
    cancel:   'Cancel',
    save:     'Save',
    loading:  'Loading…',
    error:    'Something went wrong. Please try again.',
  },
} as const

export type AdminDict = typeof adminEn
export default adminEn
