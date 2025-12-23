import { useState, useEffect, useRef } from 'react';

/**
 * AnimatedCounter Component
 * 
 * Animates a number from 0 to the target value when it comes into view.
 * Supports different formats: numbers, percentages, and text suffixes.
 * 
 * @param {number} target - The target number to count to
 * @param {number} duration - Animation duration in milliseconds (default: 2000)
 * @param {string} suffix - Optional suffix (e.g., '+', '%', ' Days')
 * @param {string} prefix - Optional prefix (e.g., '$')
 * @param {number} decimals - Number of decimal places (default: 0)
 * @param {string} className - Additional CSS classes
 */
export default function AnimatedCounter({ 
  target, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  decimals = 0,
  className = ''
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const counterRef = useRef(null);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setShouldAnimate(true);
            setHasAnimated(true);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before fully visible
      }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!shouldAnimate) {
      // If reduced motion is preferred, just set the final value
      if (prefersReducedMotion) {
        setCount(target);
        return;
      }
      return;
    }

    // If reduced motion is preferred, set final value immediately
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }

    // Reset for animation
    setCount(0);
    startTimeRef.current = null;

    const animate = (currentTime) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = easeOut * target;

      setCount(currentCount);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure we end exactly at the target
        setCount(target);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [shouldAnimate, target, duration, prefersReducedMotion]);

  // Format the number with decimals
  const formatNumber = (num) => {
    return num.toFixed(decimals);
  };

  return (
    <div ref={counterRef} className={className}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </div>
  );
}

