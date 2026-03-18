import { useState } from 'react';
import { UserPlus, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import toast from 'react-hot-toast';

export function ParticipantForm() {
  const [name, setName] = useState('');
  const { session, currentParticipant, joinSession, setCurrentParticipant } = useAppStore();

  const handleJoin = () => {
    if (!name.trim()) {
      toast.error('Ingresá tu nombre');
      return;
    }

    // Check if name already taken
    const taken = session?.participants.some(
      (p) => p.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (taken) {
      toast.error('Ese nombre ya está en uso');
      return;
    }

    try {
      const participant = joinSession(name.trim());
      toast.success(`¡Bienvenido/a, ${participant.name} ${participant.emoji}!`);
      setName('');
    } catch (err) {
      toast.error('No se pudo unirse');
    }
  };

  const handleLeave = () => {
    setCurrentParticipant(null);
    toast('Saliste de la sesión', { icon: '👋' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleJoin();
  };

  return (
    <AnimatePresence mode="wait">
      {!currentParticipant ? (
        <motion.div
          key="join"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-forge-card border border-forge-border rounded-2xl p-4"
        >
          <h3 className="text-sm font-medium text-forge-text mb-3 flex items-center gap-2">
            <UserPlus size={14} className="text-forge-primary" />
            Unirte a la sesión
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tu nombre..."
              maxLength={30}
              className="flex-1 bg-forge-surface border border-forge-border rounded-xl px-3 py-2.5 text-forge-text placeholder-forge-muted focus:outline-none focus:border-forge-primary/60 transition-colors text-sm"
            />
            <button
              onClick={handleJoin}
              className="px-4 py-2.5 rounded-xl bg-primary-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Unirme
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="participant"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-forge-card border border-forge-border rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2"
              style={{
                backgroundColor: currentParticipant.color + '30',
                borderColor: currentParticipant.color,
              }}
            >
              {currentParticipant.emoji}
            </div>
            <div>
              <p className="text-sm font-medium text-forge-text">{currentParticipant.name}</p>
              <p className="text-xs text-forge-muted">Participando activamente</p>
            </div>
          </div>
          <button
            onClick={handleLeave}
            className="flex items-center gap-1.5 text-xs text-forge-muted hover:text-forge-danger transition-colors px-3 py-2 rounded-xl hover:bg-forge-danger/10"
          >
            <LogOut size={12} />
            Salir
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
