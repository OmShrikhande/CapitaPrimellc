import { useState, useEffect, useRef } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Stats from './components/Stats';
import Properties from './components/Properties';
import Services from './components/Services';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [loaded, setLoaded] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!loaded) return;

    const setup = () => {
      observerRef.current?.disconnect();

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.07, rootMargin: '0px 0px -20px 0px' }
      );

      observerRef.current = obs;

      const SELECTORS = '.animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right';
      document.querySelectorAll(SELECTORS).forEach((el) => obs.observe(el));
    };

    const timer = setTimeout(setup, 120);
    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [loaded]);

  return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <LoadingScreen onDone={() => setLoaded(true)} />
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <Navbar />
        <Hero />
        <Marquee />
        <Stats />
        <Properties />
        <Services />
        <About />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

export default App;
