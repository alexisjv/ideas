import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export function GenerationStream() {
  const { isGenerating, generationProgress, streamingText } = useAppStore();

  if (!isGenerating && !streamingText) return null;

  // Try to parse partial JSON for preview
  const previewLines = streamingText
    .split('\n')
    .filter((l) => l.trim())
    .slice(0, 8);

  return (
    <AnimatePresence>
      {(isGenerating || streamingText) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-forge-card border border-forge-primary/30 rounded-2xl p-5 shadow-lg shadow-forge-primary/10"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center">
                <Brain size={18} className="text-white" />
              </div>
              {isGenerating && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-forge-gold rounded-full animate-ping" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-forge-text flex items-center gap-2">
                Claude está analizando
                <Sparkles size={14} className="text-forge-gold animate-pulse" />
              </p>
              <p className="text-xs text-forge-primary animate-pulse">{generationProgress}</p>
            </div>
          </div>

          {/* Streaming preview */}
          {streamingText && (
            <div className="bg-forge-surface rounded-xl p-4 font-mono text-xs text-forge-text-muted overflow-hidden max-h-40 relative">
              {previewLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="leading-relaxed"
                >
                  {line}
                </motion.div>
              ))}
              {isGenerating && (
                <span className="inline-block w-1.5 h-4 bg-forge-primary ml-0.5 animate-pulse rounded" />
              )}
              {/* Gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-forge-surface to-transparent" />
            </div>
          )}

          {/* Progress bar */}
          <div className="mt-3 h-1 bg-forge-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-gradient rounded-full"
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
