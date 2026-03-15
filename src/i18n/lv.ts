/**
 * Latvian translations — public-facing pages
 *
 * Register: informal "tu" — modern SaaS products in Latvia
 * use informal address. Noun cases applied where grammar requires.
 * Avoid word-for-word calques from English.
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
    headline1:   'Online rezervācijas,',
    headline2:   'kas vienkārši strādā',
    subheadline: 'Izveido profesionālu rezervāciju lapu savā biznesā dažu minūšu laikā. Klienti rezervē, tu saņem paziņojumu — viss ir skaidrs.',
    emailPlaceholder: 'Tavs e-pasts',
    cta:         'Sākt',
    trialNote:   '7 dienu bezmaksas izmēģinājums · Karte nav nepieciešama',
  },

  features: {
    sectionTitle: 'Viss, kas nepieciešams rezervāciju sistēmai',
    sectionSub:   'Vienkārši iestatāms. Piemērots jebkuram biznesam.',
    items: [
      { title: 'Viedā plānošana',       desc: 'Norādi darba dienas, laikus un intervālus — sistēma pārējo veic pati.' },
      { title: 'Pielāgojams ilgums',    desc: 'Katram pakalpojumam savs ilgums. Dubultas rezervācijas nav iespējamas.' },
      { title: 'Pilnīgi pielāgojams',   desc: 'Pakalpojumu nosaukumi, cenas, apraksti — maini sekunžu laikā.' },
      { title: 'Tūlītējs apstiprinājums', desc: 'Katrai rezervācijai automātiski tiek nosūtīts apstiprinājums uz e-pastu.' },
      { title: 'Jebkuram nozares veidam', desc: 'Skaistumkopšana, medicīna, auto, fitnesa, konsultācijas — viens risinājums visiem.' },
      { title: 'Gatavs dažās minūtēs', desc: 'Nekādas tehniskas iestatīšanas. Pievieno pakalpojumus, norādi laikus, dalies ar saiti.' },
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
      {
        name: 'Marina K.',
        business: 'Marina BeautyRoom',
        text: 'Klienti tagad rezervē paši, nevis raksta man pusnaktī. Tas mainīja visu.',
      },
      {
        name: 'Andris P.',
        business: 'AutoPro Rīga',
        text: 'Vienā pēcpusdienā pārgājām no papīra dienasgrāmatas uz pilnīgi digitālu sistēmu.',
      },
      {
        name: 'Jekaterina S.',
        business: 'Old Riga SPA',
        text: 'Apstiprinājuma e-pasti vien ietaupa man 20 ziņas dienā. Klienti vienmēr zina savas detaļas.',
      },
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
    stepService:  'Izvēlies pakalpojumu',
    stepStaff:    'Izvēlies speciālistu',
    stepDatetime: 'Izvēlies laiku',
    stepDetails:  'Tavi dati',
    stepConfirm:  'Apstiprini',
    next:         'Tālāk',
    back:         'Atpakaļ',
    confirm:      'Apstiprināt rezervāciju',
    bookAgain:    'Rezervēt vēlreiz',
    namePlaceholder:  'Vārds, uzvārds',
    emailPlaceholder: 'E-pasta adrese',
    phonePlaceholder: 'Tālruņa numurs',
    notesPlaceholder: 'Piezīmes (pēc izvēles)',
    duration:     'min',
    successTitle: 'Rezervācija apstiprināta!',
    successSub:   'Apstiprinājums nosūtīts uz tavu e-pastu.',
    ref:          'Rezervācijas numurs',
    noStaffPref:  'Jebkurš speciālists',
    selectDate:   'Izvēlies datumu',
    selectTime:   'Izvēlies laiku',
    noSlots:      'Šajā dienā brīvu laiku nav.',
    cancelLink:   'Nepieciešams atcelt?',
  },

  signup: {
    title:          'Izveido kontu',
    sub:            'Sāc 7 dienu bezmaksas izmēģinājumu. Karte nav nepieciešama.',
    emailLabel:     'E-pasts',
    passwordLabel:  'Parole',
    businessLabel:  'Uzņēmuma nosaukums',
    submit:         'Izveidot kontu',
    alreadyAccount: 'Jau ir konts?',
    signInLink:     'Ieiet',
    passwordHint:   'Vismaz 8 rakstzīmes',
  },
}

export default lv
