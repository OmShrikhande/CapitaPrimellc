import { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 50) { // Show very early for testing
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Show immediately for testing
    setIsVisible(true);

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
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 w-20 h-20 rounded-full group"
      aria-label="Scroll to top"
    >
      <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-gold/10 via-gold/5 to-transparent rounded-full animate-pulse"></div>
      <div className="absolute inset-2 w-16 h-16 bg-gold/15 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute inset-4 w-12 h-12 bg-gold hover:bg-gold/80 text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gold/60 flex items-center justify-center">
        <span className="text-xl font-bold leading-none transform group-hover:-translate-y-0.5 transition-transform duration-300 select-none">↑</span>
      </div>
    </button>
  );
};

export default ScrollToTop;