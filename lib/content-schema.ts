import { z } from "zod";

// Единая схема содержимого сайта. Используется в трёх местах:
// 1) типы для компонентов сайта (SiteContent),
// 2) проверка data/content.json при сборке,
// 3) валидация черновика в админке перед публикацией.

const text = z.string();
const requiredText = z.string().min(1, "Поле не может быть пустым");
const href = z.string().min(1, "Укажите ссылку");

const linkSchema = z.object({
  label: requiredText,
  href
});

const socialSchema = z.object({
  label: requiredText,
  href,
  icon: z.enum(["telegram", "max", "vk"])
});

const imageSchema = z.object({
  src: requiredText,
  alt: text
});

const metricSchema = z.object({
  value: requiredText,
  label: requiredText
});

export const contentSchema = z.object({
  meta: z.object({
    lang: requiredText,
    siteUrl: text,
    title: requiredText,
    description: requiredText,
    ogTitle: text,
    ogDescription: text,
    ogImage: text,
    yandexMetrikaId: text,
    yandexVerification: text,
    googleVerification: text
  }),

  // Реквизиты вводятся один раз и подставляются во все секции сайта.
  company: z.object({
    name: requiredText,
    legalName: requiredText,
    phone: requiredText,
    email: requiredText.pipe(z.email("Некорректный email")),
    address: requiredText,
    addressShort: requiredText,
    schedule: requiredText,
    scheduleShort: requiredText,
    city: requiredText,
    inn: text,
    ogrn: text,
    legalAddress: text,
    foundedYear: text
  }),

  nav: z.object({
    logoSrc: requiredText,
    logoAlt: text,
    menuOpenLabel: requiredText,
    menuCloseLabel: requiredText,
    links: z.array(linkSchema),
    socials: z.array(socialSchema),
    cta: linkSchema,
    callLabel: requiredText
  }),

  hero: z.object({
    title: requiredText,
    highlight: text,
    subtitle: text,
    primaryCta: linkSchema,
    secondaryCta: linkSchema,
    advantages: z.array(requiredText),
    images: z.array(imageSchema).min(1, "Нужна хотя бы одна фотография"),
    stats: z.array(metricSchema)
  }),

  clientsLogos: z.object({
    id: requiredText,
    title: requiredText,
    note: text,
    items: z.array(imageSchema)
  }),

  services: z.object({
    id: requiredText,
    title: requiredText,
    subtitle: text,
    main: z.array(
      z.object({
        icon: requiredText,
        imageSrc: requiredText,
        imageAlt: text,
        title: requiredText,
        description: text,
        price: text
      })
    ),
    additionalTitle: requiredText,
    additional: z.array(
      z.object({
        icon: requiredText,
        title: requiredText,
        description: text,
        price: text
      })
    )
  }),

  whyUs: z.object({
    id: requiredText,
    eyebrow: text,
    title: requiredText,
    subtitle: text,
    rows: z.array(
      z.object({
        card: z.object({
          eyebrow: text,
          title: requiredText,
          description: text,
          metrics: z.array(metricSchema)
        }),
        image: imageSchema,
        imageFirst: z.boolean()
      })
    ),
    advantages: z.array(
      z.object({
        icon: requiredText,
        title: requiredText,
        description: text
      })
    )
  }),

  cta: z.object({
    title: requiredText,
    subtitle: text,
    button: linkSchema,
    checks: z.array(requiredText)
  }),

  stages: z.object({
    id: requiredText,
    title: requiredText,
    subtitle: text,
    steps: z.array(
      z.object({
        number: requiredText,
        title: requiredText,
        description: text
      })
    )
  }),

  reviews: z.object({
    id: requiredText,
    title: requiredText,
    subtitle: text,
    previousLabel: requiredText,
    nextLabel: requiredText,
    items: z.array(
      z.object({
        imageSrc: requiredText,
        imageAlt: text,
        text: requiredText,
        author: requiredText,
        company: text
      })
    )
  }),

  directorQuote: z.object({
    imageSrc: requiredText,
    imageAlt: text,
    quoteMark: text,
    text: requiredText,
    signatureSrc: text,
    signatureAlt: text,
    author: requiredText,
    role: text
  }),

  faq: z.object({
    id: requiredText,
    title: requiredText,
    subtitle: text,
    items: z.array(
      z.object({
        question: requiredText,
        answer: requiredText
      })
    )
  }),

  finalForm: z.object({
    id: requiredText,
    eyebrow: text,
    title: requiredText,
    description: text,
    bullets: z.array(requiredText),
    nameLabel: requiredText,
    namePlaceholder: text,
    phoneLabel: requiredText,
    phonePlaceholder: text,
    emailLabel: requiredText,
    emailPlaceholder: text,
    messageLabel: requiredText,
    messagePlaceholder: text,
    submitText: requiredText,
    sendingText: requiredText,
    consentPrefix: text,
    consentLinkText: requiredText,
    successTitle: requiredText,
    successText: text,
    errorText: requiredText
  }),

  contacts: z.object({
    id: requiredText,
    mapCenter: z.tuple([z.number(), z.number()]),
    mapWidgetCenter: z.tuple([z.number(), z.number()]),
    mapZoom: z.number().min(1).max(21),
    mapAlt: text,
    mapLoadLabel: requiredText,
    mapNote: text,
    mapButtons: z.array(
      z.object({
        label: requiredText,
        href,
        icon: requiredText
      })
    ),
    title: requiredText,
    phoneLabel: requiredText,
    emailLabel: requiredText,
    addressLabel: requiredText,
    scheduleLabel: requiredText
  }),

  footer: z.object({
    logoSrc: requiredText,
    logoAlt: text,
    about: text,
    socials: z.array(socialSchema),
    navTitle: requiredText,
    nav: z.array(linkSchema),
    servicesTitle: requiredText,
    services: z.array(linkSchema),
    contactsTitle: requiredText,
    privacy: requiredText,
    privacyHref: href
  }),

  portfolio: z.object({
    id: requiredText,
    title: requiredText,
    subtitle: text,
    previousLabel: requiredText,
    nextLabel: requiredText,
    featured: imageSchema,
    thumbnails: z.array(imageSchema)
  }),

  cookieBanner: z.object({
    enabled: z.boolean(),
    text: requiredText,
    linkText: requiredText,
    acceptLabel: requiredText,
    declineLabel: requiredText
  }),

  notFound: z.object({
    title: requiredText,
    subtitle: text,
    buttonLabel: requiredText,
    secondaryLabel: requiredText
  }),

  privacy: z.object({
    title: requiredText,
    updatedAt: text,
    intro: text,
    backLabel: requiredText,
    sections: z.array(
      z.object({
        title: requiredText,
        text: requiredText
      })
    )
  })
});

export type SiteContent = z.infer<typeof contentSchema>;
export type CompanyContent = SiteContent["company"];
