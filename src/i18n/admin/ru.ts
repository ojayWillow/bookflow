/**
 * Russian translations — admin panel
 * Assembled from per-section files in ./sections/
 */
import type { AdminDict } from './en'
import nav      from './sections/nav/ru'
import overview from './sections/overview/ru'
import bookings from './sections/bookings/ru'
import services from './sections/services/ru'
import staff    from './sections/staff/ru'
import schedule from './sections/schedule/ru'
import branding from './sections/branding/ru'
import share    from './sections/share/ru'
import settings from './sections/settings/ru'
import common   from './sections/common/ru'

const adminRu: AdminDict = { nav, overview, bookings, services, staff, schedule, branding, share, settings, common }
export default adminRu
