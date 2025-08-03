const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, orderBy } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Blog post template
const generateBlogPostHTML = (post) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatReadingTime = (content) => {
        const wordsPerMinute = 200;
        const wordCount = content.split(' ').length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return readingTime;
    };

    const renderContent = (content) => {
        return content
            .split('\n')
            .map(line => {
                if (line.startsWith('# ')) {
                    return `<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-4">${line.substring(2)}</h1>`;
                }
                if (line.startsWith('## ')) {
                    return `<h2 class="text-2xl font-bold text-gray-900 mt-6 mb-3">${line.substring(3)}</h2>`;
                }
                if (line.startsWith('### ')) {
                    return `<h3 class="text-xl font-bold text-gray-900 mt-4 mb-2">${line.substring(4)}</h3>`;
                }
                if (line.startsWith('**') && line.endsWith('**')) {
                    return `<p class="text-gray-700 mb-4"><strong>${line.substring(2, line.length - 2)}</strong></p>`;
                }
                if (line.startsWith('*') && line.endsWith('*')) {
                    return `<p class="text-gray-700 mb-4 italic">${line.substring(1, line.length - 1)}</p>`;
                }
                if (line.trim() === '') {
                    return '<br>';
                }
                return `<p class="text-gray-700 mb-4">${line}</p>`;
            }).join('');
    };

    const tagsHTML = post.tags && post.tags.length > 0
        ? post.tags.map(tag => `<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">${tag}</span>`).join('')
        : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.seo?.metaTitle || post.title} | Website14</title>
    <meta name="description" content="${post.seo?.metaDescription || post.excerpt}">
    <meta name="keywords" content="${post.seo?.keywords || post.tags?.join(', ') || ''}">
    <meta property="og:title" content="${post.seo?.metaTitle || post.title}">
    <meta property="og:description" content="${post.seo?.metaDescription || post.excerpt}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://website14.com/blog/${post.slug}">
    <meta property="article:published_time" content="${post.publishedAt}">
    <meta property="article:author" content="Website14 Team">
    <link rel="canonical" href="https://website14.com/blog/${post.slug}">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-6">
                <div class="flex items-center">
                    <a href="/" class="text-2xl font-bold text-gray-900">Website14</a>
                </div>
                <nav class="hidden md:flex space-x-8">
                    <a href="/" class="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
                    <a href="/services" class="text-gray-600 hover:text-gray-900 transition-colors">Services</a>
                    <a href="/blog" class="text-gray-600 hover:text-gray-900 transition-colors">Blog</a>
                    <a href="/about" class="text-gray-600 hover:text-gray-900 transition-colors">About</a>
                    <a href="/contact" class="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
                </nav>
            </div>
        </div>
    </header>

    <main class="min-h-screen">
        <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- Breadcrumb -->
            <nav class="mb-8">
                <a href="/blog" class="text-blue-600 hover:text-blue-800">← Back to Blog</a>
            </nav>

            <!-- Article Header -->
            <header class="mb-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">${post.title}</h1>
                <div class="flex items-center text-gray-600 mb-4">
                    <span>${formatDate(post.publishedAt)}</span>
                    <span class="mx-2">•</span>
                    <span>${formatReadingTime(post.content)} min read</span>
                </div>
                ${tagsHTML ? `<div class="flex flex-wrap gap-2">${tagsHTML}</div>` : ''}
            </header>

            <!-- Article Content -->
            <div class="prose prose-lg max-w-none">
                ${renderContent(post.content)}
            </div>
        </article>
    </main>

    <footer class="bg-gray-800 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-lg font-semibold mb-4">Website14</h3>
                    <p class="text-gray-300">Professional web development services with unlimited updates.</p>
                </div>
                <div>
                    <h4 class="text-md font-semibold mb-4">Services</h4>
                    <ul class="space-y-2 text-gray-300">
                        <li><a href="/services" class="hover:text-white">Web Development</a></li>
                        <li><a href="/services" class="hover:text-white">E-commerce</a></li>
                        <li><a href="/services" class="hover:text-white">Maintenance</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-md font-semibold mb-4">Company</h4>
                    <ul class="space-y-2 text-gray-300">
                        <li><a href="/about" class="hover:text-white">About Us</a></li>
                        <li><a href="/contact" class="hover:text-white">Contact</a></li>
                        <li><a href="/blog" class="hover:text-white">Blog</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-md font-semibold mb-4">Contact</h4>
                    <p class="text-gray-300">Get in touch for your next project.</p>
                    <a href="/contact" class="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Get Quote</a>
                </div>
            </div>
            <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
                <p>&copy; 2024 Website14. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;
};

async function generateBlogPages() {
    try {
        console.log('Fetching blog posts from Firestore...');

        // Fetch all published blog posts
        const blogQuery = query(
            collection(db, 'blog'),
            where('status', '==', 'published'),
            orderBy('publishedAt', 'desc')
        );
        const blogSnapshot = await getDocs(blogQuery);

        if (blogSnapshot.empty) {
            console.log('No published blog posts found.');
            return;
        }

        const posts = blogSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`Found ${posts.length} published blog posts.`);

        // Create blog directory if it doesn't exist
        const blogDir = path.join(process.cwd(), 'out', 'blog');
        if (!fs.existsSync(blogDir)) {
            fs.mkdirSync(blogDir, { recursive: true });
        }

        // Generate HTML file for each blog post
        for (const post of posts) {
            const html = generateBlogPostHTML(post);
            const filePath = path.join(blogDir, `${post.slug}.html`);

            fs.writeFileSync(filePath, html);
            console.log(`Generated: /blog/${post.slug}.html`);
        }

        console.log('Blog pages generation completed!');
    } catch (error) {
        console.error('Error generating blog pages:', error);
        process.exit(1);
    }
}

generateBlogPages(); 