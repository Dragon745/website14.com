import { useState, useEffect } from 'react';

export default function PreloadStatus() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show in development mode
        if (process.env.NODE_ENV === 'development') {
            setIsVisible(true);

            // Hide after 3 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm">
            <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Pages preloaded</span>
            </div>
        </div>
    );
} 