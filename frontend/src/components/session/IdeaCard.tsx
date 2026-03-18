import { motion } from 'framer-motion';
import { CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_ICONS, Idea } from '../../types';
import { useAppStore } from '../../store/useAppStore';

const REACTION_EMOJIS = ['🔥', '💡', '❤️', '⚡'];

interface IdeaCardProps {
  idea: Idea;
  index: number;
}

export function IdeaCard({ idea, index }: IdeaCardProps) {
  const { currentParticipant, toggleReaction } = useAppStore();
  const categoryColor = CATEGORY_COLORS[idea.category];
  const categoryIcon = CATEGORY_ICONS[idea.category];
  const categoryLabel = CATEGORY_LABELS[idea.category];

  const totalReactions = Object.values(idea.reactions).reduce(
    (sum, ids) => sum + ids.length,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative bg-forge-card border border-forge-border rounded-xl p-4 hover:border-forge-primary/30 transition-all hover:shadow-lg hover:shadow-forge-primary/5"
    >
      {/* Category badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: categoryColor + '20',
            color: categoryColor,
            border: `1px solid ${categoryColor}40`,
          }}
        >
          {categoryIcon} {categoryLabel}
        </span>
        <div className="flex items-center gap-2">
          {totalReactions > 0 && (
            <span className="text-xs text-forge-muted">{totalReactions} reacciones</span>
          )}
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-sm border"
            style={{
              backgroundColor: idea.participantId
                ? undefined
                : '#7c3aed20',
              borderColor: '#7c3aed40',
            }}
            title={idea.participantName}
          >
            {/* Participant avatar initials */}
            <span className="text-xs text-forge-text-muted">
              {idea.participantName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="text-forge-text text-sm leading-relaxed mb-3">{idea.content}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-forge-muted">— {idea.participantName}</span>

        {/* Reactions */}
        <div className="flex gap-1">
          {REACTION_EMOJIS.map((emoji) => {
            const count = idea.reactions[emoji]?.length || 0;
            const hasReacted = currentParticipant
              ? idea.reactions[emoji]?.includes(currentParticipant.id)
              : false;

            return (
              <button
                key={emoji}
                onClick={() => currentParticipant && toggleReaction(idea.id, emoji)}
                disabled={!currentParticipant}
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-xs transition-all ${
                  hasReacted
                    ? 'bg-forge-primary/20 border border-forge-primary/40'
                    : 'hover:bg-forge-surface border border-transparent'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span>{emoji}</span>
                {count > 0 && (
                  <span className="text-forge-text-muted">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
