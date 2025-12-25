export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://website14.com/#organization",
    "name": "Website14",
    "url": "https://website14.com",
    "logo": "https://website14.com/logo-icon.svg",
    "description": "Professional web development services with unlimited updates, 24/7 support, and enterprise-grade solutions.",
    "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
    },
    "contactPoint": {
        "@type": "ContactPoint",
        "email": "contact@website14.com",
        "contactType": "Customer Service",
        "availableLanguage": "English"
    },
    "sameAs": [
        "https://twitter.com/website14",
        "https://linkedin.com/company/website14",
        "https://facebook.com/website14",
        "https://github.com/website14"
    ],
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "500"
    },
    "offers": {
        "@type": "Offer",
        "description": "Professional web development services",
        "priceCurrency": "USD"
    },
    "areaServed": "Worldwide",
    "knowsAbout": [
        "Web Development",
        "Website Design",
        "E-commerce Development",
        "Mobile-First Design",
        "SEO Optimization"
    ]
};
