/**
 * English translations — admin panel
 * Assembled from per-section files in ./sections/
 */
import nav      from './sections/nav/en'
import overview from './sections/overview/en'
import bookings from './sections/bookings/en'
import services from './sections/services/en'
import staff    from './sections/staff/en'
import schedule from './sections/schedule/en'
import branding from './sections/branding/en'
import share    from './sections/share/en'
import settings from './sections/settings/en'
import common   from './sections/common/en'

const adminEn = { nav, overview, bookings, services, staff, schedule, branding, share, settings, common }

export type AdminDict = typeof adminEn
export default adminEn
