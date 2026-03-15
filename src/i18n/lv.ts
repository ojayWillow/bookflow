/**
 * Latvian translations — public-facing pages
 *
 * Register: informal "tu" — modern SaaS products in Latvia
 * use informal address. Noun cases applied where grammar requires.
 */
import type { PublicDict } from './en'

const lv: PublicDict = {
  nav: {
    features:  'Iespējas',
    pricing:   'Cenas',
    signIn:    'Ieiet',
    tryFree:   'Izmēģini bez maksas',
  },

  hero: {
    headline1:        'Online rezervācijas,',
    headline2:        'kas vienkārši strādā',
    subheadline:      'Izveido profesionālu rezervāciju lapu savā biznesā dažu minūšu laikā. Klienti rezervē, tu saņem paziņojumu — viss ir skaidrs.',
    emailPlaceholder: 'Tavs e-pasts',
    cta:              'Sākt',
    trialNote:        '7 dienu bezmaksas izmēģinājums · Karte nav nepieciešama',
  },

  overview: {
    statsToday:      'Šodienas rezervācijas',
    statusConfirmed: 'apstiprināts',
    statusPending:   'gaida',
  },

  features: {
    sectionTitle: 'Viss, kas nepieciešams rezervāciju sistēmai',
    sectionSub:   'Vienkārši iestatāms. Piemērots jebkuram biznesam.',
    items: [
      { title: 'Viedā plānošana',         desc: 'Norādi darba dienas, laikus un intervālus — sistēma pārējo veic pati.' },
      { title: 'Pielāgojams ilgums',      desc: 'Katram pakalpojumam savs ilgums. Dubultas rezervācijas nav iespējamas.' },
      { title: 'Pilnīgi pielāgojams',     desc: 'Pakalpojumu nosaukumi, cenas, apraksti — maini sekunžu laikā.' },
      { title: 'Tūlītējs apstiprinājums', desc: 'Katrai rezervācijai automātiski tiek nosūtīts apstiprinājums uz e-pastu.' },
      { title: 'Jebkuram nozares veidam', desc: 'Skaistumkopšana, medicīna, auto, fitnesa, konsultācijas — viens risinājums visiem.' },
      { title: 'Gatavs dažās minūtēs',   desc: 'Nekādas tehniskas iestatīšanas. Pievieno pakalpojumus, norādi laikus, dalies ar saiti.' },
    ],
  },

  pricing: {
    sectionTitle: 'Skaidras cenas',
    sectionSub:   'Izmēģini jebkuru plānu 7 dienas bez maksas. Karte nav vajadzīga.',
    mostPopular:  'Populārākais',
    perMonth:     '/mēn.',
    afterTrial:   'pēc 7 dienu izmēģinājuma',
    cancelNote:   'Atcelt var jebkurā laikā. Bez saistībām.',
    cta:          'Sākt bezmaksas izmēģinājumu',
    plans: [
      {
        name: 'Sācējs',
        features: ['1 atrašanās vieta', 'Līdz 5 pakalpojumiem', 'E-pasta apstiprinājumi', 'Pamata dizains'],
      },
      {
        name: 'Pro',
        features: ['Neierobežoti pakalpojumi', 'Savs domēns', 'SMS atgādinājumi', 'Statistikas panelis', 'Prioritārs atbalsts'],
      },
      {
        name: 'Aģentūra',
        features: ['Vairākas atrašanās vietas', 'White-label tālākpārdošana', 'API piekļuve', 'Personīgais atbalsts', 'Pielāgota integrācija'],
      },
    ],
  },

  testimonials: {
    sectionTitle: 'Uzņēmumi ir apmierināti',
    items: [
      { name: 'Marina K.',    business: 'Marina BeautyRoom', text: 'Klienti tagad rezervē paši, nevis raksta man pusnaktī. Tas mainīja visu.' },
      { name: 'Andris P.',    business: 'AutoPro Rīga',      text: 'Vienā pēcpusdienā pārgājām no papīra dienasgrāmatas uz pilnīgi digitālu sistēmu.' },
      { name: 'Jekaterina S.', business: 'Old Riga SPA',     text: 'Apstiprinājuma e-pasti vien ietaupa man 20 ziņas dienā. Klienti vienmēr zina savas detaļas.' },
    ],
  },

  cta: {
    headline: 'Gatavs pieņemt rezervācijas tiešsaistē?',
    sub:      'Izmēģini BookFlow 7 dienas bez maksas. Bez kartes, bez saistībām.',
    button:   'Sākt bezmaksas izmēģinājumu →',
  },

  footer: {
    tagline:    '© 2026 BookFlow. Izveidots uzņēmumiem, kas pieņem apmeklējumus.',
    signIn:     'Ieiet',
    getStarted: 'Sākt',
    privacy:    'Privātums',
    terms:      'Noteikumi',
  },

  booking: {
    locale:              'lv',
    stepService:         'Pakalpojums',
    stepStaff:           'Speciālists',
    stepDateTime:        'Datums un laiks',
    stepDetails:         'Dati',
    stepConfirm:         'Apstiprināt',
    back:                'Atpakaļ',
    stepServiceTitle:    'Izvēlies pakalpojumu',
    stepServiceSub:      'Izvēlies pakalpojumu, kuru vēlies rezervēt.',
    stepStaffTitle:      'Izvēlies speciālistu',
    stepDateTimeTitle:   'Izvēlies datumu un laiku',
    stepDetailsTitle:    'Tavi dati',
    stepDetailsSub:      'Nepieciešama informācija rezervācijas apstiprināšanai.',
    stepConfirmTitle:    'Pārbaudi rezervāciju',
    stepConfirmSub:      'Lūdzu pārbaudi visu pirms apstiprināšanas.',
    anyoneAvailable:     'Jebkurš speciālists',
    anyoneAvailableSub:  'Piešķirsim pirmo brīvo speciālistu.',
    noStaff:             'Nav pieejamu speciālistu šim pakalpojumam.',
    selectDate:          'Izvēlies datumu',
    selectTime:          'Izvēlies laiku',
    noAvailableDatesTitle: 'Nav pieejamu datumu',
    noAvailableDatesSub:   'Uzņēmums, iespējams, vēl nav iestatījis grafiku.',
    noSlots:             'Šajā dienā brīvu laiku nav.',
    labelName:           'Vārds, uzvārds',
    labelEmail:          'E-pasts',
    labelPhone:          'Tālrunis',
    labelNotes:          'Piezīmes',
    optional:            'pēc izvēles',
    placeholderName:     'Anna Bērziņa',
    placeholderNotes:    'Kaut kas, kas mums jāzina?',
    looksGood:           'Izskatās labi',
    reviewBooking:       'Pārskatīt rezervāciju',
    bookingSummary:      'Rezervācijas kopsavilkums',
    rowService:          'Pakalpojums',
    rowDuration:         'Ilgums',
    rowPrice:            'Cena',
    rowStaff:            'Speciālists',
    rowDate:             'Datums',
    rowTime:             'Laiks',
    rowName:             'Vārds',
    rowEmail:            'E-pasts',
    rowPhone:            'Tālrunis',
    rowNotes:            'Piezīmes',
    cancellationPolicy:  'Atcelšanas nosacījumi',
    confirmBooking:      'Apstiprināt rezervāciju',
    confirming:          'Apstiprina…',
    successTitle:        'Rezervācija apstiprināta!',
    successEmailSent:    'Apstiprinājums nosūtīts uz {{email}}',
    successSaveRef:      'Saglabā rezervācijas numuru — tas var noderēt.',
    bookingRef:          'Rezervācijas numurs',
    at:                  'plkst.',
    followUs:            'Seko mums',
    min:                 'min',
    errorGeneric:        'Kaut kas nogāja greizi. Lūdzu mēģini vēlreiz.',
    errorNameParts:      'Lūdzu ievadi vārdu un uzvārdu',
    errorNameShort:      'Katram vārdam jābūt vismaz 2 rakstzīmēm',
    errorEmailRequired:  'E-pasts ir obligāts',
    errorEmailInvalid:   'Lūdzu ievadi derīgu e-pasta adresi',
    errorPhoneRequired:  'Tālruņa numurs ir obligāts',
    errorPhoneShort:     'Lūdzu ievadi derīgu tālruņa numuru (min. 7 cipari)',
    errorPhoneInvalid:   'Atļauti tikai cipari, atstarpes, +, - un ()',
    anyoneAvailableStaffName: 'Jebkurš speciālists',
  },

  signup: {
    heading:                 'Izveido savu BookFlow kontu',
    subheading:              'Sāc 7 dienu bezmaksas izmēģinājumu. Karte nav nepieciešama.',
    labelFirstName:          'Vārds',
    labelLastName:           'Uzvārds',
    labelBusinessName:       'Uzņēmuma nosaukums',
    labelUrl:                'Tava rezervāciju saite',
    labelEmail:              'E-pasts',
    labelPassword:           'Parole',
    labelConfirmPassword:    'Parole atkārtoti',
    placeholderFirstName:    'Anna',
    placeholderLastName:     'Bērziņa',
    placeholderBusinessName: 'Glow Beauty Studio',
    placeholderEmail:        'anna@example.com',
    placeholderPassword:     '········',
    placeholderConfirmPassword: '········',
    slugWarning:             'Izvēlies uzmanīgi — rezervāciju saiti nevarēs mainīt pēc reģistrācijas.',
    submit:                  'Izveidot kontu',
    submitting:              'Izveido…',
    noCreditCard:            'Karte nav nepieciešama · Atcelt var jebkurā laikā',
    alreadyHaveAccount:      'Jau ir konts?',
    signIn:                  'Ieiet',
    errorPasswordMismatch:   'Paroles nesakrīt',
    errorPasswordShort:      'Parolei jābūt vismaz 8 rakstzīmēm',
    errorGeneric:            'Kaut kas nogāja greizi. Lūdzu mēģini vēlreiz.',
  },
}

export default lv
