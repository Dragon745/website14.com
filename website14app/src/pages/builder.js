import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Builder() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  // Questions and options
  const questions = [
    {
      title: "What type of website do you need?",
      options: [
        { text: "Simple business website", value: "static", points: 1 },
        { text: "Blog or content-heavy site", value: "dynamic", points: 2 },
        {
          text: "Online store with products",
          value: "ecommerce",
          points: 3,
        },
      ],
    },
    {
      title: "How many pages do you need?",
      options: [
        { text: "1-5 pages", value: "small", points: 1 },
        { text: "6-10 pages", value: "medium", points: 2 },
        { text: "10+ pages", value: "large", points: 3 },
      ],
    },
    {
      title: "Do you need an admin panel?",
      options: [
        {
          text: "No, I'll manage content through you",
          value: "none",
          points: 1,
        },
        {
          text: "Yes, basic content management",
          value: "basic",
          points: 2,
        },
        {
          text: "Yes, full dashboard with analytics",
          value: "full",
          points: 3,
        },
      ],
    },
    {
      title: "Do you need payment processing?",
      options: [
        { text: "No payments needed", value: "none", points: 1 },
        { text: "Simple contact forms", value: "forms", points: 1 },
        {
          text: "Full e-commerce with payments",
          value: "ecommerce",
          points: 3,
        },
      ],
    },
    {
      title: "What's your timeline?",
      options: [
        { text: "No rush, take your time", value: "relaxed", points: 1 },
        { text: "Standard 2-3 weeks", value: "standard", points: 2 },
        { text: "Need it fast (1-2 weeks)", value: "urgent", points: 3 },
      ],
    },
  ];

  useEffect(() => {
    // Check if type is pre-selected from services page
    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedType = urlParams.get("type");

    if (preSelectedType) {
      // Skip first question if type is pre-selected
      setAnswers([{
        question: 0,
        value: preSelectedType,
        points:
          preSelectedType === "static"
            ? 1
            : preSelectedType === "dynamic"
              ? 2
              : 3,
      }]);
      setCurrentQuestion(1);
    }
  }, []);

  const selectOption = (index) => {
    setSelectedOption(index);
  };

  const nextQuestion = () => {
    if (selectedOption === null) return;

    const question = questions[currentQuestion];
    const newAnswers = [...answers, {
      question: currentQuestion,
      value: question.options[selectedOption].value,
      points: question.options[selectedOption].points,
    }];

    setAnswers(newAnswers);
    setCurrentQuestion(currentQuestion + 1);
    setSelectedOption(null);
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
      setSelectedOption(null);
    }
  };

  const showResults = () => {
    const totalPoints = answers.reduce(
      (sum, answer) => sum + answer.points,
      0
    );
    let recommendation = "";
    let setupPrice = "";
    let monthlyPrice = "";
    let features = [];

    if (totalPoints <= 6) {
      recommendation = "Static Website";
      setupPrice = "$59";
      monthlyPrice = "$5";
      features = [
        "5 Pages Included",
        "Mobile-first Design",
        "SEO + Speed Optimization",
        "Unlimited Updates",
      ];
    } else if (totalPoints <= 10) {
      recommendation = "Dynamic Website";
      setupPrice = "$120";
      monthlyPrice = "$7.2";
      features = [
        "7 Pages Included",
        "Basic CMS Admin Panel",
        "WordPress/Custom PHP",
        "Unlimited Updates",
      ];
    } else {
      recommendation = "E-commerce Website";
      setupPrice = "$180";
      monthlyPrice = "$11";
      features = [
        "10 Pages + 30 Products",
        "Full Dashboard",
        "2 Payment Gateways",
        "Unlimited Updates",
      ];
    }

    return (
      <div className="text-center">
        <h2 className="font-jetbrains text-3xl font-bold text-black mb-6">Your Recommendation</h2>
        <div className="bg-gray-100 rounded-lg p-8 mb-8">
          <h3 className="font-jetbrains text-2xl font-bold text-black mb-4">{recommendation}</h3>
          <div className="text-4xl font-bold text-black mb-2">{setupPrice}</div>
          <div className="text-lg text-gray-600 mb-6">One-time setup + {monthlyPrice}/month</div>
          <ul className="space-y-3 text-left max-w-md mx-auto">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <span className="text-green-600 mr-2">✓</span>{feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <Link href={`/contact?type=${recommendation.toLowerCase().replace(" ", "-")}&setup=${setupPrice}&monthly=${monthlyPrice}`}>
            <button className="w-full bg-black text-white py-4 px-8 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300 text-lg">
              Get Started Now
            </button>
          </Link>
          <Link href="/services">
            <button className="w-full bg-white border-2 border-black text-black py-3 px-8 rounded-lg font-medium hover:bg-black hover:text-white transition-all duration-300">
              View All Services
            </button>
          </Link>
        </div>
      </div>
    );
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const showResultsPage = currentQuestion >= questions.length;

  return (
    <>
      <Head>
        <title>Project Builder - Website14</title>
        <meta name="description" content="Build your custom website project with Website14. Get a free quote and start your web development journey." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-900">Website14</Link>
              </div>
              <div className="flex items-center space-x-8">
                <Link href="/services" className="text-gray-600 hover:text-gray-900 transition-colors">Services</Link>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
                <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</Link>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-4xl mx-auto px-5 py-16">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-black h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question Container */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-8">
              {showResultsPage ? (
                showResults()
              ) : (
                <>
                  <h2 className="font-jetbrains text-2xl font-bold text-black mb-6">
                    {questions[currentQuestion].title}
                  </h2>
                  <div className="space-y-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        className={`w-full bg-white border-2 rounded-lg p-6 text-left font-inter text-lg font-medium text-gray-800 cursor-pointer transition-all duration-300 hover:border-gray-500 hover:bg-gray-50 ${selectedOption === index
                            ? "border-black bg-gray-100"
                            : "border-gray-300"
                          }`}
                        onClick={() => selectOption(index)}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Navigation Buttons */}
            {!showResultsPage && (
              <div className="flex justify-between">
                <button
                  onClick={prevQuestion}
                  className={`bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:border-gray-500 transition-colors duration-300 ${currentQuestion === 0 ? "hidden" : ""
                    }`}
                >
                  Previous
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={selectedOption === null}
                  className={`bg-black text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300 ml-auto ${selectedOption === null ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {isLastQuestion ? "Get Results" : "Next"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
          <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-jetbrains text-xl font-bold text-black">Website14</div>
            <ul className="flex gap-8 text-sm">
              <li>
                <Link href="/services" className="text-gray-500 hover:text-black transition-colors duration-300 font-inter">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 hover:text-black transition-colors duration-300 font-inter">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-500 hover:text-black transition-colors duration-300 font-inter">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-black transition-colors duration-300 font-inter">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </>
  );
} 