import { useState } from 'react';
import { X, Eye, EyeOff, Key, Link, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import toast from 'react-hot-toast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useAppStore();
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [backendUrl, setBackendUrl] = useState(settings.backendUrl);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    updateSettings({ apiKey: apiKey.trim(), backendUrl: backendUrl.trim() });
    toast.success('Configuración guardada');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-forge-card border border-forge-border rounded-2xl shadow-2xl shadow-forge-primary/10 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-forge-text">Configuración</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg border border-forge-border hover:bg-forge-surface transition-colors flex items-center justify-center text-forge-text-muted"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5">
              {/* API Key */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-forge-text mb-2">
                  <Key size={14} className="text-forge-primary" />
                  Anthropic API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="w-full bg-forge-surface border border-forge-border rounded-xl px-4 py-3 pr-12 text-forge-text placeholder-forge-muted focus:outline-none focus:border-forge-primary transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-forge-muted hover:text-forge-text transition-colors"
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="mt-2 flex items-start gap-1.5">
                  <Info size={12} className="text-forge-muted mt-0.5 shrink-0" />
                  <p className="text-xs text-forge-muted">
                    Tu API key se guarda solo en este navegador. Obtené una en{' '}
                    <a
                      href="https://console.anthropic.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-forge-accent hover:underline"
                    >
                      console.anthropic.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Backend URL (optional) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-forge-text mb-2">
                  <Link size={14} className="text-forge-accent" />
                  Backend URL{' '}
                  <span className="text-forge-muted font-normal">(opcional)</span>
                </label>
                <input
                  type="url"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  placeholder="http://localhost:3001"
                  className="w-full bg-forge-surface border border-forge-border rounded-xl px-4 py-3 text-forge-text placeholder-forge-muted focus:outline-none focus:border-forge-accent transition-colors text-sm"
                />
                <p className="mt-1 text-xs text-forge-muted">
                  Para sincronización multi-dispositivo. Dejá vacío para modo local.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-forge-border text-forge-text-muted hover:text-forge-text hover:bg-forge-surface transition-all text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl bg-primary-gradient text-white font-medium hover:opacity-90 transition-opacity text-sm"
              >
                Guardar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
