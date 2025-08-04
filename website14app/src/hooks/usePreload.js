import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export const usePreload = () => {
    const router = useRouter();
    const preloadedPages = useRef(new Set());

    const preloadPage = async (path) => {
        if (preloadedPages.current.has(path)) {
            return; // Already preloaded
        }

        try {
            await router.prefetch(path);
            preloadedPages.current.add(path);
        } catch (error) {
            // Silent fallback
        }
    };

    const preloadAllPages = async () => {
        const pages = [
            '/',
            '/services',
            '/about',
            '/faq',
            '/contact',
            '/login',
            '/signup',
            '/builder',
            '/blog'
        ];

        try {
            await Promise.all(pages.map(page => preloadPage(page)));
        } catch (error) {
            // Silent fallback
        }
    };

    // Preload specific blog posts when blog page is visited
    const preloadBlogPosts = async (blogPosts) => {
        if (!blogPosts || blogPosts.length === 0) return;

        try {
            // Preload first 3 blog posts for better UX
            const postsToPreload = blogPosts.slice(0, 3);
            await Promise.all(
                postsToPreload.map(post =>
                    preloadPage(`/blog/${post.slug}`)
                )
            );
        } catch (error) {
            // Silent fallback
        }
    };

    useEffect(() => {
        // Preload all pages after initial render
        preloadAllPages();
    }, [preloadAllPages]);

    return { preloadPage, preloadAllPages, preloadBlogPosts };
}; 