import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('');

    useEffect(() => {
        loadBlogPosts();
    }, []);

    const loadBlogPosts = async () => {
        try {
            const blogQuery = query(
                collection(db, 'blog'),
                where('status', '==', 'published'),
                orderBy('publishedAt', 'desc')
            );
            const blogSnapshot = await getDocs(blogQuery);
            const postsData = blogSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postsData);
        } catch (error) {
            console.error('Error loading blog posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
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
        return Array.from(tags);
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));
        return matchesSearch && matchesTag;
    });

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading blog posts...</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Insights, tips, and updates from our web development team
                        </p>
                    </div>

                    {/* Search and Filter */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search posts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="sm:w-48">
                                <select
                                    value={selectedTag}
                                    onChange={(e) => setSelectedTag(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Tags</option>
                                    {getAllTags().map(tag => (
                                        <option key={tag} value={tag}>{tag}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Posts Grid */}
                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post) => (
                                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-center text-sm text-gray-500 mb-3">
                                            <time dateTime={post.publishedAt}>
                                                {formatDate(post.publishedAt)}
                                            </time>
                                            {post.tags && post.tags.length > 0 && (
                                                <span className="mx-2">•</span>
                                            )}
                                            {post.tags && post.tags.slice(0, 2).map((tag, index) => (
                                                <span key={tag} className="text-blue-600">
                                                    {tag}{index < Math.min(post.tags.length - 1, 1) ? ', ' : ''}
                                                </span>
                                            ))}
                                        </div>

                                        <h2 className="text-xl font-bold text-gray-900 mb-3">
                                            <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                                                {post.title}
                                            </Link>
                                        </h2>

                                        {post.excerpt && (
                                            <p className="text-gray-600 mb-4">
                                                {truncateText(post.excerpt, 150)}
                                            </p>
                                        )}

                                        <div className="flex justify-between items-center">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                Read more →
                                            </Link>
                                            {post.tags && post.tags.length > 2 && (
                                                <span className="text-sm text-gray-500">
                                                    +{post.tags.length - 2} more tags
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                            <p className="text-gray-600">
                                {searchTerm || selectedTag
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'No blog posts have been published yet.'
                                }
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredPosts.length > 0 && (
                        <div className="mt-12 text-center">
                            <p className="text-gray-600">
                                Showing {filteredPosts.length} of {posts.length} posts
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
} 