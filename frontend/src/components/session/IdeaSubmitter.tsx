import { useState, useRef } from 'react';
import { Send, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IdeaCategory, CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_ICONS } from '../../types';
import { VoiceRecorder } from './VoiceRecorder';
import { useAppStore } from '../../store/useAppStore';
import { useIdeaGeneration } from '../../hooks/useIdeaGeneration';
import toast from 'react-hot-toast';

const CATEGORIES: IdeaCategory[] = ['problem', 'solution', 'market', 'feature', 'model', 'wild'];

export function IdeaSubmitter() {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<IdeaCategory>('solution');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const { addIdea, currentParticipant, session } = useAppStore();
  const { generate, isGenerating, canGenerate } = useIdeaGeneration();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error('Escribí tu idea primero');
      return;
    }
    if (!currentParticipant) {
      toast.error('Registrate primero con tu nombre');
      return;
    }

    addIdea(content.trim(), category);
    setContent('');
    toast.success('¡Idea agregada!', { icon: '💡', duration: 2000 });
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setContent((prev) => (prev ? `${prev} ${text}` : text));
    textareaRef.current?.focus();
  };

  const selectedColor = CATEGORY_COLORS[category];

  return (
    <div className="bg-forge-card border border-forge-border rounded-2xl p-4 space-y-3">
      {/* Category selector */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all border"
            style={{
              backgroundColor: selectedColor + '20',
              color: selectedColor,
              borderColor: selectedColor + '40',
            }}
          >
            {CATEGORY_ICONS[category]} {CATEGORY_LABELS[category]}
            <ChevronDown
              size={14}
              className={`transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showCategoryMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="absolute top-full left-0 mt-1 z-20 bg-forge-card border border-forge-border rounded-xl shadow-xl overflow-hidden min-w-40"
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setShowCategoryMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-forge-surface transition-colors text-left"
                    style={{ color: CATEGORY_COLORS[cat] }}
                  >
                    {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <VoiceRecorder onTranscript={handleVoiceTranscript} />
      </div>

      {/* Text input */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Tu idea... (Cmd+Enter para enviar)`}
        disabled={!currentParticipant}
        rows={3}
        className="w-full bg-forge-surface border border-forge-border rounded-xl px-4 py-3 text-forge-text placeholder-forge-muted focus:outline-none focus:border-forge-primary/60 transition-colors text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {!currentParticipant && (
            <span className="text-xs text-forge-muted">Registrate abajo para participar</span>
          )}
          {currentParticipant && (
            <span className="text-xs text-forge-muted">
              {session?.ideas.filter(i => i.participantId === currentParticipant.id).length || 0} ideas tuyas
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {/* Generate button */}
          <button
            onClick={generate}
            disabled={!canGenerate}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              canGenerate
                ? 'bg-gold-gradient text-white hover:opacity-90 shadow-lg shadow-forge-gold/20'
                : 'bg-forge-surface border border-forge-border text-forge-muted cursor-not-allowed opacity-50'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generando...
              </>
            ) : (
              <>✨ Generar</>
            )}
          </button>

          {/* Submit idea */}
          <button
            onClick={handleSubmit}
            disabled={!currentParticipant || !content.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-forge-primary/20"
          >
            <Send size={14} />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
