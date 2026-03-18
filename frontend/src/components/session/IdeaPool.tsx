import { useState } from 'react';
import { Lightbulb, Filter } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { IdeaCard } from './IdeaCard';
import { useAppStore } from '../../store/useAppStore';
import { IdeaCategory, CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_ICONS } from '../../types';

const ALL = 'all';
type Filter = IdeaCategory | typeof ALL;

export function IdeaPool() {
  const { session } = useAppStore();
  const [filter, setFilter] = useState<Filter>(ALL);

  if (!session) return null;

  const ideas = filter === ALL
    ? session.ideas
    : session.ideas.filter((i) => i.category === filter);

  const usedCategories = Array.from(new Set(session.ideas.map((i) => i.category)));

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-forge-text flex items-center gap-2">
          <Lightbulb size={14} className="text-forge-gold" />
          Pool de Ideas
          <span className="text-xs text-forge-muted bg-forge-surface px-2 py-0.5 rounded-full border border-forge-border">
            {session.ideas.length}
          </span>
        </h2>

        {/* Category filter */}
        {usedCategories.length > 1 && (
          <div className="flex items-center gap-1.5">
            <Filter size={12} className="text-forge-muted" />
            <div className="flex gap-1 flex-wrap">
              <button
                onClick={() => setFilter(ALL)}
                className={`text-xs px-2 py-0.5 rounded-full transition-all ${
                  filter === ALL
                    ? 'bg-forge-primary text-white'
                    : 'text-forge-muted hover:text-forge-text'
                }`}
              >
                Todas
              </button>
              {usedCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="text-xs px-2 py-0.5 rounded-full transition-all"
                  style={{
                    backgroundColor: filter === cat ? CATEGORY_COLORS[cat] : 'transparent',
                    color: filter === cat ? 'white' : CATEGORY_COLORS[cat],
                  }}
                >
                  {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ideas */}
      {ideas.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">💭</div>
          <p className="text-forge-text-muted text-sm">
            {session.ideas.length === 0
              ? 'Todavía no hay ideas. ¡Sé el primero!'
              : 'No hay ideas en esta categoría'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {ideas.map((idea, index) => (
              <IdeaCard key={idea.id} idea={idea} index={index} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
