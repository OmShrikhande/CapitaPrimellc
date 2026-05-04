import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import TimedInquiryPopup from './components/TimedInquiryPopup';
import ScrollToTop from './components/ScrollToTop';
import Hero from './components/Hero';
import Offers from './components/Offers';
import Marquee from './components/Marquee';
import Stats from './components/Stats';
import Properties from './components/Properties';
import Services from './components/Services';
import About from './components/About';
import OwnerSection from './components/OwnerSection';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ListingsPage from './components/ListingsPage';
import AdminPanel from './components/AdminPanel';
import PropertyDetails from './components/PropertyDetails';
import ThemeManager from './components/ThemeManager';
import PaymentConfirmation from './components/PaymentConfirmation';
import { CMSProvider } from './context/CMSContext';
import { ThemeProvider } from './context/ThemeContext';
import { useCMS } from './context/useCMS';
import { getStoredUnlockSession } from './utils/assetUnlockStorage';

function scrollHomeToHash(hash) {
  const raw = String(hash || '').replace(/^#/, '').split('?')[0];
  if (!raw || raw === 'hero') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.getElementById(raw);
  if (el) {
    const navOffset = 96;
    const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function parsePropertyHash(hash) {
  if (!hash.startsWith('#property/')) {
    return { propertyId: null, unlockSession: null };
  }
  const rest = hash.slice('#property/'.length);
  const [idPart, queryPart] = rest.split('?');
  const propertyId = idPart ? decodeURIComponent(idPart) : null;
  let unlockSession = null;
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    unlockSession = params.get('unlock_session') || params.get('session_id');
  }
  return { propertyId, unlockSession };
}

function AppShell() {
  const [loaded, setLoaded] = useState(false);
  const { loading: cmsLoading } = useCMS();
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#listings') return 'listings';
    if (hash === '#asdftyhnmkfdj') return 'admin';
    if (hash.startsWith('#payment-confirmation')) return 'payment-confirmation';
    if (hash.startsWith('#payment-cancelled')) return 'payment-cancelled';
    if (hash.startsWith('#property/')) return 'property';
    return 'home';
  });
  const [propertyId, setPropertyId] = useState(() => {
    const p = parsePropertyHash(window.location.hash);
    return p.propertyId;
  });
  const [unlockSession, setUnlockSession] = useState(() => {
    const p = parsePropertyHash(window.location.hash);
    const fromUrl = p.unlockSession;
    const fromStore = p.propertyId ? getStoredUnlockSession(p.propertyId) : null;
    return fromUrl || fromStore || null;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      let newRoute = 'home';
      if (hash === '#listings') newRoute = 'listings';
      if (hash === '#asdftyhnmkfdj') newRoute = 'admin';
      if (hash.startsWith('#payment-confirmation')) newRoute = 'payment-confirmation';
      if (hash.startsWith('#payment-cancelled')) newRoute = 'payment-cancelled';
      if (hash.startsWith('#property/')) {
        newRoute = 'property';
        const { propertyId: pid, unlockSession: us } = parsePropertyHash(hash);
        const stored = pid ? getStoredUnlockSession(pid) : null;
        setPropertyId(pid);
        setUnlockSession(us || stored || null);
      } else {
        setPropertyId(null);
        setUnlockSession(null);
      }
      setRoute(newRoute);
      document.body.style.overflow = '';

      if (newRoute === 'home') {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => scrollHomeToHash(hash));
        });
      } else {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch((error) => {
        console.warn('Failed to clear stale service workers:', error);
      });
  }, []);

  const isFullyLoaded = loaded && !cmsLoading;

  useEffect(() => {
    if (!isFullyLoaded || route !== 'home') return;
    const hash = window.location.hash;
    const t = window.setTimeout(() => scrollHomeToHash(hash), 400);
    return () => window.clearTimeout(t);
  }, [isFullyLoaded, route]);

  return (
    <div className="bg-void" style={{ minHeight: '100vh' }}>
      <LoadingScreen onDone={() => setLoaded(true)} />
      <div
        className="w-full min-h-screen"
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {route === 'home' ? (
          <div className="flex flex-col gap-10 lg:gap-4">
            <Navbar />
            <TimedInquiryPopup enabled={isFullyLoaded} />
            <div className="pt-20 lg:pt-24">
              <Offers />
            </div>
            <Hero />
            <Marquee />
            <Stats />
            <Properties />
            <Services />
            <About />
            <OwnerSection />
            <Testimonials />
            <Contact />
            <Footer />
          </div>
        ) : route === 'listings' ? (
          <ListingsPage />
        ) : route === 'admin' ? (
          <AdminPanel />
        ) : route === 'property' ? (
          <PropertyDetails key={`${propertyId}:${unlockSession || ''}`} id={propertyId} unlockSession={unlockSession} />
        ) : route === 'payment-confirmation' ? (
          <PaymentConfirmation />
        ) : route === 'payment-cancelled' ? (
          <PaymentConfirmation cancelled />
        ) : null}
      </div>
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CMSProvider>
        <ThemeManager />
        <AppShell />
      </CMSProvider>
    </ThemeProvider>
  );
}

export default App;
