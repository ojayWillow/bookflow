/**
 * Russian translations — public-facing pages
 *
 * Register: formal "вы" for customer-facing pages.
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
    headline1:        'Онлайн-запись,',
    headline2:        'которая просто работает',
    subheadline:      'Создайте профессиональную страницу записи за несколько минут. Клиенты записываются сами, вы получаете уведомление — всё под контролем.',
    emailPlaceholder: 'Ваш e-mail',
    cta:              'Начать',
    trialNote:        '7 дней бесплатно · Карта не нужна',
  },

  overview: {
    statsToday:      'Записи на сегодня',
    statusConfirmed: 'подтверждено',
    statusPending:   'ожидает',
  },

  features: {
    sectionTitle: 'Всё необходимое для онлайн-записи',
    sectionSub:   'Быстро настраивается. Подходит для любого бизнеса.',
    items: [
      { title: 'Умное расписание',         desc: 'Укажите рабочие дни, часы и интервалы — система справится сама.' },
      { title: 'Гибкая длительность',      desc: 'У каждой услуги своя продолжительность. Двойные записи исключены.' },
      { title: 'Полная настройка',         desc: 'Названия услуг, цены, описания — всё меняется в несколько кликов.' },
      { title: 'Мгновенное подтверждение', desc: 'После каждой записи клиент получает письмо с полными деталями.' },
      { title: 'Для любой сферы',          desc: 'Красота, медицина, авто, фитнес, консалтинг — одна платформа для всех.' },
      { title: 'Готово за минуты',         desc: 'Без технических настроек. Добавьте услуги, укажите часы, поделитесь ссылкой.' },
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
      { name: 'Марина К.',   business: 'Marina BeautyRoom', text: 'Клиенты теперь записываются сами, а не пишут мне в полночь. Это изменило всё.' },
      { name: 'Андрис П.',   business: 'AutoPro Rīga',      text: 'За один вечер перешли с бумажного журнала на полностью цифровую систему.' },
      { name: 'Екатерина С.', business: 'Old Riga SPA',     text: 'Письма с подтверждением экономят мне по 20 сообщений в день. Клиенты всегда в курсе.' },
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
    locale:              'ru',
    stepService:         'Услуга',
    stepStaff:           'Специалист',
    stepDateTime:        'Дата и время',
    stepDetails:         'Данные',
    stepConfirm:         'Подтверждение',
    back:                'Назад',
    stepServiceTitle:    'Выберите услугу',
    stepServiceSub:      'Выберите услугу, которую хотите забронировать.',
    stepStaffTitle:      'Выберите специалиста',
    stepDateTimeTitle:   'Выберите дату и время',
    stepDetailsTitle:    'Ваши данные',
    stepDetailsSub:      'Нам нужны ваши данные для подтверждения записи.',
    stepConfirmTitle:    'Проверьте запись',
    stepConfirmSub:      'Пожалуйста, проверьте всё перед подтверждением.',
    anyoneAvailable:     'Любой специалист',
    anyoneAvailableSub:  'Назначим первого доступного специалиста.',
    noStaff:             'Нет доступных специалистов для этой услуги.',
    selectDate:          'Выберите дату',
    selectTime:          'Выберите время',
    noAvailableDatesTitle: 'Нет доступных дат',
    noAvailableDatesSub:   'Возможно, бизнес ещё не настроил расписание.',
    noSlots:             'На этот день свободных окон нет.',
    labelName:           'Имя и фамилия',
    labelEmail:          'E-mail',
    labelPhone:          'Номер телефона',
    labelNotes:          'Примечания',
    optional:            'необязательно',
    placeholderName:     'Анна Смирнова',
    placeholderNotes:    'Что нам стоит знать?',
    looksGood:           'Всё верно',
    reviewBooking:       'Проверить запись',
    bookingSummary:      'Детали записи',
    rowService:          'Услуга',
    rowDuration:         'Длительность',
    rowPrice:            'Стоимость',
    rowStaff:            'Специалист',
    rowDate:             'Дата',
    rowTime:             'Время',
    rowName:             'Имя',
    rowEmail:            'E-mail',
    rowPhone:            'Телефон',
    rowNotes:            'Примечания',
    cancellationPolicy:  'Условия отмены',
    confirmBooking:      'Подтвердить запись',
    confirming:          'Подтверждаем…',
    successTitle:        'Вы записаны!',
    successEmailSent:    'Подтверждение отправлено на {{email}}',
    successSaveRef:      'Сохраните номер записи — он может понадобиться.',
    bookingRef:          'Номер записи',
    at:                  'в',
    followUs:            'Подписывайтесь',
    min:                 'мин',
    errorGeneric:        'Что-то пошло не так. Попробуйте ещё раз.',
    errorNameParts:      'Пожалуйста, введите имя и фамилию',
    errorNameShort:      'Каждое имя должно содержать не менее 2 символов',
    errorEmailRequired:  'E-mail обязателен',
    errorEmailInvalid:   'Пожалуйста, введите корректный e-mail',
    errorPhoneRequired:  'Номер телефона обязателен',
    errorPhoneShort:     'Введите корректный номер телефона (мин. 7 цифр)',
    errorPhoneInvalid:   'Допустимы только цифры, пробелы, +, - и ()',
    anyoneAvailableStaffName: 'Любой специалист',
  },

  signup: {
    heading:                 'Создайте аккаунт BookFlow',
    subheading:              'Начните 7-дневный бесплатный период. Карта не нужна.',
    labelFirstName:          'Имя',
    labelLastName:           'Фамилия',
    labelBusinessName:       'Название бизнеса',
    labelUrl:                'Ваша ссылка для записи',
    labelEmail:              'E-mail',
    labelPassword:           'Пароль',
    labelConfirmPassword:    'Подтвердите пароль',
    placeholderFirstName:    'Анна',
    placeholderLastName:     'Смирнова',
    placeholderBusinessName: 'Glow Beauty Studio',
    placeholderEmail:        'anna@example.com',
    placeholderPassword:     '········',
    placeholderConfirmPassword: '········',
    slugWarning:             'Выбирайте внимательно — ссылку нельзя будет изменить после регистрации.',
    submit:                  'Создать аккаунт',
    submitting:              'Создаём…',
    noCreditCard:            'Карта не нужна · Отмена в любое время',
    alreadyHaveAccount:      'Уже есть аккаунт?',
    signIn:                  'Войти',
    errorPasswordMismatch:   'Пароли не совпадают',
    errorPasswordShort:      'Пароль должен содержать не менее 8 символов',
    errorGeneric:            'Что-то пошло не так. Попробуйте ещё раз.',
  },
}

export default ru
