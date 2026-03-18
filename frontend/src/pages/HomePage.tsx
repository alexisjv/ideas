import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Plus, ArrowRight, Users, Lightbulb, Sparkles, Key } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SettingsModal } from '../components/layout/SettingsModal';
import toast from 'react-hot-toast';

export function HomePage() {
  const [sessionName, setSessionName] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const { createSession, settings } = useAppStore();
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!sessionName.trim()) {
      toast.error('Dale un nombre a tu sesión');
      return;
    }
    if (!settings.apiKey) {
      toast('Necesitás configurar tu API Key primero', { icon: '🔑' });
      setShowSettings(true);
      return;
    }
    const session = createSession(sessionName.trim());
    navigate(`/session/${session.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate();
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-2xl"
        >
          {/* Logo */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-gradient shadow-2xl shadow-forge-primary/30 mb-6"
          >
            <Zap size={40} className="text-white" />
          </motion.div>

          <h1 className="text-5xl sm:text-6xl font-black text-forge-text mb-4 leading-none">
            Idea<span className="text-transparent bg-clip-text bg-primary-gradient">Forge</span>
          </h1>
          <p className="text-xl text-forge-text-muted mb-2">
            Donde las chispas se convierten en ventures
          </p>
          <p className="text-sm text-forge-muted max-w-lg mx-auto leading-relaxed">
            Cargá ideas en grupo (por texto o voz), y nuestra IA con Claude Opus las
            analiza y genera un plan de negocio completo listo para lanzar.
          </p>
        </motion.div>

        {/* Features strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {[
            { icon: <Users size={14} />, label: 'Sesiones grupales' },
            { icon: <Lightbulb size={14} />, label: 'Texto y voz' },
            { icon: <Sparkles size={14} />, label: 'IA con Claude Opus' },
            { icon: <Zap size={14} />, label: 'Plan de negocio completo' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-forge-surface border border-forge-border text-sm text-forge-text-muted"
            >
              <span className="text-forge-primary">{icon}</span>
              {label}
            </div>
          ))}
        </motion.div>

        {/* Create session card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-md bg-forge-card border border-forge-border rounded-2xl p-6 shadow-2xl shadow-black/20"
        >
          <h2 className="text-lg font-semibold text-forge-text mb-1">
            Nueva sesión de brainstorming
          </h2>
          <p className="text-sm text-forge-muted mb-4">
            Creá una sesión y compartila con tus amigos
          </p>

          {/* API key warning */}
          {!settings.apiKey && (
            <div
              className="flex items-center gap-2 p-3 rounded-xl bg-forge-gold/10 border border-forge-gold/30 mb-4 cursor-pointer hover:bg-forge-gold/20 transition-colors"
              onClick={() => setShowSettings(true)}
            >
              <Key size={14} className="text-forge-gold shrink-0" />
              <p className="text-xs text-forge-gold">
                Configurá tu API Key de Anthropic para usar la IA
              </p>
              <ArrowRight size={12} className="text-forge-gold ml-auto shrink-0" />
            </div>
          )}

          <div className="space-y-3">
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ej: App para runners, SaaS de logística..."
              maxLength={60}
              className="w-full bg-forge-surface border border-forge-border rounded-xl px-4 py-3 text-forge-text placeholder-forge-muted focus:outline-none focus:border-forge-primary/60 transition-colors text-sm"
            />
            <button
              onClick={handleCreate}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-gradient text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-forge-primary/20"
            >
              <Plus size={16} />
              Crear Sesión
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 max-w-3xl w-full"
        >
          <h2 className="text-center text-sm font-medium text-forge-muted uppercase tracking-wider mb-6">
            ¿Cómo funciona?
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                step: '01',
                title: 'Crea la sesión',
                desc: 'Dale un nombre al proyecto y comparte el link con tu grupo',
                icon: '🎯',
                color: '#7c3aed',
              },
              {
                step: '02',
                title: 'Carguen ideas',
                desc: 'Cada uno aporta ideas por texto o voz, en cualquier categoría',
                icon: '💡',
                color: '#06b6d4',
              },
              {
                step: '03',
                title: 'La IA forja el venture',
                desc: 'Claude Opus analiza todo y genera un plan de negocio completo',
                icon: '🚀',
                color: '#f59e0b',
              },
            ].map(({ step, title, desc, icon, color }) => (
              <div
                key={step}
                className="bg-forge-card border border-forge-border rounded-2xl p-5 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 right-0 text-6xl font-black opacity-5 leading-none"
                  style={{ color }}
                >
                  {step}
                </div>
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-forge-text mb-1">{title}</h3>
                <p className="text-sm text-forge-text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
