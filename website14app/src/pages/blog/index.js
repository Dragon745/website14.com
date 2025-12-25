import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { organizationSchema } from '../../data/seoData';
import { usePreload } from '../../hooks/usePreload';
import BlogHero from '../../components/blog/BlogHero';
import BlogCard from '../../components/blog/BlogCard';
import NewsletterCTA from '../../components/blog/NewsletterCTA';

// ... getStaticProps remains the same ...
// This function runs at build time to get all blog posts
export async function getStaticProps() {
    try {
        const blogQuery = query(
            collection(db, 'blog'),
            where('status', '==', 'published'),
            orderBy('publishedAt', 'desc')
        );
        const blogSnapshot = await getDocs(blogQuery);
        const postsData = blogSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                publishedAt: data.publishedAt?.toDate?.()?.toISOString() || data.publishedAt,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
            };
        });

        return {
            props: {
                posts: postsData
            }
        };
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return {
            props: {
                posts: []
            }
        };
    }
}

export default function Blog({ posts }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const { preloadBlogPosts } = usePreload();

    // Preload blog posts when component mounts
    useEffect(() => {
        if (posts && posts.length > 0) {
            preloadBlogPosts(posts);
        }
    }, [posts, preloadBlogPosts]);

    const formatDate = (date) => {
        // Handle both ISO strings and Date objects
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getAllTags = () => {
        const tags = new Set();
        posts.forEach(post => {
            if (post.tags) {
                post.tags.forEach(tag => tags.add(tag));
            }
        });
        return Array.from(tags).sort();
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));
        return matchesSearch && matchesTag;
    });

    const structuredData = [
        organizationSchema,
        {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Website14 Blog",
            "description": "Insights, tips, and updates from our web development team",
            "url": "https://website14.com/blog",
            "publisher": {
                "@id": "https://website14.com/#organization"
            },
            "blogPost": posts.slice(0, 5).map(post => ({
                "@type": "BlogPosting",
                "headline": post.title,
                "description": post.excerpt,
                "datePublished": post.publishedAt,
                "url": `https://website14.com/blog/${post.slug}`,
                "author": {
                    "@type": "Organization",
                    "name": "Website14 Team"
                }
            }))
        }
    ];

    return (
        <>
            <SEO
                title="Blog | Website14"
                description="Insights, tips, and updates from our web development team"
                keywords="web development, blog, tips, insights, website14"
                url="https://website14.com/blog"
                type="website"
                structuredData={structuredData}
            />

            <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
                <Header />

                <main className="flex-1">
                    <BlogHero
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedTag={selectedTag}
                        setSelectedTag={setSelectedTag}
                        allTags={getAllTags()}
                    />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        {filteredPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredPosts.map((post) => (
                                    <BlogCard key={post.id} post={post} formatDate={formatDate} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                <div className="text-slate-300 mb-6">
                                    <svg className="mx-auto h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">No articles found</h3>
                                <p className="text-slate-500 max-w-md mx-auto">
                                    We couldn't find any articles matching your search criteria. Try adjusting keywords or filters.
                                </p>
                            </div>
                        )}

                        {/* Pagination placeholder if needed in future */}
                        {filteredPosts.length > 0 && (
                            <div className="mt-16 text-center">
                                <p className="text-sm text-slate-500">
                                    Showing {filteredPosts.length} of {posts.length} articles
                                </p>
                            </div>
                        )}
                    </div>

                    <NewsletterCTA />
                </main>

                <Footer />
            </div>
        </>
    );
} 