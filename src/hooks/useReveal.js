import { useEffect, useRef } from 'react';

const useReveal = (className = 'animate-on-scroll', threshold = 0.12) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view');
          observer.disconnect();
        }
      },
      { threshold }
    );

    el.classList.add(className);
    observer.observe(el);
    return () => observer.disconnect();
  }, [className, threshold]);

  return ref;
};

export default useReveal;
