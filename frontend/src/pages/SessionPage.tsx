import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, ArrowLeft, Rocket, Copy, Check } from 'lucide-react';
import { IdeaSubmitter } from '../components/session/IdeaSubmitter';
import { IdeaPool } from '../components/session/IdeaPool';
import { ParticipantForm } from '../components/session/ParticipantForm';
import { ParticipantList } from '../components/session/ParticipantList';
import { GenerationStream } from '../components/results/GenerationStream';
import { VentureResult } from '../components/results/VentureResult';
import { useAppStore } from '../store/useAppStore';
import { useIdeaGeneration } from '../hooks/useIdeaGeneration';
import toast from 'react-hot-toast';

export function SessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { session, clearSession } = useAppStore();
  const { isGenerating, canGenerate, generate } = useIdeaGeneration();
  const [copied, setCopied] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!session || session.id !== sessionId) {
      navigate('/');
    }
  }, [session, sessionId, navigate]);

  useEffect(() => {
    if (session?.lastGenerated) {
      setShowResults(true);
    }
  }, [session?.lastGenerated]);

  if (!session) return null;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('No se pudo copiar el link');
    }
  };

  const handleNewSession = () => {
    clearSession();
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Session header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 gap-4"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={handleNewSession}
              className="p-2 rounded-xl border border-forge-border hover:bg-forge-surface transition-colors text-forge-text-muted"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-forge-text">{session.name}</h1>
              <p className="text-xs text-forge-muted">
                {session.participants.length} participantes · {session.ideas.length} ideas
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-forge-border hover:bg-forge-surface transition-all text-sm text-forge-text-muted"
            >
              {copied ? <Check size={14} className="text-forge-success" /> : <Share2 size={14} />}
              {copied ? 'Copiado' : 'Compartir'}
            </button>

            {session.lastGenerated && (
              <button
                onClick={() => setShowResults(!showResults)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gold-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Rocket size={14} />
                {showResults ? 'Ver ideas' : 'Ver resultado'}
              </button>
            )}
          </div>
        </motion.div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-[300px_1fr] gap-5">
          {/* Left sidebar */}
          <div className="space-y-4">
            <ParticipantForm />
            <ParticipantList />

            {/* Generate CTA (sidebar) */}
            {!session.lastGenerated && canGenerate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-forge-card border border-forge-gold/30 rounded-2xl p-4 text-center"
              >
                <div className="text-2xl mb-2">✨</div>
                <p className="text-sm font-medium text-forge-text mb-1">
                  ¡Listo para generar!
                </p>
                <p className="text-xs text-forge-muted mb-3">
                  Claude va a analizar todas las ideas y crear tu venture
                </p>
                <button
                  onClick={generate}
                  disabled={isGenerating}
                  className="w-full py-2.5 rounded-xl bg-gold-gradient text-white font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  {isGenerating ? 'Generando...' : 'Generar Venture ✨'}
                </button>
              </motion.div>
            )}
          </div>

          {/* Main content */}
          <div className="space-y-5">
            {/* Idea submitter */}
            <IdeaSubmitter />

            {/* Generation stream */}
            <GenerationStream />

            {/* Results or pool */}
            {showResults && session.lastGenerated ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="results"
              >
                <VentureResult venture={session.lastGenerated} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="pool"
              >
                <IdeaPool />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
