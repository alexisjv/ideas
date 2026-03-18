export interface Participant {
  id: string;
  name: string;
  emoji: string;
  color: string;
  joinedAt: string;
}

export interface Idea {
  id: string;
  participantId: string;
  participantName: string;
  content: string;
  category: IdeaCategory;
  reactions: Record<string, string[]>; // emoji -> participantIds
  createdAt: string;
}

export type IdeaCategory =
  | 'problem'
  | 'solution'
  | 'market'
  | 'feature'
  | 'model'
  | 'wild';

export interface Session {
  id: string;
  name: string;
  participants: Participant[];
  ideas: Idea[];
  lastGenerated?: GeneratedVenture;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedVenture {
  ventureName: string;
  tagline: string;
  description: string;
  whyThisTeam: string;
  problemSolved: string;
  targetMarket: string;
  businessModel: string;
  revenueStreams: string[];
  estimatedCosts: CostItem[];
  estimatedBenefits: BenefitItem[];
  profitability: string;
  resources: ResourceItem[];
  competitiveAdvantages: string[];
  risks: RiskItem[];
  mvpFeatures: string[];
  firstConcreteStep: string;
  timeline: TimelineItem[];
  contributions: ContributionItem[];
  viabilityScore: number;
  generatedAt: string;
}

export interface CostItem {
  category: string;
  description: string;
  estimated: string;
}

export interface BenefitItem {
  category: string;
  description: string;
  estimated: string;
}

export interface ResourceItem {
  type: 'human' | 'technical' | 'financial' | 'other';
  description: string;
  priority: 'critical' | 'important' | 'nice-to-have';
}

export interface RiskItem {
  description: string;
  impact: 'high' | 'medium' | 'low';
  mitigation: string;
}

export interface TimelineItem {
  phase: string;
  duration: string;
  milestones: string[];
}

export interface ContributionItem {
  participantId: string;
  participantName: string;
  ideasUsed: string[];
  contribution: string;
}
