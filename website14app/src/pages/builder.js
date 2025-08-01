import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Builder() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    // User Information (collected at the end)
    name: '',
    email: '',
    phone: '',
    companyName: '',

    // Business Information
    businessType: '',
    currentWebsite: '',
    currentWebsiteUrl: '',

    // Website Requirements
    primaryPurpose: '',
    contentManagement: '',
    userFeatures: '',

    // E-commerce Requirements
    productCount: '',
    paymentMethods: [],
    shippingOptions: '',

    // Content Requirements
    pages: [],
    specialFeatures: [],
    mediaContent: '',
    customPages: '',

    // Design Preferences
    designStyle: '',
    colorPreferences: '',
    branding: '',

    // Technical Requirements
    mobileOptimization: '',
    performanceRequirements: '',
    integrations: [],

    // Timeline & Budget
    timeline: '',
    budget: '',
    support: '',

    // Additional Information
    specialRequirements: '',
    competitorWebsites: '',
    projectGoals: []
  });

  const sections = [
    {
      title: "Business Information",
      subtitle: "Tell us about your business",
      fields: [
        {
          type: "select",
          label: "What type of business do you have?",
          name: "businessType",
          required: true,
          options: [
            "Restaurant & Food Service",
            "Retail & E-commerce",
            "Healthcare & Medical",
            "Real Estate",
            "Professional Services",
            "Startup & Technology",
            "Education & Training",
            "Manufacturing & Industrial",
            "Construction & Contracting",
            "Automotive & Transportation",
            "Beauty & Personal Care",
            "Fitness & Wellness",
            "Entertainment & Media",
            "Non-profit & Charity",
            "Government & Public Sector",
            "Other"
          ]
        },
        {
          type: "radio",
          label: "Do you currently have a website?",
          name: "currentWebsite",
          required: true,
          options: [
            "No, this is my first website",
            "Yes, but it's outdated",
            "Yes, but I need a new one",
            "Yes, but I want to improve it"
          ]
        },
        {
          type: "text",
          label: "Current Website URL (if applicable)",
          name: "currentWebsiteUrl",
          required: false,
          placeholder: "https://example.com",
          showIf: "currentWebsite !== 'No, this is my first website'"
        }
      ]
    },
    {
      title: "Website Requirements",
      subtitle: "What do you need your website to do?",
      fields: [
        {
          type: "radio",
          label: "What is the main purpose of your website?",
          name: "primaryPurpose",
          required: true,
          options: [
            "Static Website - Simple information site",
            "Dynamic Website - Content management, blog, user accounts",
            "E-commerce - Online store with products and payments"
          ]
        },
        {
          type: "radio",
          label: "Do you need to update content regularly?",
          name: "contentManagement",
          required: true,
          options: [
            "No, static content is fine",
            "Yes, I want to add blog posts",
            "Yes, I need to update products/services frequently",
            "Yes, I need full content management system"
          ]
        },
        {
          type: "radio",
          label: "Do you need user accounts or member areas?",
          name: "userFeatures",
          required: true,
          options: [
            "No user accounts needed",
            "Yes, customer accounts for purchases",
            "Yes, member-only content areas",
            "Yes, user dashboard and profiles"
          ]
        }
      ]
    },
    {
      title: "E-commerce Requirements",
      subtitle: "Tell us about your online store needs",
      fields: [
        {
          type: "number",
          label: "How many products will you sell?",
          name: "productCount",
          required: true,
          placeholder: "Enter number of products",
          showIf: "primaryPurpose === 'E-commerce - Online store with products and payments'"
        },
        {
          type: "checkbox",
          label: "Which payment methods do you need?",
          name: "paymentMethods",
          required: true,
          options: [
            "PayPal",
            "Credit/Debit Cards (Stripe)",
            "Bank Transfer",
            "Cash on Delivery"
          ],
          showIf: "primaryPurpose === 'E-commerce - Online store with products and payments'"
        },
        {
          type: "radio",
          label: "Do you need shipping calculations?",
          name: "shippingOptions",
          required: true,
          options: [
            "No shipping (digital products)",
            "Fixed shipping rates",
            "Weight-based shipping",
            "Real-time shipping rates"
          ],
          showIf: "primaryPurpose === 'E-commerce - Online store with products and payments'"
        }
      ]
    },
    {
      title: "Content Requirements",
      subtitle: "What pages and features do you need?",
      fields: [
        {
          type: "checkbox",
          label: "Select the pages you need:",
          name: "pages",
          required: true,
          options: [
            "Home Page",
            "About Us",
            "Services/Products",
            "Contact Us",
            "Blog/News",
            "Portfolio/Gallery",
            "Testimonials/Reviews",
            "FAQ",
            "Team/Staff",
            "Careers/Jobs",
            "Privacy Policy",
            "Terms of Service",
            "Product Catalog",
            "Product Details",
            "Shopping Cart",
            "Checkout",
            "Order Tracking",
            "Customer Account",
            "Wishlist",
            "Product Reviews",
            "Service Details",
            "Pricing",
            "Booking/Appointment",
            "Location/Branches",
            "Downloads/Resources",
            "Support/Help"
          ]
        },
        {
          type: "checkbox",
          label: "Do you need any of these special features?",
          name: "specialFeatures",
          required: false,
          options: [
            "Blog/News Section",
            "Portfolio/Gallery",
            "Testimonials",
            "FAQ Section",
            "Newsletter Signup",
            "Social Media Integration",
            "Contact Forms",
            "Appointment Booking",
            "Live Chat",
            "Multi-language"
          ]
        },
        {
          type: "radio",
          label: "What type of content will you have?",
          name: "mediaContent",
          required: true,
          options: [
            "Text and images only",
            "Videos and animations",
            "File downloads (PDFs, documents)",
            "Interactive elements (quizzes, calculators)"
          ]
        },
        {
          type: "textarea",
          label: "Custom Pages (add any other pages you need):",
          name: "customPages",
          required: false,
          placeholder: "Enter custom page names, one per line"
        }
      ]
    },
    {
      title: "Design Preferences",
      subtitle: "How should your website look?",
      fields: [
        {
          type: "radio",
          label: "What style best represents your brand?",
          name: "designStyle",
          required: true,
          options: [
            "Modern & Minimal - Clean, simple design",
            "Professional & Corporate - Business-focused",
            "Creative & Artistic - Bold, colorful design",
            "Traditional & Classic - Timeless, elegant",
            "Tech & Innovative - Cutting-edge, futuristic"
          ]
        },
        {
          type: "radio",
          label: "Do you have brand colors?",
          name: "colorPreferences",
          required: true,
          options: [
            "Yes, I have specific brand colors",
            "No, I need help choosing colors",
            "I want to use industry-appropriate colors"
          ]
        },
        {
          type: "radio",
          label: "Do you have existing branding materials?",
          name: "branding",
          required: true,
          options: [
            "Yes, I have a logo and brand guidelines",
            "Yes, I have a logo but need brand guidelines",
            "No, I need logo design services",
            "No, I want to use text-based branding"
          ]
        }
      ]
    },
    {
      title: "Technical Requirements",
      subtitle: "Performance and integration needs",
      fields: [
        {
          type: "radio",
          label: "How important is mobile experience?",
          name: "mobileOptimization",
          required: true,
          options: [
            "Essential - Most of my customers use mobile",
            "Important - Good mobile experience needed",
            "Standard - Basic mobile optimization is fine"
          ]
        },
        {
          type: "radio",
          label: "Do you need special performance features?",
          name: "performanceRequirements",
          required: true,
          options: [
            "Standard - Normal website performance",
            "Fast Loading - Optimized for speed",
            "High Traffic - Handle many visitors",
            "SEO Optimized - Search engine focused"
          ]
        },
        {
          type: "checkbox",
          label: "Do you need to connect with other services?",
          name: "integrations",
          required: false,
          options: [
            "Google Analytics",
            "Social Media",
            "Email Marketing",
            "Payment Processing",
            "Booking System"
          ]
        }
      ]
    },
    {
      title: "Timeline & Budget",
      subtitle: "When do you need it and what's your budget?",
      fields: [
        {
          type: "radio",
          label: "When do you need your website?",
          name: "timeline",
          required: true,
          options: [
            "Urgent - Within 2 weeks",
            "Standard - 3-4 weeks",
            "Flexible - 4-6 weeks",
            "No Rush - 6+ weeks"
          ]
        },
        {
          type: "radio",
          label: "What's your budget for this project?",
          name: "budget",
          required: true,
          options: [
            "Basic - Essential features only",
            "Standard - Good features and design",
            "Premium - Advanced features and custom design"
          ]
        },
        {
          type: "radio",
          label: "What level of support do you need after launch?",
          name: "support",
          required: true,
          options: [
            "Basic - Hosting and security updates",
            "Standard - Regular updates and maintenance",
            "Premium - Content updates and modifications"
          ]
        }
      ]
    },
    {
      title: "Additional Information",
      subtitle: "Any other details we should know?",
      fields: [
        {
          type: "textarea",
          label: "Special Requirements",
          name: "specialRequirements",
          required: false,
          placeholder: "Any specific features or requirements not mentioned above?"
        },
        {
          type: "textarea",
          label: "Competitor Websites",
          name: "competitorWebsites",
          required: false,
          placeholder: "Do you have examples of websites you like?"
        },
        {
          type: "checkbox",
          label: "What are your main goals for this website?",
          name: "projectGoals",
          required: true,
          options: [
            "Generate Leads",
            "Sell Products",
            "Build Brand",
            "Provide Information",
            "Improve Customer Service"
          ]
        }
      ]
    },
    {
      title: "Your Information",
      subtitle: "Tell us how to reach you",
      fields: [
        {
          type: "text",
          label: "Full Name",
          name: "name",
          required: true,
          placeholder: "Enter your full name"
        },
        {
          type: "email",
          label: "Email Address",
          name: "email",
          required: true,
          placeholder: "Enter your email address"
        },
        {
          type: "tel",
          label: "Phone Number",
          name: "phone",
          required: true,
          placeholder: "Enter your phone number"
        },
        {
          type: "text",
          label: "Company Name",
          name: "companyName",
          required: false,
          placeholder: "Enter your company name (optional)"
        }
      ]
    }
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
        ? [...(prev[name] || []), value]
        : (prev[name] || []).filter(item => item !== value)
    }));
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      // Show login prompt if user is not logged in
      if (!user) {
        setShowLoginPrompt(true);
      } else {
        submitForm();
      }
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const submitForm = async () => {
    try {
      // Calculate package recommendation based on form data
      let recommendedPackage = "static";
      let totalPoints = 0;

      // Scoring logic based on form data
      if (formData.primaryPurpose === "E-commerce - Online store with products and payments") {
        recommendedPackage = "ecommerce";
        totalPoints = 10;
      } else if (formData.primaryPurpose === "Dynamic Website - Content management, blog, user accounts") {
        recommendedPackage = "dynamic";
        totalPoints = 6;
      } else {
        recommendedPackage = "static";
        totalPoints = 3;
      }

      // Get user location for pricing
      const locationResponse = await fetch('https://ipapi.co/json/');
      const locationData = await locationResponse.json();

      // Create lead data
      const leadData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.companyName,
        industry: formData.businessType,
        source: "project-builder",
        status: "new",
        ipAddress: locationData.ip,
        country: locationData.country_name,
        city: locationData.city,
        currency: locationData.currency,
        requirements: formData,
        recommendedPackage,
        totalPoints,
        createdAt: new Date(),
        followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        userId: user ? user.uid : null
      };

      // Save lead data to Firestore
      if (user) {
        const { db } = await import('../lib/firebase');
        const { collection, addDoc } = await import('firebase/firestore');

        try {
          await addDoc(collection(db, 'leads'), leadData);
          console.log('Lead saved to Firestore successfully');
        } catch (firestoreError) {
          console.error('Error saving lead to Firestore:', firestoreError);
          // Continue with the flow even if Firestore save fails
        }
      }

      // Store results in localStorage for quote generation
      localStorage.setItem("builderResults", JSON.stringify({
        formData,
        recommendedPackage,
        totalPoints,
        leadData,
        timestamp: new Date().toISOString()
      }));

      // Redirect to quote page
      router.push('/quote');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    }
  };

  const getProgressPercentage = () => {
    return ((currentSection + 1) / sections.length) * 100;
  };

  const renderField = (field) => {
    const value = formData[field.name];

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return (
          <input
            type={field.type}
            value={value || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        );

      case "textarea":
        return (
          <textarea
            value={value || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        );

      case "select":
        return (
          <select
            value={value || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="">Select an option</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="space-y-3">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  required={field.required}
                  className="w-4 h-4 text-black focus:ring-black"
                />
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-3">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={value && value.includes(option)}
                  onChange={(e) => handleCheckboxChange(field.name, option, e.target.checked)}
                  required={field.required}
                  className="w-4 h-4 text-black focus:ring-black"
                />
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const shouldShowField = (field) => {
    if (!field.showIf) return true;

    // Simple condition evaluation
    const condition = field.showIf;
    if (condition.includes("primaryPurpose")) {
      const expectedValue = condition.match(/=== '([^']+)'/)?.[1];
      return formData.primaryPurpose === expectedValue;
    }
    if (condition.includes("currentWebsite")) {
      const expectedValue = condition.match(/!== '([^']+)'/)?.[1];
      return formData.currentWebsite !== expectedValue;
    }

    return true;
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Project Builder - Website14</title>
          <meta name="description" content="Build your custom website with our interactive project builder. Get a personalized quote based on your needs." />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>

        <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
          <Header />

          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading project builder...</p>
            </div>
          </div>

          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Project Builder - Website14</title>
        <meta name="description" content="Build your custom website with our interactive project builder. Get a personalized quote based on your needs." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
        <Header />

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center items-center py-8">
          <div className="w-full max-w-4xl mx-auto px-5">
            {showLoginPrompt ? (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
                <div className="mb-6">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost Done!</h2>
                  <p className="text-gray-600 mb-6">
                    Great! We've collected all your project requirements. Now we just need you to create an account or sign in to get your personalized quote and start your project.
                  </p>
                </div>

                <div className="space-y-4">
                  <Link
                    href={`/signup?returnUrl=${encodeURIComponent(router.asPath)}`}
                    className="inline-block w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium"
                  >
                    Create Account & Get Quote
                  </Link>

                  <div className="text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link
                      href={`/login?returnUrl=${encodeURIComponent(router.asPath)}`}
                      className="text-black hover:text-gray-800 font-medium"
                    >
                      Sign in here
                    </Link>
                  </div>

                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    ← Go back to questionnaire
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Section {currentSection + 1} of {sections.length}
                    </span>
                    <span className="text-sm text-gray-600">
                      {Math.round(getProgressPercentage())}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>

                {/* Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                  <h2 className="font-jetbrains text-3xl font-bold text-black mb-2">
                    {sections[currentSection].title}
                  </h2>
                  <p className="text-gray-600 mb-8">
                    {sections[currentSection].subtitle}
                  </p>

                  {/* Fields */}
                  <div className="space-y-6">
                    {sections[currentSection].fields.map((field, index) => (
                      shouldShowField(field) && (
                        <div key={index} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {renderField(field)}
                        </div>
                      )
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <button
                    onClick={prevSection}
                    disabled={currentSection === 0}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <button
                    onClick={nextSection}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    {currentSection === sections.length - 1 ? "Get Quote" : "Next"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
} 