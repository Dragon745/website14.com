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
            console.log(`✅ Preloaded: ${path}`);
        } catch (error) {
            console.warn(`⚠️ Failed to preload ${path}:`, error);
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
            console.log('🚀 All pages preloaded successfully');
        } catch (error) {
            console.warn('⚠️ Some pages failed to preload:', error);
        }
    };

    useEffect(() => {
        // Preload all pages after initial render
        preloadAllPages();
    }, [preloadAllPages]);

    return { preloadPage, preloadAllPages };
}; 