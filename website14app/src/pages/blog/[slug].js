import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import SEO from '../../components/SEO';
import { organizationSchema } from '../../data/seoData';

// This function runs at build time to generate all possible blog post paths
export async function getStaticPaths() {
    try {
        // Fetch all published blog posts from Firestore
        const blogQuery = query(
            collection(db, 'blog'),
            where('status', '==', 'published'),
            orderBy('publishedAt', 'desc')
        );
        const blogSnapshot = await getDocs(blogQuery);

        // Generate paths for each blog post
        const paths = blogSnapshot.docs.map(doc => ({
            params: { slug: doc.data().slug }
        }));

        return {
            paths,
            fallback: false // Return 404 for any paths not generated
        };
    } catch (error) {
        console.error('Error generating static paths:', error);
        return {
            paths: [],
            fallback: false
        };
    }
}

// This function runs at build time to get data for each blog post
export async function getStaticProps({ params }) {
    try {
        // Fetch the specific blog post by slug
        const blogQuery = query(
            collection(db, 'blog'),
            where('slug', '==', params.slug),
            where('status', '==', 'published')
        );
        const blogSnapshot = await getDocs(blogQuery);

        if (blogSnapshot.empty) {
            return {
                notFound: true
            };
        }

        const rawPostData = blogSnapshot.docs[0].data();

        // Convert Firestore timestamps to serializable dates
        const postData = {
            id: blogSnapshot.docs[0].id,
            ...rawPostData,
            publishedAt: rawPostData.publishedAt?.toDate?.()?.toISOString() || rawPostData.publishedAt,
            createdAt: rawPostData.createdAt?.toDate?.()?.toISOString() || rawPostData.createdAt,
            updatedAt: rawPostData.updatedAt?.toDate?.()?.toISOString() || rawPostData.updatedAt
        };

        // Fetch related posts
        const relatedQuery = query(
            collection(db, 'blog'),
            where('status', '==', 'published'),
            orderBy('publishedAt', 'desc'),
            limit(3)
        );
        const relatedSnapshot = await getDocs(relatedQuery);
        const relatedPosts = relatedSnapshot.docs
            .map(doc => {
                const rawData = doc.data();
                return {
                    id: doc.id,
                    ...rawData,
                    publishedAt: rawData.publishedAt?.toDate?.()?.toISOString() || rawData.publishedAt,
                    createdAt: rawData.createdAt?.toDate?.()?.toISOString() || rawData.createdAt,
                    updatedAt: rawData.updatedAt?.toDate?.()?.toISOString() || rawData.updatedAt
                };
            })
            .filter(p => p.id !== postData.id);

        return {
            props: {
                post: postData,
                relatedPosts
            }
        };
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return {
            notFound: true
        };
    }
}

export default function BlogPost({ post, relatedPosts }) {
    const formatDate = (date) => {
        // Handle both ISO strings and Date objects
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('en-US', {
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
        // Enhanced markdown rendering
        const lines = content.split('\n');
        const elements = [];
        let inCodeBlock = false;
        let codeBlockContent = [];
        let inOrderedList = false;
        let inUnorderedList = false;
        let listItems = [];

        lines.forEach((line, index) => {
            // Handle code blocks
            if (line.startsWith('```')) {
                // Close any open lists before code block
                if (inOrderedList) {
                    elements.push(
                        <ol key={`ol-${index}`} className="list-decimal list-inside mb-4">
                            {listItems.map((item, i) => <li key={i} className="text-gray-700 mb-2">{item}</li>)}
                        </ol>
                    );
                    listItems = [];
                    inOrderedList = false;
                }
                if (inUnorderedList) {
                    elements.push(
                        <ul key={`ul-${index}`} className="list-disc list-inside mb-4">
                            {listItems.map((item, i) => <li key={i} className="text-gray-700 mb-2">{item}</li>)}
                        </ul>
                    );
                    listItems = [];
                    inUnorderedList = false;
                }

                if (inCodeBlock) {
                    // End code block
                    elements.push(
                        <pre key={`code-${index}`} className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                            <code className="text-sm text-gray-800">
                                {codeBlockContent.join('\n')}
                            </code>
                        </pre>
                    );
                    codeBlockContent = [];
                    inCodeBlock = false;
                } else {
                    // Start code block
                    inCodeBlock = true;
                }
                return;
            }

            if (inCodeBlock) {
                codeBlockContent.push(line);
                return;
            }

            // Handle headers
            if (line.startsWith('# ')) {
                closeLists();
                elements.push(<h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{line.substring(2)}</h1>);
                return;
            }
            if (line.startsWith('## ')) {
                closeLists();
                elements.push(<h2 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{line.substring(3)}</h2>);
                return;
            }
            if (line.startsWith('### ')) {
                closeLists();
                elements.push(<h3 key={index} className="text-xl font-bold text-gray-900 mt-4 mb-2">{line.substring(4)}</h3>);
                return;
            }
            if (line.startsWith('#### ')) {
                closeLists();
                elements.push(<h4 key={index} className="text-lg font-bold text-gray-900 mt-3 mb-2">{line.substring(5)}</h4>);
                return;
            }

            // Handle ordered lists
            if (line.match(/^\d+\.\s/)) {
                if (!inOrderedList) {
                    closeLists();
                    inOrderedList = true;
                }
                listItems.push(formatInlineMarkdown(line.replace(/^\d+\.\s/, '')));
                return;
            }

            // Handle unordered lists
            if (line.startsWith('- ') || line.startsWith('* ')) {
                if (!inUnorderedList) {
                    closeLists();
                    inUnorderedList = true;
                }
                listItems.push(formatInlineMarkdown(line.substring(2)));
                return;
            }

            // Handle blockquotes
            if (line.startsWith('> ')) {
                closeLists();
                elements.push(
                    <blockquote key={index} className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4">
                        {formatInlineMarkdown(line.substring(2))}
                    </blockquote>
                );
                return;
            }

            // Handle horizontal rules
            if (line.match(/^[-*_]{3,}$/)) {
                closeLists();
                elements.push(<hr key={index} className="my-6 border-gray-300" />);
                return;
            }

            // Handle empty lines
            if (line.trim() === '') {
                closeLists();
                elements.push(<br key={index} />);
                return;
            }

            // Handle inline formatting and regular paragraphs
            closeLists();
            const formattedLine = formatInlineMarkdown(line);
            elements.push(<p key={index} className="text-gray-700 mb-4">{formattedLine}</p>);
        });

        // Close any remaining lists
        closeLists();

        function closeLists() {
            if (inOrderedList) {
                elements.push(
                    <ol key={`ol-${Date.now()}`} className="list-decimal list-inside mb-4">
                        {listItems.map((item, i) => <li key={i} className="text-gray-700 mb-2">{item}</li>)}
                    </ol>
                );
                listItems = [];
                inOrderedList = false;
            }
            if (inUnorderedList) {
                elements.push(
                    <ul key={`ul-${Date.now()}`} className="list-disc list-inside mb-4">
                        {listItems.map((item, i) => <li key={i} className="text-gray-700 mb-2">{item}</li>)}
                    </ul>
                );
                listItems = [];
                inUnorderedList = false;
            }
        }

        return elements;
    };

    const formatInlineMarkdown = (text) => {
        // Handle bold (**text** or __text__)
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');

        // Handle italic (*text* or _text_)
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        text = text.replace(/_(.*?)_/g, '<em>$1</em>');

        // Handle inline code (`code`)
        text = text.replace(/`(.*?)`/g, '<code className="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>');

        // Handle links [text](url)
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');

        // Convert to JSX elements
        const parts = text.split(/(<[^>]+>.*?<\/[^>]+>)/);
        return parts.map((part, i) => {
            if (part.startsWith('<strong>')) {
                const content = part.replace(/<\/?strong>/g, '');
                return <strong key={i}>{content}</strong>;
            }
            if (part.startsWith('<em>')) {
                const content = part.replace(/<\/?em>/g, '');
                return <em key={i}>{content}</em>;
            }
            if (part.startsWith('<code')) {
                const content = part.replace(/<\/?code[^>]*>/g, '');
                return <code key={i} className="bg-gray-100 px-1 py-0.5 rounded text-sm">{content}</code>;
            }
            if (part.startsWith('<a')) {
                const match = part.match(/href="([^"]+)"[^>]*>([^<]+)<\/a>/);
                if (match) {
                    return <a key={i} href={match[1]} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">{match[2]}</a>;
                }
            }
            return part;
        });
    };

    if (!post) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
                            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
                            <Link href="/blog" className="text-blue-600 hover:text-blue-800">
                                ← Back to Blog
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const structuredData = [
        organizationSchema,
        {
            "@context": "https://schema.org",
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
                    "name": "Blog",
                    "item": "https://website14.com/blog"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": post.title,
                    "item": `https://website14.com/blog/${post.slug}`
                }
            ]
        },
        {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.seo?.metaDescription || post.excerpt,
            "datePublished": post.publishedAt,
            "dateModified": post.updatedAt || post.publishedAt,
            "author": {
                "@type": "Organization",
                "name": "Website14 Team",
                "url": "https://website14.com"
            },
            "publisher": {
                "@id": "https://website14.com/#organization"
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://website14.com/blog/${post.slug}`
            },
            "image": post.coverImage || "https://website14.com/og-image.jpg",
            "keywords": post.seo?.keywords || post.tags?.join(', ')
        }
    ];

    return (
        <>
            <SEO
                title={post.seo?.metaTitle || post.title + " | Website14"}
                description={post.seo?.metaDescription || post.excerpt}
                keywords={post.seo?.keywords || post.tags?.join(', ')}
                url={`https://website14.com/blog/${post.slug}`}
                type="article"
                structuredData={structuredData}
                image={post.coverImage || "https://website14.com/og-image.jpg"}
            />

            <Header />
            <div className="min-h-screen bg-gray-50">
                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Breadcrumb */}
                    <nav className="mb-8">
                        <Link href="/blog" prefetch={true} className="text-blue-600 hover:text-blue-800">
                            ← Back to Blog
                        </Link>
                    </nav>

                    {/* Article Header */}
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                        <div className="flex items-center text-gray-600 mb-4">
                            <span>{formatDate(post.publishedAt)}</span>
                            <span className="mx-2">•</span>
                            <span>{formatReadingTime(post.content)} min read</span>
                        </div>
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* Article Content */}
                    <div className="prose prose-lg max-w-none">
                        {renderContent(post.content)}
                    </div>

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <section className="mt-12 pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedPosts.map(relatedPost => (
                                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} prefetch={true} className="block group">
                                        <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                                    {relatedPost.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-3">
                                                    {relatedPost.excerpt}
                                                </p>
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    <span>{formatDate(relatedPost.publishedAt)}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{formatReadingTime(relatedPost.content)} min read</span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </article>
            </div>
            <Footer />
        </>
    );
} 