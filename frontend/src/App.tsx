import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ParticleBackground } from './components/layout/ParticleBackground';
import { Header } from './components/layout/Header';
import { SettingsModal } from './components/layout/SettingsModal';
import { HomePage } from './pages/HomePage';
import { SessionPage } from './pages/SessionPage';

export default function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <HashRouter>
      <div
        className="min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #06061a 0%, #0d0d2b 50%, #12123a 100%)',
        }}
      >
        <ParticleBackground />

        <div className="relative z-10">
          <Header onSettingsClick={() => setShowSettings(true)} />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/session/:sessionId" element={<SessionPage />} />
          </Routes>
        </div>

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#12123a',
              color: '#e2e8f0',
              border: '1px solid #1e1e5a',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#7c3aed', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </div>
    </HashRouter>
  );
}
