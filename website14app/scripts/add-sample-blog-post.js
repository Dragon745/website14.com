const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBbmGZ_MfS8Dgj6Rt58u1l7Oa7653HBVg4",
    authDomain: "website14-fb82e.firebaseapp.com",
    projectId: "website14-fb82e",
    storageBucket: "website14-fb82e.firebasestorage.app",
    messagingSenderId: "632727286029",
    appId: "1:632727286029:web:4a773a22d589fc34680044"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addSampleBlogPost() {
    try {
        console.log('Adding sample blog post...');

        const samplePost = {
            title: 'Welcome to Our Blog: Web Development Insights',
            content: `# Welcome to Our Blog

We're excited to launch our new blog where we'll share insights, tips, and updates from our web development team.

## What You'll Find Here

Our blog will cover various topics including:

- **Web Development Best Practices** - Tips and tricks for building better websites
- **Technology Updates** - Latest trends in web development and design
- **Case Studies** - Real examples of our work and the results we achieve
- **Industry Insights** - Analysis of the web development landscape

## Why We Started This Blog

As a web development agency, we believe in sharing knowledge and helping businesses understand the digital landscape. This blog is our way of contributing to the community while showcasing our expertise.

## What's Coming Next

Stay tuned for regular updates covering:

- SEO optimization techniques
- Performance optimization strategies
- Design trends and best practices
- Client success stories
- Technical tutorials and guides

We're committed to providing valuable, actionable content that helps businesses succeed online.`,
            excerpt: 'Welcome to our new blog where we share web development insights, tips, and industry updates.',
            tags: ['web development', 'blog', 'welcome', 'insights'],
            slug: 'welcome-to-our-blog',
            status: 'published',
            publishedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            seo: {
                metaTitle: 'Welcome to Our Blog - Web Development Insights | Website14',
                metaDescription: 'Welcome to our new blog where we share web development insights, tips, and industry updates.',
                keywords: 'web development, blog, insights, tips, industry updates'
            }
        };

        const docRef = await addDoc(collection(db, 'blog'), samplePost);
        console.log('Sample blog post added successfully with ID:', docRef.id);
        console.log('You can now view it at: https://website14.com/blog/welcome-to-our-blog');

    } catch (error) {
        console.error('Error adding sample blog post:', error);
        process.exit(1);
    }
}

// Run the script
addSampleBlogPost(); 