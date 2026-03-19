/**
 * Industry service templates.
 * Used during signup to pre-seed a new business's services,
 * and in the admin empty-state banner as a fallback.
 *
 * No DB table — pure static data.
 * Both English and Latvian labels/names are included.
 * Russian is not supported for templates.
 */

export type ServiceTemplate = {
  name: string
  nameLv: string
  description: string
  descriptionLv: string
  duration: number   // minutes
  price: number      // EUR
}

export type BusinessCategory = {
  id: string
  label: string
  labelLv: string
  icon: string
  services: ServiceTemplate[]
}

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    id: 'nail_salon',
    label: 'Nail Salon',
    labelLv: 'Nagu salons',
    icon: '💅',
    services: [
      { name: 'Gel Manicure',        nameLv: 'Gela manikīrs',          description: 'Full gel manicure with colour of your choice.',          descriptionLv: 'Pilns gela manikīrs ar tavu izvēlēto krāsu.',            duration: 60,  price: 35 },
      { name: 'Acrylic Set (Full)',   nameLv: 'Akrila nagi (pilns set)', description: 'Full set of acrylic nails, shaped and finished.',        descriptionLv: 'Pilns akrila nagu komplekts, formēts un nobeigts.',       duration: 90,  price: 55 },
      { name: 'Nail Removal',        nameLv: 'Nagu noņemšana',         description: 'Safe removal of gel or acrylic nails.',                  descriptionLv: 'Droša gela vai akrila nagu noņemšana.',                   duration: 30,  price: 20 },
      { name: 'Classic Manicure',    nameLv: 'Klasiskais manikīrs',    description: 'Traditional manicure with nail shaping and polish.',     descriptionLv: 'Tradicionāls manikīrs ar nagu formēšanu un lakas klāšanu.', duration: 45, price: 25 },
      { name: 'Pedicure',            nameLv: 'Pedikīrs',               description: 'Full pedicure with soak, scrub and polish.',             descriptionLv: 'Pilns pedikīrs ar vanniņu, skrubi un laku.',             duration: 75,  price: 40 },
      { name: 'Nail Art (per nail)', nameLv: 'Nagu māksla (par nagu)', description: 'Custom nail art designs, per nail.',                     descriptionLv: 'Individuāli nagu dizaini, cena par vienu nagu.',          duration: 15,  price: 5  },
    ],
  },
  {
    id: 'hair_salon',
    label: 'Hair Salon',
    labelLv: 'Frizētava',
    icon: '✂️',
    services: [
      { name: 'Haircut & Blowdry',   nameLv: 'Matu griezums un fēns',      description: 'Cut and professional blowdry finish.',                      descriptionLv: 'Griezums un profesionāls fēna nobeigums.',                    duration: 60,  price: 45 },
      { name: 'Colour & Highlights', nameLv: 'Krāsošana un spleķi',        description: 'Full colour or highlights with toner.',                     descriptionLv: 'Pilna krāsošana vai spleķi ar toneri.',                       duration: 120, price: 90 },
      { name: 'Balayage',            nameLv: 'Balajāža',                   description: 'Hand-painted balayage for a natural sun-kissed look.',       descriptionLv: 'Ar roku krāsota balajāža dabiskai saulainas ādas izskatam.',  duration: 150, price: 120 },
      { name: 'Keratin Treatment',   nameLv: 'Keratīna procedūra',         description: 'Smoothing keratin treatment for frizz-free hair.',           descriptionLv: 'Keratīna procedūra gludi, cirtaini brīvi mati.',              duration: 180, price: 150 },
      { name: 'Trim (No Blowdry)',   nameLv: 'Galiņu apgriešana',          description: 'Quick trim and tidy-up, no blowdry.',                       descriptionLv: 'Ātra galiņu apgriešana, bez fēna.',                           duration: 30,  price: 25 },
      { name: 'Bridal Hair',         nameLv: 'Līgavas frizūra',            description: 'Full bridal updo or styling for your special day.',          descriptionLv: 'Pilna līgavas frizūra tavai īpašajai dienai.',                duration: 120, price: 100 },
      { name: 'Kids Haircut',        nameLv: 'Bērnu matu griezums',        description: 'Haircut for children up to age 12.',                         descriptionLv: 'Matu griezums bērniem līdz 12 gadu vecumam.',                 duration: 30,  price: 20 },
    ],
  },
  {
    id: 'beauty',
    label: 'Beauty & Aesthetics',
    labelLv: 'Skaistumkopšana',
    icon: '✨',
    services: [
      { name: 'Classic Facial',             nameLv: 'Klasiskā sejas procedūra',    description: 'Deep cleanse, exfoliate and moisturise facial.',            descriptionLv: 'Dziļa tīrīšana, lobīšana un sejas mitrināšana.',              duration: 60,  price: 50 },
      { name: 'Eyebrow Shaping & Tint',    nameLv: 'Uzacu formēšana un krāsošana',description: 'Shape and tint brows for a defined look.',                 descriptionLv: 'Uzacu formēšana un krāsošana izteiktam skatienam.',           duration: 30,  price: 25 },
      { name: 'Lash Lift & Tint',          nameLv: 'Skropstu lifting un krāsošana',description: 'Lift and tint your natural lashes.',                        descriptionLv: 'Dabisko skropstu lifting un krāsošana.',                      duration: 60,  price: 45 },
      { name: 'Classic Lash Extensions',   nameLv: 'Klasiskās skropstu pieaudzēšanas',description: 'Full set of classic individual lash extensions.',           descriptionLv: 'Pilns klasisko individuālo skropstu pieaudzēšanu komplekts.', duration: 90,  price: 70 },
      { name: 'Lash Infill',               nameLv: 'Skropstu korektura',          description: 'Infill for existing lash extensions (every 2–3 weeks).',   descriptionLv: 'Skropstu pieaudzēšanu korektura (ik 2–3 nedēļas).',          duration: 60,  price: 40 },
      { name: 'Full Body Wax',             nameLv: 'Pilna ķermeņa vaksācija',     description: 'Full body waxing treatment.',                               descriptionLv: 'Pilna ķermeņa vaksācijas procedūra.',                         duration: 90,  price: 65 },
      { name: 'Leg Wax',                   nameLv: 'Kāju vaksācija',              description: 'Waxing for full legs.',                                     descriptionLv: 'Pilnu kāju vaksācija.',                                       duration: 45,  price: 35 },
      { name: 'Microblading Consultation', nameLv: 'Mikroblejdinga konsultācija',  description: 'Initial consultation for microblading eyebrows.',            descriptionLv: 'Sākotnējā konsultācija uzacu mikroblejdingam.',               duration: 30,  price: 0  },
    ],
  },
  {
    id: 'personal_trainer',
    label: 'Personal Trainer',
    labelLv: 'Personālais treneris',
    icon: '🏋️',
    services: [
      { name: '1-on-1 Training Session', nameLv: 'Individuālā treniņš',       description: 'Personal one-to-one training session.',                    descriptionLv: 'Personīgā individuālā treniņu sesija.',                    duration: 60,  price: 50 },
      { name: 'Fitness Assessment',      nameLv: 'Fitnesa izvērtēšana',       description: 'Initial fitness assessment and programme planning.',        descriptionLv: 'Sākotnējā fiziskā stāvokļa novērtēšana un programmas plānošana.', duration: 90, price: 60 },
      { name: 'Group Class (up to 6)',   nameLv: 'Grupu nodarbība (līdz 6)', description: 'Small group training class, max 6 people.',               descriptionLv: 'Mazas grupas treniņu nodarbība, maks. 6 cilvēki.',         duration: 45,  price: 20 },
      { name: 'Online Coaching Session', nameLv: 'Tiešsaistes koučings',      description: 'Remote coaching session via video call.',                  descriptionLv: 'Attālā koučinga sesija video zvana formātā.',              duration: 60,  price: 40 },
      { name: '10-Session Pack',         nameLv: '10 treniņu pakete',         description: 'Bundle of 10 personal training sessions.',                 descriptionLv: '10 personīgo treniņu sesiju pakete.',                     duration: 60,  price: 450 },
    ],
  },
  {
    id: 'barbershop',
    label: 'Barbershop',
    labelLv: 'Barbershops',
    icon: '🪒',
    services: [
      { name: 'Haircut',              nameLv: 'Matu griezums',            description: 'Classic barbershop haircut.',                              descriptionLv: 'Klasiskais barbershop matu griezums.',                     duration: 30,  price: 20 },
      { name: 'Haircut & Beard Trim', nameLv: 'Griezums un bārdas kopts', description: 'Haircut with beard shaping and line-up.',                  descriptionLv: 'Matu griezums ar bārdas formēšanu un kontūrēšanu.',       duration: 45,  price: 28 },
      { name: 'Beard Trim & Shape',   nameLv: 'Bārdas kopšana',           description: 'Beard shaping, trimming and line-up only.',                descriptionLv: 'Tikai bārdas formēšana, apgriešana un kontūrēšana.',     duration: 20,  price: 15 },
      { name: 'Hot Towel Shave',      nameLv: 'Skūšanās ar karstu dvieli',description: 'Traditional hot towel straight-razor shave.',              descriptionLv: 'Tradicionāla skūšanās ar taisno skuvekli un karstu dvieli.',duration: 40, price: 30 },
      { name: 'Kids Haircut',         nameLv: 'Bērnu matu griezums',      description: 'Haircut for children up to age 12.',                        descriptionLv: 'Matu griezums bērniem līdz 12 gadu vecumam.',             duration: 25,  price: 15 },
      { name: 'Hair & Beard Colour',  nameLv: 'Matu un bārdas krāsošana', description: 'Colour treatment for hair and/or beard.',                   descriptionLv: 'Krāsošanas procedūra matiem un/vai bārdai.',              duration: 60,  price: 40 },
    ],
  },
  {
    id: 'massage_spa',
    label: 'Massage & Spa',
    labelLv: 'Masāža un SPA',
    icon: '💆',
    services: [
      { name: 'Swedish Massage (60 min)', nameLv: 'Zviedru masāža (60 min)',    description: 'Relaxing full-body Swedish massage.',                  descriptionLv: 'Relaksējoša pilna ķermeņa zviedru masāža.',             duration: 60,  price: 55 },
      { name: 'Swedish Massage (90 min)', nameLv: 'Zviedru masāža (90 min)',    description: 'Extended relaxing full-body Swedish massage.',         descriptionLv: 'Pagarināta relaksējoša pilna ķermeņa zviedru masāža.',  duration: 90,  price: 75 },
      { name: 'Deep Tissue Massage',      nameLv: 'Dziļo audu masāža',          description: 'Firm pressure deep tissue massage for tension relief.',descriptionLv: 'Dziļo audu masāža ar spēcīgu spiedienu spriedzes mazināšanai.', duration: 60, price: 65 },
      { name: 'Hot Stone Massage',        nameLv: 'Karstie akmeņi masāža',      description: 'Heated stone massage for deep relaxation.',            descriptionLv: 'Karstos akmeņu masāža dziļai relaksācijai.',            duration: 75,  price: 80 },
      { name: 'Back, Neck & Shoulder',    nameLv: 'Mugura, kakls un pleci',     description: 'Targeted massage for upper body tension.',             descriptionLv: 'Mērķtiecīga masāža augšķermeņa spriedzes mazināšanai.', duration: 30,  price: 35 },
      { name: 'Couples Massage',          nameLv: 'Pāru masāža',                description: 'Simultaneous massage for two people.',                 descriptionLv: 'Vienlaicīga masāža diviem cilvēkiem.',                  duration: 60,  price: 100 },
    ],
  },
  {
    id: 'restaurant',
    label: 'Restaurant / Café',
    labelLv: 'Restorāns / Kafejnīca',
    icon: '🍽️',
    services: [
      { name: 'Table for 2',          nameLv: 'Galds 2 personām',        description: 'Reservation for 2 guests.',                               descriptionLv: 'Rezervācija 2 viesiem.',                                  duration: 90,  price: 0  },
      { name: 'Table for 4',          nameLv: 'Galds 4 personām',        description: 'Reservation for up to 4 guests.',                         descriptionLv: 'Rezervācija līdz 4 viesiem.',                             duration: 90,  price: 0  },
      { name: 'Table for 6+',         nameLv: 'Galds 6+ personām',       description: 'Group reservation for 6 or more guests.',                 descriptionLv: 'Grupu rezervācija 6 vai vairāk viesiem.',                 duration: 120, price: 0  },
      { name: 'Private Dining Room',  nameLv: 'Privātā ēdamistaba',      description: 'Exclusive use of private dining room.',                   descriptionLv: 'Ekskluzīva privātās ēdamistabas izmantošana.',            duration: 180, price: 50 },
      { name: 'Tasting Menu (2 pax)', nameLv: 'Degustācijas ēdienkarte (2)',description: "Chef's tasting menu experience for 2.",                  descriptionLv: 'Šefpavāra degustācijas ēdienkartes pieredze diviem.',    duration: 150, price: 120 },
    ],
  },
]

/** Convenience: look up a category by id */
export function getCategoryById(id: string): BusinessCategory | undefined {
  return BUSINESS_CATEGORIES.find(c => c.id === id)
}

/** Get localised label for a category */
export function getCategoryLabel(cat: BusinessCategory, locale: string): string {
  return locale === 'lv' ? cat.labelLv : cat.label
}

/** Get localised service name/description */
export function getServiceName(svc: ServiceTemplate, locale: string): string {
  return locale === 'lv' ? svc.nameLv : svc.name
}
export function getServiceDescription(svc: ServiceTemplate, locale: string): string {
  return locale === 'lv' ? svc.descriptionLv : svc.description
}
