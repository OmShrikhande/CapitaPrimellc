import { useState, useEffect, useRef } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Offers from './components/Offers';
import Marquee from './components/Marquee';
import Stats from './components/Stats';
import Properties from './components/Properties';
import Services from './components/Services';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ListingsPage from './components/ListingsPage';
import AdminPanel from './components/AdminPanel';

import PropertyDetails from './components/PropertyDetails';
import ThemeManager from './components/ThemeManager';

import { CMSProvider } from './context/CMSContext';
import { ThemeProvider } from './context/ThemeContext';
import { useCMS } from './context/useCMS';

function AppContent() {
  const [loaded, setLoaded] = useState(false);
  const { loading: cmsLoading } = useCMS();
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#listings') return 'listings';
    if (hash === '#asdftyhnmkfdj') return 'admin';
    if (hash.startsWith('#property/')) return 'property';
    return 'home';
  });
  const [propertyId, setPropertyId] = useState(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#property/')) return hash.split('/')[1];
    return null;
  });
  const observerRef = useRef(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      let newRoute = 'home';
      if (hash === '#listings') newRoute = 'listings';
      if (hash === '#asdftyhnmkfdj') newRoute = 'admin';
      if (hash.startsWith('#property/')) {
        newRoute = 'property';
        setPropertyId(hash.split('/')[1]);
      }
      setRoute(newRoute);
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
  }, [loaded, route]);

  const isFullyLoaded = loaded && !cmsLoading;

  return (
    <div className="bg-void" style={{ minHeight: '100vh' }}>
      <LoadingScreen onDone={() => setLoaded(true)} />
      <div
        className="w-full min-h-screen"
        style={{
          opacity: isFullyLoaded ? 1 : 0,
          transition: 'opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          pointerEvents: isFullyLoaded ? 'auto' : 'none'
        }}
      >
        {route === 'home' ? (
          <div className="flex flex-col gap-10 lg:gap-4">
            <Navbar />
            <Hero />
            <Offers />
            <Marquee />
            <Stats />
            <Properties />
            <Services />
            <About />
            <Testimonials />
            <Contact />
            <Footer />
          </div>
        ) : route === 'listings' ? (
          <ListingsPage />
        ) : route === 'admin' ? (
          <AdminPanel />
        ) : route === 'property' ? (
          <PropertyDetails key={propertyId} id={propertyId} />
        ) : null}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CMSProvider>
        <ThemeManager />
        <AppContent />
      </CMSProvider>
    </ThemeProvider>
  );
}

export default App;
