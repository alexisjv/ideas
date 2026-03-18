import { motion } from 'framer-motion';
import {
  Rocket, Target, Users, DollarSign, TrendingUp,
  AlertTriangle, Clock, Zap, Star, ChevronRight,
  Award, BarChart3, Wrench, CheckCircle
} from 'lucide-react';
import { GeneratedVenture } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface VentureResultProps {
  venture: GeneratedVenture;
}

const IMPACT_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

const PRIORITY_COLORS = {
  critical: '#ef4444',
  important: '#f59e0b',
  'nice-to-have': '#10b981',
};

const RESOURCE_ICONS = {
  human: '👥',
  technical: '⚙️',
  financial: '💰',
  other: '📦',
};

function Section({
  icon,
  title,
  children,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-forge-card border border-forge-border rounded-2xl p-5"
    >
      <h3 className="text-sm font-semibold text-forge-text flex items-center gap-2 mb-4">
        <span className="text-forge-primary">{icon}</span>
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

export function VentureResult({ venture }: VentureResultProps) {
  const { session } = useAppStore();

  const getParticipantColor = (participantId: string) => {
    const p = session?.participants.find((p) => p.id === participantId);
    return p?.color || '#7c3aed';
  };

  return (
    <div className="space-y-5">
      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-forge-card border border-forge-primary/30 rounded-2xl p-6 overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-forge-primary/10 via-transparent to-forge-accent/5" />

        <div className="relative">
          {/* Viability score */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-forge-text mb-1">
                {venture.ventureName}
              </h1>
              <p className="text-forge-accent italic">{venture.tagline}</p>
            </div>
            <div className="text-center">
              <div
                className="text-3xl font-bold"
                style={{
                  color:
                    venture.viabilityScore >= 70
                      ? '#10b981'
                      : venture.viabilityScore >= 50
                      ? '#f59e0b'
                      : '#ef4444',
                }}
              >
                {venture.viabilityScore}
              </div>
              <div className="text-xs text-forge-muted">viabilidad</div>
            </div>
          </div>

          <p className="text-forge-text-muted text-sm leading-relaxed mb-4">
            {venture.description}
          </p>

          {/* Key stats row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-forge-surface rounded-xl p-3">
              <p className="text-xs text-forge-muted mb-1">Problema</p>
              <p className="text-sm text-forge-text">{venture.problemSolved}</p>
            </div>
            <div className="bg-forge-surface rounded-xl p-3">
              <p className="text-xs text-forge-muted mb-1">Mercado objetivo</p>
              <p className="text-sm text-forge-text">{venture.targetMarket}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* First concrete step — always visible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-forge-card border border-forge-gold/40 rounded-2xl p-5"
      >
        <h3 className="text-sm font-semibold text-forge-gold flex items-center gap-2 mb-3">
          <Zap size={14} />
          Primer Paso Concreto (próximas 48hs)
        </h3>
        <p className="text-forge-text font-medium leading-relaxed">{venture.firstConcreteStep}</p>
      </motion.div>

      {/* Contributions */}
      <Section icon={<Users size={14} />} title="Aportes del Equipo" delay={0.15}>
        <div className="space-y-3">
          {venture.contributions?.map((c) => (
            <div key={c.participantId} className="flex gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 shrink-0"
                style={{
                  backgroundColor: getParticipantColor(c.participantId) + '20',
                  borderColor: getParticipantColor(c.participantId),
                }}
              >
                {session?.participants.find((p) => p.id === c.participantId)?.emoji || '👤'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-forge-text">{c.participantName}</p>
                <p className="text-sm text-forge-text-muted">{c.contribution}</p>
                {c.ideasUsed.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {c.ideasUsed.slice(0, 3).map((idea, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded-full bg-forge-surface border border-forge-border text-forge-muted"
                      >
                        💡 {idea.length > 30 ? idea.substring(0, 30) + '...' : idea}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Why this team */}
      <Section icon={<Award size={14} />} title="Por qué este equipo" delay={0.2}>
        <p className="text-sm text-forge-text-muted leading-relaxed">{venture.whyThisTeam}</p>
      </Section>

      {/* Business model */}
      <Section icon={<DollarSign size={14} />} title="Modelo de Negocio" delay={0.25}>
        <p className="text-sm text-forge-text-muted leading-relaxed mb-4">{venture.businessModel}</p>
        <div>
          <p className="text-xs text-forge-muted mb-2 font-medium">FUENTES DE INGRESOS</p>
          <div className="space-y-2">
            {venture.revenueStreams?.map((stream, i) => (
              <div key={i} className="flex items-center gap-2">
                <ChevronRight size={12} className="text-forge-primary shrink-0" />
                <span className="text-sm text-forge-text">{stream}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 p-3 bg-forge-surface rounded-xl">
          <p className="text-xs text-forge-muted mb-1">Rentabilidad</p>
          <p className="text-sm text-forge-text">{venture.profitability}</p>
        </div>
      </Section>

      {/* Costs & Benefits */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Section icon={<BarChart3 size={14} />} title="Costos Estimados" delay={0.3}>
          <div className="space-y-2">
            {venture.estimatedCosts?.map((cost, i) => (
              <div key={i} className="flex justify-between gap-2">
                <div>
                  <p className="text-xs text-forge-muted">{cost.category}</p>
                  <p className="text-sm text-forge-text">{cost.description}</p>
                </div>
                <span className="text-sm font-medium text-forge-danger whitespace-nowrap">
                  {cost.estimated}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={<TrendingUp size={14} />} title="Beneficios Esperados" delay={0.3}>
          <div className="space-y-2">
            {venture.estimatedBenefits?.map((benefit, i) => (
              <div key={i} className="flex justify-between gap-2">
                <div>
                  <p className="text-xs text-forge-muted">{benefit.category}</p>
                  <p className="text-sm text-forge-text">{benefit.description}</p>
                </div>
                <span className="text-sm font-medium text-forge-success whitespace-nowrap">
                  {benefit.estimated}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* MVP Features */}
      <Section icon={<CheckCircle size={14} />} title="MVP — Features Clave" delay={0.35}>
        <div className="space-y-2">
          {venture.mvpFeatures?.map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-forge-primary/20 border border-forge-primary/40 flex items-center justify-center text-xs text-forge-primary">
                {i + 1}
              </div>
              <span className="text-sm text-forge-text">{feature}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Resources */}
      <Section icon={<Wrench size={14} />} title="Recursos Necesarios" delay={0.4}>
        <div className="space-y-2">
          {venture.resources?.map((resource, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg">{RESOURCE_ICONS[resource.type]}</span>
              <div className="flex-1">
                <p className="text-sm text-forge-text">{resource.description}</p>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: PRIORITY_COLORS[resource.priority] + '20',
                  color: PRIORITY_COLORS[resource.priority],
                }}
              >
                {resource.priority}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Competitive advantages */}
      <Section icon={<Star size={14} />} title="Ventajas Competitivas" delay={0.45}>
        <div className="space-y-2">
          {venture.competitiveAdvantages?.map((adv, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-forge-accent shrink-0" />
              <span className="text-sm text-forge-text">{adv}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section icon={<Clock size={14} />} title="Roadmap" delay={0.5}>
        <div className="space-y-4">
          {venture.timeline?.map((phase, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-primary-gradient flex items-center justify-center text-xs text-white font-bold shrink-0">
                  {i + 1}
                </div>
                {i < (venture.timeline?.length || 0) - 1 && (
                  <div className="w-0.5 h-full min-h-4 bg-forge-border mt-1" />
                )}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-forge-text">{phase.phase}</p>
                  <span className="text-xs text-forge-muted bg-forge-surface px-2 py-0.5 rounded-full">
                    {phase.duration}
                  </span>
                </div>
                <div className="space-y-1">
                  {phase.milestones?.map((milestone, j) => (
                    <p key={j} className="text-xs text-forge-text-muted flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-forge-primary" />
                      {milestone}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Risks */}
      <Section icon={<AlertTriangle size={14} />} title="Riesgos y Mitigación" delay={0.55}>
        <div className="space-y-3">
          {venture.risks?.map((risk, i) => (
            <div
              key={i}
              className="rounded-xl p-3 border"
              style={{
                backgroundColor: IMPACT_COLORS[risk.impact] + '10',
                borderColor: IMPACT_COLORS[risk.impact] + '30',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: IMPACT_COLORS[risk.impact] + '20',
                    color: IMPACT_COLORS[risk.impact],
                  }}
                >
                  {risk.impact}
                </span>
                <p className="text-sm text-forge-text">{risk.description}</p>
              </div>
              <p className="text-xs text-forge-text-muted">
                <span className="text-forge-success">Mitigación:</span> {risk.mitigation}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Generation timestamp */}
      <p className="text-center text-xs text-forge-muted py-2">
        Generado el {new Date(venture.generatedAt).toLocaleString('es-AR')} por Claude Opus
      </p>
    </div>
  );
}
