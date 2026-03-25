import { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) { // Show earlier
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full animate-pulse"></div>
      <button
        onClick={scrollToTop}
        className="relative w-12 h-12 bg-primary hover:bg-primary/80 text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group border-2 border-primary/50"
        aria-label="Scroll to top"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="transform group-hover:-translate-y-1 transition-transform duration-300"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </div>
  );
};

export default ScrollToTop;