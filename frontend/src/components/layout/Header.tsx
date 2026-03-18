import { Zap, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

interface HeaderProps {
  onSettingsClick?: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const session = useAppStore((s) => s.session);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-forge-border bg-forge-bg/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary-gradient flex items-center justify-center shadow-lg shadow-forge-primary/30 group-hover:shadow-forge-primary/50 transition-shadow">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-forge-text">
            Idea<span className="text-forge-primary">Forge</span>
          </span>
        </Link>

        {/* Session info */}
        {session && location.pathname !== '/' && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-forge-success animate-pulse-slow" />
              <span className="text-sm text-forge-text-muted">
                {session.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {session.participants.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 border-forge-bg"
                  style={{ backgroundColor: p.color + '40', borderColor: p.color }}
                  title={p.name}
                >
                  {p.emoji}
                </div>
              ))}
              {session.participants.length > 4 && (
                <div className="w-7 h-7 rounded-full bg-forge-border flex items-center justify-center text-xs text-forge-text-muted">
                  +{session.participants.length - 4}
                </div>
              )}
            </div>
            <span className="text-xs text-forge-muted bg-forge-surface px-2 py-1 rounded-full border border-forge-border">
              {session.ideas.length} ideas
            </span>
          </div>
        )}

        {/* Actions */}
        <button
          onClick={onSettingsClick}
          className="w-9 h-9 rounded-lg border border-forge-border bg-forge-surface hover:bg-forge-card hover:border-forge-primary/50 transition-all flex items-center justify-center text-forge-text-muted hover:text-forge-text"
          title="Configuración"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
}
