import { Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

export function ParticipantList() {
  const { session, currentParticipant } = useAppStore();

  if (!session || session.participants.length === 0) return null;

  return (
    <div className="bg-forge-card border border-forge-border rounded-2xl p-4">
      <h3 className="text-xs font-medium text-forge-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
        <Users size={12} />
        Participantes ({session.participants.length})
      </h3>
      <div className="space-y-2">
        <AnimatePresence>
          {session.participants.map((participant, i) => {
            const ideaCount = session.ideas.filter(
              (idea) => idea.participantId === participant.id
            ).length;
            const isMe = currentParticipant?.id === participant.id;

            return (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                  isMe ? 'bg-forge-primary/10 border border-forge-primary/20' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm border"
                    style={{
                      backgroundColor: participant.color + '20',
                      borderColor: participant.color + '60',
                    }}
                  >
                    {participant.emoji}
                  </div>
                  <div>
                    <p className="text-sm text-forge-text">
                      {participant.name}
                      {isMe && <span className="ml-1 text-xs text-forge-primary">(vos)</span>}
                    </p>
                    <p className="text-xs text-forge-muted">{ideaCount} ideas</p>
                  </div>
                </div>
                {ideaCount > 0 && (
                  <div className="flex gap-0.5">
                    {Array.from({ length: Math.min(ideaCount, 5) }).map((_, j) => (
                      <div
                        key={j}
                        className="w-1 h-3 rounded-full"
                        style={{ backgroundColor: participant.color }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
