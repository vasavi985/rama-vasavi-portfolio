import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Internships from './components/Internships';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const [showLoading, setShowLoading] = useState(true);
  const [isMainReady, setIsMainReady] = useState(false);

  return (
    <>
      {showLoading && (
        <LoadingScreen
          onFadeOut={() => setIsMainReady(true)}
          onFinish={() => setShowLoading(false)}
        />
      )}
      <div className={`portfolio-app ${isMainReady ? 'portfolio-ready' : 'portfolio-entering'}`}>
        <Navbar />
        <main id="main-content">
          <Hero />
          <Internships />
          <About />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
      <Analytics />
    </>
  );
}
