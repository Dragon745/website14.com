const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, orderBy } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

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

async function generateSitemap() {
    try {
        console.log('Generating sitemap...');

        // Static pages
        const staticPages = [
            { url: 'https://website14.com/', priority: '1.0', changefreq: 'weekly' },
            { url: 'https://website14.com/about', priority: '0.8', changefreq: 'monthly' },
            { url: 'https://website14.com/services', priority: '0.9', changefreq: 'monthly' },
            { url: 'https://website14.com/contact', priority: '0.8', changefreq: 'monthly' },
            { url: 'https://website14.com/faq', priority: '0.7', changefreq: 'monthly' },
            { url: 'https://website14.com/builder', priority: '0.9', changefreq: 'monthly' },
            { url: 'https://website14.com/blog', priority: '0.8', changefreq: 'weekly' },
            { url: 'https://website14.com/login', priority: '0.6', changefreq: 'monthly' },
            { url: 'https://website14.com/signup', priority: '0.6', changefreq: 'monthly' }
        ];

        // Fetch published blog posts
        const blogQuery = query(
            collection(db, 'blog'),
            where('status', '==', 'published'),
            orderBy('publishedAt', 'desc')
        );
        const blogSnapshot = await getDocs(blogQuery);
        const blogPosts = blogSnapshot.docs.map(doc => {
            const data = doc.data();
            let lastmod = new Date().toISOString().split('T')[0]; // Default to today

            // Handle Firestore timestamps properly
            if (data.updatedAt) {
                try {
                    lastmod = new Date(data.updatedAt.toDate ? data.updatedAt.toDate() : data.updatedAt).toISOString().split('T')[0];
                } catch (e) {
                    console.warn(`Invalid updatedAt date for blog post ${data.slug}:`, e.message);
                }
            } else if (data.publishedAt) {
                try {
                    lastmod = new Date(data.publishedAt.toDate ? data.publishedAt.toDate() : data.publishedAt).toISOString().split('T')[0];
                } catch (e) {
                    console.warn(`Invalid publishedAt date for blog post ${data.slug}:`, e.message);
                }
            }

            return {
                url: `https://website14.com/blog/${data.slug}`,
                lastmod,
                priority: '0.7',
                changefreq: 'monthly'
            };
        });

        // Generate XML
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Add static pages
        staticPages.forEach(page => {
            xml += `  <url>\n`;
            xml += `    <loc>${page.url}</loc>\n`;
            xml += `    <lastmod>2024-01-01</lastmod>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += `  </url>\n`;
        });

        // Add blog posts
        blogPosts.forEach(post => {
            xml += `  <url>\n`;
            xml += `    <loc>${post.url}</loc>\n`;
            xml += `    <lastmod>${post.lastmod}</lastmod>\n`;
            xml += `    <changefreq>${post.changefreq}</changefreq>\n`;
            xml += `    <priority>${post.priority}</priority>\n`;
            xml += `  </url>\n`;
        });

        xml += '</urlset>';

        // Write to file
        const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
        fs.writeFileSync(sitemapPath, xml);

        console.log(`Sitemap generated successfully!`);
        console.log(`- Static pages: ${staticPages.length}`);
        console.log(`- Blog posts: ${blogPosts.length}`);
        console.log(`- Total URLs: ${staticPages.length + blogPosts.length}`);

    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
}

// Run the script
generateSitemap(); 