
import { useState } from 'react';
import SEO from '../components/SEO';
import { organizationSchema } from '../data/seoData';
import { faqData } from '../data/faqData';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FAQHero from '../components/faq/FAQHero';
import FAQList from '../components/faq/FAQList';
import FAQCTA from '../components/faq/FAQCTA';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');

  // Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.flatMap(category =>
      category.items.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    )
  };

  const structuredData = [
    organizationSchema,
    faqSchema,
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://website14.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "FAQ",
          "item": "https://website14.com/faq"
        }
      ]
    }
  ];

  return (
    <>
      <SEO
        title="FAQ - Website14 | Common Questions"
        description="Find answers to common questions about Website14's pricing, features, and web development services. Get clear information about our process and support."
        keywords="faq, website14 questions, web development faq, pricing questions, support faq, website building process"
        url="https://website14.com/faq"
        type="website"
        structuredData={structuredData}
      />

      <div className="bg-white text-slate-900 font-sans min-h-screen flex flex-col">
        <Header />

        {/* Main Content */}
        <div className="flex-1">
          <FAQHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <FAQList searchQuery={searchQuery} />
          <FAQCTA />
        </div>

        <Footer />
      </div>
    </>
  );
}