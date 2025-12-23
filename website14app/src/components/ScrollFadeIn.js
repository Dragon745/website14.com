import { useEffect, useRef, useState } from 'react';

/**
 * ScrollFadeIn Component
 * 
 * Fades in content when it scrolls into view using Intersection Observer.
 * Respects prefers-reduced-motion for accessibility.
 * 
 * @param {React.ReactNode} children - Content to fade in
 * @param {string} className - Additional CSS classes
 * @param {number} delay - Animation delay in milliseconds (default: 0)
 * @param {string} direction - Animation direction: 'up', 'down', 'left', 'right' (default: 'up')
 */
export default function ScrollFadeIn({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up'
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay]);

  const directionClasses = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8'
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 translate-x-0' 
          : `opacity-0 ${directionClasses[direction]}`
      } ${className}`}
    >
      {children}
    </div>
  );
}

