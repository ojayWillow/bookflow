/**
 * Latvian translations — admin panel
 * Assembled from per-section files in ./sections/
 */
import type { AdminDict } from './en'
import nav      from './sections/nav/lv'
import overview from './sections/overview/lv'
import bookings from './sections/bookings/lv'
import services from './sections/services/lv'
import staff    from './sections/staff/lv'
import schedule from './sections/schedule/lv'
import branding from './sections/branding/lv'
import share    from './sections/share/lv'
import settings from './sections/settings/lv'
import common   from './sections/common/lv'

const adminLv: AdminDict = { nav, overview, bookings, services, staff, schedule, branding, share, settings, common }
export default adminLv
