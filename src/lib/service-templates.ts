/**
 * Industry service templates.
 * Used during signup to pre-seed a new business's services,
 * and in the admin empty-state banner as a fallback.
 *
 * No DB table — pure static data.
 */

export type ServiceTemplate = {
  name: string
  description: string
  duration: number   // minutes
  price: number      // EUR
}

export type BusinessCategory = {
  id: string
  label: string
  icon: string
  services: ServiceTemplate[]
}

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    id: 'nail_salon',
    label: 'Nail Salon',
    icon: '💅',
    services: [
      { name: 'Gel Manicure',        description: 'Full gel manicure with colour of your choice.',          duration: 60,  price: 35 },
      { name: 'Acrylic Set (Full)',   description: 'Full set of acrylic nails, shaped and finished.',        duration: 90,  price: 55 },
      { name: 'Nail Removal',        description: 'Safe removal of gel or acrylic nails.',                  duration: 30,  price: 20 },
      { name: 'Classic Manicure',    description: 'Traditional manicure with nail shaping and polish.',     duration: 45,  price: 25 },
      { name: 'Pedicure',            description: 'Full pedicure with soak, scrub and polish.',             duration: 75,  price: 40 },
      { name: 'Nail Art (per nail)', description: 'Custom nail art designs, per nail.',                     duration: 15,  price: 5  },
    ],
  },
  {
    id: 'hair_salon',
    label: 'Hair Salon',
    icon: '✂️',
    services: [
      { name: 'Haircut & Blowdry',       description: 'Cut and professional blowdry finish.',                      duration: 60,  price: 45 },
      { name: 'Colour & Highlights',     description: 'Full colour or highlights with toner.',                     duration: 120, price: 90 },
      { name: 'Balayage',               description: 'Hand-painted balayage for a natural sun-kissed look.',       duration: 150, price: 120 },
      { name: 'Keratin Treatment',       description: 'Smoothing keratin treatment for frizz-free hair.',           duration: 180, price: 150 },
      { name: 'Trim (No Blowdry)',       description: 'Quick trim and tidy-up, no blowdry.',                       duration: 30,  price: 25 },
      { name: 'Bridal Hair',            description: 'Full bridal updo or styling for your special day.',          duration: 120, price: 100 },
      { name: 'Kids Haircut',           description: 'Haircut for children up to age 12.',                         duration: 30,  price: 20 },
    ],
  },
  {
    id: 'beauty',
    label: 'Beauty & Aesthetics',
    icon: '✨',
    services: [
      { name: 'Classic Facial',           description: 'Deep cleanse, exfoliate and moisturise facial.',            duration: 60,  price: 50 },
      { name: 'Eyebrow Shaping & Tint',  description: 'Shape and tint brows for a defined look.',                 duration: 30,  price: 25 },
      { name: 'Lash Lift & Tint',        description: 'Lift and tint your natural lashes.',                        duration: 60,  price: 45 },
      { name: 'Classic Lash Extensions', description: 'Full set of classic individual lash extensions.',           duration: 90,  price: 70 },
      { name: 'Lash Infill',             description: 'Infill for existing lash extensions (every 2–3 weeks).',   duration: 60,  price: 40 },
      { name: 'Full Body Wax',           description: 'Full body waxing treatment.',                               duration: 90,  price: 65 },
      { name: 'Leg Wax',                 description: 'Waxing for full legs.',                                     duration: 45,  price: 35 },
      { name: 'Microblading Consultation',description: 'Initial consultation for microblading eyebrows.',         duration: 30,  price: 0  },
    ],
  },
  {
    id: 'personal_trainer',
    label: 'Personal Trainer',
    icon: '🏋️',
    services: [
      { name: '1-on-1 Training Session', description: 'Personal one-to-one training session.',                    duration: 60,  price: 50 },
      { name: 'Fitness Assessment',      description: 'Initial fitness assessment and programme planning.',        duration: 90,  price: 60 },
      { name: 'Group Class (up to 6)',   description: 'Small group training class, max 6 people.',               duration: 45,  price: 20 },
      { name: 'Online Coaching Session', description: 'Remote coaching session via video call.',                  duration: 60,  price: 40 },
      { name: '10-Session Pack',         description: 'Bundle of 10 personal training sessions.',                 duration: 60,  price: 450 },
    ],
  },
  {
    id: 'barbershop',
    label: 'Barbershop',
    icon: '🪒',
    services: [
      { name: 'Haircut',                description: 'Classic barbershop haircut.',                              duration: 30,  price: 20 },
      { name: 'Haircut & Beard Trim',   description: 'Haircut with beard shaping and line-up.',                  duration: 45,  price: 28 },
      { name: 'Beard Trim & Shape',     description: 'Beard shaping, trimming and line-up only.',                duration: 20,  price: 15 },
      { name: 'Hot Towel Shave',        description: 'Traditional hot towel straight-razor shave.',              duration: 40,  price: 30 },
      { name: 'Kids Haircut',           description: 'Haircut for children up to age 12.',                        duration: 25,  price: 15 },
      { name: 'Hair & Beard Colour',    description: 'Colour treatment for hair and/or beard.',                   duration: 60,  price: 40 },
    ],
  },
  {
    id: 'massage_spa',
    label: 'Massage & Spa',
    icon: '💆',
    services: [
      { name: 'Swedish Massage (60 min)',    description: 'Relaxing full-body Swedish massage.',                  duration: 60,  price: 55 },
      { name: 'Swedish Massage (90 min)',    description: 'Extended relaxing full-body Swedish massage.',         duration: 90,  price: 75 },
      { name: 'Deep Tissue Massage',         description: 'Firm pressure deep tissue massage for tension relief.',duration: 60,  price: 65 },
      { name: 'Hot Stone Massage',           description: 'Heated stone massage for deep relaxation.',            duration: 75,  price: 80 },
      { name: 'Back, Neck & Shoulder',       description: 'Targeted massage for upper body tension.',             duration: 30,  price: 35 },
      { name: 'Couples Massage',             description: 'Simultaneous massage for two people.',                 duration: 60,  price: 100 },
    ],
  },
  {
    id: 'restaurant',
    label: 'Restaurant / Café',
    icon: '🍽️',
    services: [
      { name: 'Table for 2',           description: 'Reservation for 2 guests.',                               duration: 90,  price: 0  },
      { name: 'Table for 4',           description: 'Reservation for up to 4 guests.',                         duration: 90,  price: 0  },
      { name: 'Table for 6+',          description: 'Group reservation for 6 or more guests.',                 duration: 120, price: 0  },
      { name: 'Private Dining Room',   description: 'Exclusive use of private dining room.',                   duration: 180, price: 50 },
      { name: 'Tasting Menu (2 pax)',  description: 'Chef\'s tasting menu experience for 2.',                  duration: 150, price: 120 },
    ],
  },
]

/** Convenience: look up a category by id */
export function getCategoryById(id: string): BusinessCategory | undefined {
  return BUSINESS_CATEGORIES.find(c => c.id === id)
}
