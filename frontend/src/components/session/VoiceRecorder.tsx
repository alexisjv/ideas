import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceRecording } from '../../hooks/useVoiceRecording';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

export function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const { isRecording, transcript, isSupported, error, startRecording, stopRecording, clearTranscript } =
    useVoiceRecording();

  const handleStop = () => {
    stopRecording();
    if (transcript.trim()) {
      onTranscript(transcript.trim());
      clearTranscript();
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-xs text-forge-muted">
        <AlertCircle size={14} />
        <span>Tu navegador no soporta reconocimiento de voz</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={isRecording ? handleStop : startRecording}
        className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
          isRecording
            ? 'bg-forge-danger/20 border border-forge-danger/50 text-forge-danger hover:bg-forge-danger/30'
            : 'bg-forge-surface border border-forge-border text-forge-text-muted hover:text-forge-text hover:border-forge-primary/50'
        }`}
      >
        {isRecording ? (
          <>
            <div className="relative">
              <MicOff size={14} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-forge-danger rounded-full animate-ping" />
            </div>
            Detener
          </>
        ) : (
          <>
            <Mic size={14} />
            Voz
          </>
        )}
      </button>

      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="flex items-center gap-2 overflow-hidden"
          >
            <div className="flex gap-0.5 items-center">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-0.5 bg-forge-danger rounded-full"
                  animate={{ height: ['4px', '12px', '4px'] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
            <span className="text-xs text-forge-danger whitespace-nowrap">Grabando...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <span className="text-xs text-forge-danger">{error}</span>
      )}
    </div>
  );
}
