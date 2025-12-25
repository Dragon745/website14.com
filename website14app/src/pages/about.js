
import SEO from '../components/SEO';
import { organizationSchema } from '../data/seoData';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutHero from '../components/about/AboutHero';
import OurStory from '../components/about/OurStory';
import OurValues from '../components/about/OurValues';
import ProcessSection from '../components/about/ProcessSection';
import TeamSection from '../components/about/TeamSection';
import AboutCTA from '../components/about/AboutCTA';

export default function About() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
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
            "name": "About Us",
            "item": "https://website14.com/about"
          }
        ]
      },
      {
        "@type": "AboutPage",
        "mainEntity": {
          "@id": "https://website14.com/#organization"
        },
        "name": "About Website14",
        "description": "Learn about Website14 - We are your tech partners, committed to building professional, high-converting websites for businesses of all sizes."
      }
    ]
  };

  return (
    <>
      <SEO
        title="About Us - Website14 | Building Digital Futures"
        description="Learn about Website14 - We are your tech partners, committed to building professional, high-converting websites for businesses of all sizes."
        keywords="about website14, web design agency, tech partner, professional web development, website builders team, in-house developers"
        url="https://website14.com/about"
        type="website"
        structuredData={structuredData}
      />

      <div className="bg-white text-slate-900 font-sans min-h-screen flex flex-col">
        <Header />

        {/* Main Content */}
        <div className="flex-1">
          <AboutHero />
          <OurStory />
          <OurValues />
          <ProcessSection />
          <TeamSection />
          <AboutCTA />
        </div>

        <Footer />
      </div>
    </>
  );
}