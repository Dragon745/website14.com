// Services page static data and content
export const defaultPricing = {
    static: { setup: 59, monthly: 5 },
    dynamic: { setup: 120, monthly: 7.2 },
    ecommerce: { setup: 180, monthly: 11 },
    addons: {
        extraPage: 3,
        extraProduct: 0.2,
        extraPaymentGateway: 5,
        emailAccount: 2.4,
        contactForms: 2,
        newsletterSignup: 2.5,
        socialMediaIntegration: 4,
        googleMapsIntegration: 3,
        bookingAppointmentSystem: 10,
        liveChat: 5,
        multiLanguageSupport: 8,
        searchFunctionality: 2.5,
        imageGallery: 2,
        videoIntegration: 4,
        logoDesign: 15
    },
    discounts: {
        yearly: 10,
        twoYear: 15,
        threeYear: 20
    }
};

export const testimonials = [
    {
        id: 1,
        rating: 5,
        text: "Website14 built our e-commerce site in just 2 weeks. The site loads super fast and we're already seeing sales. Their unlimited updates policy is a game-changer!",
        author: {
            initials: "SJ",
            name: "Sarah Johnson",
            title: "Boutique Owner",
            avatarGradient: "from-purple-400 to-purple-600"
        }
    },
    {
        id: 2,
        rating: 5,
        text: "Finally, a web company that doesn't disappear after launch! They've been updating our site for 6 months and always respond within hours.",
        author: {
            initials: "MC",
            name: "Mike Chen",
            title: "Restaurant Owner",
            avatarGradient: "from-blue-400 to-blue-600"
        }
    },
    {
        id: 3,
        rating: 5,
        text: "I was paying $300/month for a basic Shopify store. Website14 built me a custom site for $59 setup + $5/month. It looks 10x better and converts better too!",
        author: {
            initials: "LR",
            name: "Lisa Rodriguez",
            title: "Online Store Owner",
            avatarGradient: "from-pink-400 to-pink-600"
        }
    }
];

export const trustIndicators = [
    {
        value: 500,
        suffix: "+",
        label: "Happy Clients",
        duration: 2000
    },
    {
        value: 98,
        suffix: "%",
        label: "Satisfaction Rate",
        duration: 2000
    },
    {
        label: "Support Available",
        static: "24/7"
    },
    {
        value: 30,
        suffix: " Days",
        label: "Money Back",
        duration: 2000
    }
];

export const servicePackages = {
    static: {
        title: "Static Website",
        subtitle: "Perfect for portfolios, landing pages, and simple business sites",
        setupPrice: "static.setup",
        monthlyPrice: "static.monthly",
        badge: "Most Popular for Small Businesses",
        badgeColor: "bg-purple-100 text-purple-800",
        features: [
            { text: "5 Pages Included" },
            { text: "Mobile-First Design" },
            { text: "SEO + Speed Optimization" },
            { text: "Unlimited Updates" },
            { text: "SSL Certificate" }
        ],
        buttonText: "Start Your Website",
        packageType: "staticSetup"
    },
    dynamic: {
        title: "Dynamic Website",
        subtitle: "Ideal for blogs, service businesses, and content-heavy sites",
        setupPrice: "dynamic.setup",
        monthlyPrice: "dynamic.monthly",
        badge: "Best Value for Growing Businesses",
        badgeColor: "bg-purple-100 text-purple-800",
        isPopular: true,
        features: [
            { text: "7 Pages Included" },
            { text: "1 Product Listing" },
            { text: "CMS Admin Panel" },
            { text: "1 Payment Gateway" },
            { text: "Mobile-First Design" },
            { text: "SEO + Speed Optimization" },
            { text: "Unlimited Updates" },
            { text: "SSL Certificate" }
        ],
        buttonText: "Start Your Website",
        packageType: "dynamicSetup"
    },
    ecommerce: {
        title: "E-commerce Website",
        subtitle: "Complete online stores with payment processing",
        setupPrice: "ecommerce.setup",
        monthlyPrice: "ecommerce.monthly",
        badge: "Complete Online Store Solution",
        badgeColor: "bg-purple-100 text-purple-800",
        features: [
            { text: "10 Pages Included" },
            { text: "30 Products Listing" },
            { text: "Full Dashboard" },
            { text: "2 Payment Gateways" },
            { text: "Inventory Management" },
            { text: "Mobile-First Design" },
            { text: "SEO + Speed Optimization" },
            { text: "Unlimited Updates" },
            { text: "SSL Certificate" }
        ],
        buttonText: "Start Your Store",
        packageType: "ecommerceSetup"
    }
};

export const whyChooseReasons = [
    {
        title: "Professional Websites for the Price of DIY Tools",
        description: "You pay a small monthly fee — and get a full-blown custom-built website that looks better, loads faster, and ranks higher on Google. No templates. No compromises.",
        icon: "security"
    },
    {
        title: "Unlimited Updates, Forever",
        description: "Tired of agencies that ghost you after delivery? With us, you get unlimited content updates and edits — as long as you're hosted with us. We treat your website like a living, growing asset.",
        icon: "refresh"
    },
    {
        title: "Mobile-First, Speed-Optimized, SEO-Ready",
        description: "Every site we build is optimized for mobile phones (first!), blazing speed, Google rankings, and security (SSL + proactive monitoring).",
        icon: "bolt"
    },
    {
        title: "No Hidden Charges",
        description: "Our pricing is simple, clear, and flexible. You pay for what you use, and can upgrade anytime. Want more pages? More products? More emails? We'll grow with you.",
        icon: "check-circle"
    },
    {
        title: "Real Human Support, Always",
        description: "You're not dealing with bots or a faceless company. We're a real team — driven, skilled, and just one message away. We'll guide you, advise you, and handle everything technical so you can focus on your business.",
        icon: "users"
    }
];

export const inShortPoints = [
    "You focus on your brand",
    "We'll handle the tech, design, updates, speed, security, and everything in between",
    "Affordably, professionally, and passionately"
];

export const featureComparison = {
    headers: ["Feature", "Static Website", "Dynamic Website", "E-commerce Website"],
    rows: [
        { feature: "Pages Included", static: "5", dynamic: "7", ecommerce: "10" },
        { feature: "Extra Page", static: "extraPage", dynamic: "extraPage", ecommerce: "extraPage", isPricing: true },
        { feature: "Products", static: "-", dynamic: "1", ecommerce: "30", highlight: true },
        { feature: "Extra Product", static: "-", dynamic: "-", ecommerce: "extraProduct", isPricing: true },
        { feature: "Payment Gateways", static: "-", dynamic: "1", ecommerce: "2", highlight: true },
        { feature: "Extra Payment Gateway", static: "-", dynamic: "extraPaymentGateway", ecommerce: "extraPaymentGateway", isPricing: true }
    ]
};

export const addonsCategories = [
    {
        title: "Extra Pages",
        icon: "document",
        items: [
            { name: "Static Website Page", key: "extraPage" },
            { name: "Dynamic Website Page", key: "extraPage" },
            { name: "E-commerce Page", key: "extraPage" }
        ]
    },
    {
        title: "E-commerce Features",
        icon: "shopping-cart",
        items: [
            { name: "Extra Product", key: "extraProduct" },
            { name: "Extra Payment Gateway", key: "extraPaymentGateway" }
        ]
    },
    {
        title: "Additional Features",
        icon: "cog",
        items: [
            { name: "Contact Forms", key: "contactForms" },
            { name: "Newsletter Signup", key: "newsletterSignup" },
            { name: "Social Media Integration", key: "socialMediaIntegration" },
            { name: "Google Maps Integration", key: "googleMapsIntegration" },
            { name: "Booking/Appointment System", key: "bookingAppointmentSystem" },
            { name: "Live Chat", key: "liveChat" },
            { name: "Multi-language Support", key: "multiLanguageSupport" },
            { name: "Search Functionality", key: "searchFunctionality" },
            { name: "Image Gallery", key: "imageGallery" },
            { name: "Video Integration", key: "videoIntegration" },
            { name: "Logo Design", key: "logoDesign" }
        ]
    }
];

export const additionalFeatures = [
    {
        title: "Communication Features",
        color: "purple",
        items: [
            { name: "Contact Forms", key: "contactForms" },
            { name: "Newsletter Signup", key: "newsletterSignup" },
            { name: "Live Chat", key: "liveChat" }
        ]
    },
    {
        title: "Social & Maps",
        color: "green",
        items: [
            { name: "Social Media Integration", key: "socialMediaIntegration" },
            { name: "Google Maps Integration", key: "googleMapsIntegration" },
            { name: "Booking/Appointment System", key: "bookingAppointmentSystem" }
        ]
    },
    {
        title: "Advanced Features",
        color: "purple",
        items: [
            { name: "Multi-language Support", key: "multiLanguageSupport" },
            { name: "Search Functionality", key: "searchFunctionality" },
            { name: "Image Gallery", key: "imageGallery" },
            { name: "Video Integration", key: "videoIntegration" },
            { name: "Logo Design", key: "logoDesign" }
        ]
    }
];

export const whyAddFeaturesBenefits = [
    {
        title: "Higher Conversions",
        description: "Contact forms and live chat increase lead capture"
    },
    {
        title: "Global Reach",
        description: "Multi-language support expands your audience"
    },
    {
        title: "Better UX",
        description: "Advanced features improve user experience"
    }
];

export const hostingIncludedFeatures = [
    "Unlimited Updates",
    "24/7 Support",
    "SSL Certificate",
    "Daily Backups",
    "Performance Monitoring",
    "Security Updates",
    "Content Updates",
    "SEO Optimization"
];

export const finalCTAGuarantees = [
    { value: "30 Days", label: "Money Back Guarantee" },
    { value: "Free", label: "Consultation" },
    { value: "Unlimited", label: "Updates Included" }
];

export const technologyStack = {
    categories: [
        {
            title: "Development Environments",
            color: "purple",
            skills: [
                {
                    name: "Visual Studio",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg"
                },
                {
                    name: "VS Code",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
                },
                {
                    name: "WebStorm",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webstorm/webstorm-original.svg"
                },
                {
                    name: "Android Studio",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg"
                },
                {
                    name: "Xcode",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xcode/xcode-original.svg"
                },
                {
                    name: "Visual Studio",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg"
                },
                {
                    name: "IntelliJ IDEA",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg"
                },
                {
                    name: "PyCharm",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pycharm/pycharm-original.svg"
                },
                {
                    name: "GoLand",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/goland/goland-original.svg"
                },
                {
                    name: "PhpStorm",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/phpstorm/phpstorm-original.svg"
                }
            ]
        },
        {
            title: "Frameworks & Libraries",
            color: "blue",
            skills: [
                // Frontend Frameworks
                {
                    name: "React",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                },
                {
                    name: "Next.js",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                },
                {
                    name: "Angular",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg"
                },
                {
                    name: "Vue.js",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg"
                },
                {
                    name: "Svelte",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg"
                },
                // Backend Frameworks
                {
                    name: "Express",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg"
                },
                {
                    name: "NestJS",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg"
                },
                {
                    name: "Django",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg"
                },
                {
                    name: "FastAPI",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg"
                },
                {
                    name: "Laravel",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg"
                },
                {
                    name: "Ruby on Rails",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-original-wordmark.svg"
                },
                {
                    name: "ASP.NET",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg"
                },
                // Mobile Frameworks
                {
                    name: "React Native",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                },
                {
                    name: "Flutter",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg"
                },
                // UI Libraries
                {
                    name: "Tailwind CSS",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"
                },
                {
                    name: "Material-UI",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg"
                },
                // State Management
                {
                    name: "Redux",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg"
                },
                // Web3 & Blockchain
                {
                    name: "Web3.js",
                    logo: "https://cdn.simpleicons.org/web3dotjs"
                },
                {
                    name: "Ethers.js",
                    logo: "https://docs.ethers.org/v5/static/logo.svg"
                },
                {
                    name: "Hardhat",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hardhat/hardhat-original.svg"
                },
                // Database ORMs
                {
                    name: "Prisma",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg"
                },
                {
                    name: "Mongoose",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
                },
                // Testing Frameworks
                {
                    name: "Jest",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg"
                },
                {
                    name: "Cypress",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cypressio/cypressio-plain.svg"
                },
                // Build Tools
                {
                    name: "Vite",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg"
                }
            ]
        },
        {
            title: "Programming Languages",
            color: "green",
            skills: [
                // Web Languages
                {
                    name: "JavaScript",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
                },
                {
                    name: "TypeScript",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
                },
                {
                    name: "HTML",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
                },
                {
                    name: "CSS",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
                },
                // Backend & Systems
                {
                    name: "Python",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
                },
                {
                    name: "Java",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
                },
                {
                    name: "C#",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg"
                },
                {
                    name: "PHP",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg"
                },
                {
                    name: "Go",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg"
                },
                {
                    name: "Rust",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg"
                },
                // Mobile Languages
                {
                    name: "Swift",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg"
                },
                {
                    name: "Kotlin",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg"
                },
                {
                    name: "Dart",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg"
                },
                // Crypto
                {
                    name: "Solidity",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg"
                }
            ]
        },
        {
            title: "Database Technologies",
            color: "orange",
            skills: [
                // Relational/SQL Databases
                {
                    name: "MySQL",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
                },
                {
                    name: "PostgreSQL",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
                },
                {
                    name: "SQLite",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg"
                },
                {
                    name: "Oracle",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg"
                },
                {
                    name: "SQL Server",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg"
                },
                {
                    name: "MariaDB",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mariadb/mariadb-original.svg"
                },
                // NoSQL Databases
                {
                    name: "MongoDB",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
                },
                {
                    name: "Cassandra",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachecassandra/apachecassandra-original.svg"
                },
                {
                    name: "Redis",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg"
                },
                {
                    name: "DynamoDB",
                    logo: "https://cdn.simpleicons.org/amazondynamodb"
                },
                {
                    name: "CouchDB",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/couchdb/couchdb-original.svg"
                },
                {
                    name: "Elasticsearch",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-plain.svg"
                },
                {
                    name: "Couchbase",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/couchbase/couchbase-original.svg"
                },
                // Cloud Databases
                {
                    name: "Firebase",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg"
                },
                {
                    name: "Firestore",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg"
                },
                {
                    name: "AWS RDS",
                    logo: "https://cdn.simpleicons.org/amazonrds"
                },
                {
                    name: "Cloud SQL",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg"
                },
                {
                    name: "Azure SQL",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg"
                },
                // Graph & In-Memory Databases
                {
                    name: "Neo4j",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/neo4j/neo4j-original.svg"
                },
                {
                    name: "Memcached",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg"
                },
                // Time Series Databases
                {
                    name: "InfluxDB",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/influxdb/influxdb-original.svg"
                },
                {
                    name: "TimescaleDB",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
                },
                // Query Languages
                {
                    name: "SQL",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
                },
                {
                    name: "GraphQL",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg"
                },
                // Database ORMs & Tools
                {
                    name: "Prisma",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg"
                },
                {
                    name: "TypeORM",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
                }
            ]
        },
        {
            title: "Cloud Platforms",
            color: "sky",
            skills: [
                // Major Cloud Providers
                {
                    name: "AWS",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg"
                },
                {
                    name: "Google Cloud",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg"
                },
                {
                    name: "Microsoft Azure",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg"
                },
                // Cloud Hosting Platforms
                {
                    name: "DigitalOcean",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/digitalocean/digitalocean-original.svg"
                },
                {
                    name: "Linode",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg"
                },
                {
                    name: "Vultr",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg"
                },
                // Platform as a Service (PaaS)
                {
                    name: "Heroku",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original.svg"
                },
                {
                    name: "Vercel",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg"
                },
                {
                    name: "Netlify",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg"
                },
                {
                    name: "Railway",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
                },
                // Backend as a Service (BaaS)
                {
                    name: "Firebase",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg"
                },
                {
                    name: "Supabase",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
                },
                // CDN
                {
                    name: "Cloudflare",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg"
                },
                // Container Orchestration
                {
                    name: "Kubernetes",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg"
                },
                {
                    name: "Docker",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
                },
                // Serverless Platforms
                {
                    name: "AWS Lambda",
                    logo: "https://cdn.simpleicons.org/awslambda"
                }
            ]
        },
        {
            title: "Content Management",
            color: "pink",
            skills: [
                // Traditional CMS
                {
                    name: "WordPress",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg"
                },
                // Website Builders
                {
                    name: "Wix",
                    logo: "https://cdn.simpleicons.org/wix"
                },
                {
                    name: "Webflow",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
                },
                {
                    name: "Squarespace",
                    logo: "https://cdn.simpleicons.org/squarespace"
                },
                // Headless CMS
                {
                    name: "Strapi",
                    logo: "https://cdn.simpleicons.org/strapi"
                },
                {
                    name: "Contentful",
                    logo: "https://cdn.simpleicons.org/contentful"
                },
                {
                    name: "Sanity",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sanity/sanity-original.svg"
                },
                // E-commerce Platforms
                {
                    name: "Shopify",
                    logo: "https://cdn.simpleicons.org/shopify"
                },
                {
                    name: "WooCommerce",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/woocommerce/woocommerce-original.svg"
                },
                // Blogging Platforms
                {
                    name: "Ghost",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ghost/ghost-original.svg"
                },
                {
                    name: "Medium",
                    logo: "https://cdn.simpleicons.org/medium"
                }
            ]
        },
        {
            title: "Digital Marketing",
            color: "yellow",
            skills: [
                // Search Engine Optimization
                {
                    name: "SEO",
                    logo: "https://cdn.simpleicons.org/google"
                },
                {
                    name: "Google Search Console",
                    logo: "https://cdn.simpleicons.org/googlesearchconsole"
                },
                {
                    name: "SEMrush",
                    logo: "https://cdn.simpleicons.org/semrush"
                },

                // Search Engine Marketing
                {
                    name: "Google Ads",
                    logo: "https://cdn.simpleicons.org/googleads"
                },
                // Social Media Advertising
                {
                    name: "Facebook Ads",
                    logo: "https://cdn.simpleicons.org/facebook"
                },
                {
                    name: "Instagram Ads",
                    logo: "https://cdn.simpleicons.org/instagram"
                },
                {
                    name: "LinkedIn Ads",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                },
                {
                    name: "TikTok Ads",
                    logo: "https://cdn.simpleicons.org/tiktok"
                },
                // Analytics & Tracking
                {
                    name: "Google Analytics",
                    logo: "https://cdn.simpleicons.org/googleanalytics"
                },
                {
                    name: "Google Tag Manager",
                    logo: "https://cdn.simpleicons.org/googletagmanager"
                },
                {
                    name: "Facebook Pixel",
                    logo: "https://cdn.simpleicons.org/facebook"
                },
                // Email Marketing
                {
                    name: "Mailchimp",
                    logo: "https://cdn.simpleicons.org/mailchimp"
                },
                // Marketing Automation
                {
                    name: "HubSpot",
                    logo: "https://cdn.simpleicons.org/hubspot"
                },
                // CRM Systems
                {
                    name: "Salesforce",
                    logo: "https://cdn.simpleicons.org/salesforce"
                },
                // Content Creation
                {
                    name: "Canva",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg"
                },

            ]
        }
    ]
};