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
import ListingsPage from './components/ListingsPage';

function App() {
  const [loaded, setLoaded] = useState(false);
  const [route, setRoute] = useState(window.location.hash === '#listings' ? 'listings' : 'home');
  const observerRef = useRef(null);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash === '#listings' ? 'listings' : 'home');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!loaded || route !== 'home') return;

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
        {route === 'home' ? (
          <div className="flex flex-col gap-16 lg:gap-24">
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
        ) : (
          <ListingsPage />
        )}
      </div>
    </div>
  );
}

export default App;
