/**
 * Russian translations — public-facing pages
 *
 * Register: formal "вы" for customer-facing pages — standard
 * for SaaS products in Russian-speaking markets.
 * Avoid calques from English or Latvian. Natural business Russian.
 */
import type { PublicDict } from './en'

const ru: PublicDict = {
  nav: {
    features:  'Возможности',
    pricing:   'Цены',
    signIn:    'Войти',
    tryFree:   'Попробовать бесплатно',
  },

  hero: {
    headline1:   'Онлайн-запись,',
    headline2:   'которая просто работает',
    subheadline: 'Создайте профессиональную страницу записи за несколько минут. Клиенты записываются сами, вы получаете уведомление — всё под контролем.',
    emailPlaceholder: 'Ваш e-mail',
    cta:         'Начать',
    trialNote:   '7 дней бесплатно · Карта не нужна',
  },

  features: {
    sectionTitle: 'Всё необходимое для онлайн-записи',
    sectionSub:   'Быстро настраивается. Подходит для любого бизнеса.',
    items: [
      { title: 'Умное расписание',      desc: 'Укажите рабочие дни, часы и интервалы — система справится сама.' },
      { title: 'Гибкая длительность',   desc: 'У каждой услуги своя продолжительность. Двойные записи исключены.' },
      { title: 'Полная настройка',      desc: 'Названия услуг, цены, описания — всё меняется в несколько кликов.' },
      { title: 'Мгновенное подтверждение', desc: 'После каждой записи клиент получает письмо с полными деталями.' },
      { title: 'Для любой сферы',       desc: 'Красота, медицина, авто, фитнес, консалтинг — одна платформа для всех.' },
      { title: 'Готово за минуты',      desc: 'Без технических настроек. Добавьте услуги, укажите часы, поделитесь ссылкой.' },
    ],
  },

  pricing: {
    sectionTitle: 'Прозрачные цены',
    sectionSub:   'Любой тариф — бесплатно 7 дней. Карта не нужна.',
    mostPopular:  'Самый популярный',
    perMonth:     '/мес.',
    afterTrial:   'после 7-дневного пробного периода',
    cancelNote:   'Отмена в любое время. Без обязательств.',
    cta:          'Начать бесплатный период',
    plans: [
      {
        name: 'Старт',
        features: ['1 точка', 'До 5 услуг', 'Подтверждения по e-mail', 'Базовое оформление'],
      },
      {
        name: 'Pro',
        features: ['Неограниченно услуг', 'Собственный домен', 'SMS-напоминания', 'Аналитика', 'Приоритетная поддержка'],
      },
      {
        name: 'Агентство',
        features: ['Несколько точек', 'White-label перепродажа', 'Доступ к API', 'Персональный менеджер', 'Кастомные интеграции'],
      },
    ],
  },

  testimonials: {
    sectionTitle: 'Бизнес доволен',
    items: [
      {
        name: 'Марина К.',
        business: 'Marina BeautyRoom',
        text: 'Клиенты теперь записываются сами, а не пишут мне в полночь. Это изменило всё.',
      },
      {
        name: 'Андрис П.',
        business: 'AutoPro Rīga',
        text: 'За один вечер перешли с бумажного журнала на полностью цифровую систему.',
      },
      {
        name: 'Екатерина С.',
        business: 'Old Riga SPA',
        text: 'Письма с подтверждением экономят мне по 20 сообщений в день. Клиенты всегда в курсе.',
      },
    ],
  },

  cta: {
    headline: 'Готовы принимать записи онлайн?',
    sub:      'Попробуйте BookFlow бесплатно 7 дней. Без карты и обязательств.',
    button:   'Начать бесплатный период →',
  },

  footer: {
    tagline:    '© 2026 BookFlow. Для бизнеса, который работает по записи.',
    signIn:     'Войти',
    getStarted: 'Начать',
    privacy:    'Конфиденциальность',
    terms:      'Условия',
  },

  booking: {
    stepService:  'Выберите услугу',
    stepStaff:    'Выберите специалиста',
    stepDatetime: 'Выберите время',
    stepDetails:  'Ваши данные',
    stepConfirm:  'Подтверждение',
    next:         'Далее',
    back:         'Назад',
    confirm:      'Подтвердить запись',
    bookAgain:    'Записаться снова',
    namePlaceholder:  'Имя и фамилия',
    emailPlaceholder: 'Адрес e-mail',
    phonePlaceholder: 'Номер телефона',
    notesPlaceholder: 'Примечания (необязательно)',
    duration:     'мин',
    successTitle: 'Вы записаны!',
    successSub:   'Подтверждение отправлено на вашу почту.',
    ref:          'Номер записи',
    noStaffPref:  'Без предпочтений',
    selectDate:   'Выберите дату',
    selectTime:   'Выберите время',
    noSlots:      'На этот день свободных окон нет.',
    cancelLink:   'Нужно отменить?',
  },

  signup: {
    title:          'Создать аккаунт',
    sub:            'Начните 7-дневный бесплатный период. Карта не нужна.',
    emailLabel:     'E-mail',
    passwordLabel:  'Пароль',
    businessLabel:  'Название бизнеса',
    submit:         'Создать аккаунт',
    alreadyAccount: 'Уже есть аккаунт?',
    signInLink:     'Войти',
    passwordHint:   'Не менее 8 символов',
  },
}

export default ru
