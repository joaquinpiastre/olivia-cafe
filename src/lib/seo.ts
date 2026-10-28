import { SITE, hoursSchema, telHref, type ContactInfo } from './site';

/** Datos estructurados schema.org (CafeOrCoffeeShop) con dirección y horarios. */
export function cafeJsonLd(c: ContactInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    '@id': `${SITE.url}/#cafe`,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    logo: `${SITE.url}/img/marca/logo-olivia.png`,
    image: [`${SITE.url}/img/hero-1.jpg`, `${SITE.url}/img/esencia-local.jpg`],
    telephone: telHref(c).replace('tel:', ''),
    email: c.email,
    servesCuisine: ['Pastelería', 'Café', 'Meriendas', 'Opciones Sin TACC'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.street,
      addressLocality: c.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    openingHoursSpecification: hoursSchema(c).map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: [c.instagramUrl, c.candyUrl, c.facebookUrl],
    hasMenu: `${SITE.url}/menu`,
    acceptsReservations: 'True',
  };
}
