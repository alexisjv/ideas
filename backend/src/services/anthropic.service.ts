import Anthropic from '@anthropic-ai/sdk';
import { Response } from 'express';
import { Session, GeneratedVenture } from '../types';
import { IAnthropicService } from '../interfaces/IAnthropicService';

export class AnthropicService implements IAnthropicService {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  private buildPrompt(session: Session): string {
    const participantsList = session.participants
      .map(p => `- ${p.name} (${p.emoji})`)
      .join('\n');

    const ideasList = session.ideas
      .map(i => `[${i.category.toUpperCase()}] ${i.participantName}: "${i.content}"`)
      .join('\n');

    return `You are an expert startup advisor and venture analyst. Analyze the following group brainstorming session and synthesize a comprehensive venture concept.

SESSION: "${session.name}"

PARTICIPANTS (${session.participants.length}):
${participantsList}

IDEAS POOL (${session.ideas.length} ideas):
${ideasList}

Analyze ALL ideas holistically. Include viable parts from each idea, combine complementary elements, and omit only truly infeasible components. Show respect for each participant's contribution.

Respond with a JSON object (no markdown, pure JSON) with this exact structure:
{
  "ventureName": "Creative, memorable name",
  "tagline": "Short, punchy tagline (max 10 words)",
  "description": "Compelling 3-4 sentence description of the venture",
  "whyThisTeam": "Why these specific participants are uniquely positioned to build this (2-3 sentences)",
  "problemSolved": "The core problem this venture solves",
  "targetMarket": "Primary target audience/customer segment",
  "businessModel": "How the venture makes money (2-3 sentences)",
  "revenueStreams": ["stream1", "stream2", "stream3"],
  "estimatedCosts": [
    {"category": "category", "description": "description", "estimated": "$X/month or $X one-time"}
  ],
  "estimatedBenefits": [
    {"category": "category", "description": "description", "estimated": "$X ARR or X users"}
  ],
  "profitability": "When and how the venture reaches profitability",
  "resources": [
    {"type": "human|technical|financial|other", "description": "description", "priority": "critical|important|nice-to-have"}
  ],
  "competitiveAdvantages": ["advantage1", "advantage2", "advantage3"],
  "risks": [
    {"description": "risk", "impact": "high|medium|low", "mitigation": "mitigation strategy"}
  ],
  "mvpFeatures": ["feature1", "feature2", "feature3"],
  "firstConcreteStep": "The single most important action to take in the next 48 hours",
  "timeline": [
    {"phase": "Phase name", "duration": "X weeks/months", "milestones": ["milestone1", "milestone2"]}
  ],
  "contributions": [
    {"participantId": "id", "participantName": "name", "ideasUsed": ["idea1", "idea2"], "contribution": "How their ideas shaped the venture"}
  ],
  "viabilityScore": 85
}

Make sure contributions covers ALL participants from the session. The viabilityScore should be 0-100.`;
  }

  async generateVenture(session: Session): Promise<GeneratedVenture> {
    const response = await this.client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4000,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      thinking: { type: 'adaptive' } as any,
      messages: [{ role: 'user', content: this.buildPrompt(session) }],
    });

    const textBlock = response.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from AI');
    }

    try {
      const venture = JSON.parse(textBlock.text) as GeneratedVenture;
      venture.generatedAt = new Date().toISOString();
      return venture;
    } catch {
      throw new Error('Failed to parse AI response as JSON');
    }
  }

  async streamGenerateVenture(session: Session, res: Response): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const sendEvent = (event: string, data: unknown) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    sendEvent('start', { message: 'Analyzing ideas...' });

    let fullText = '';

    const stream = this.client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 4000,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      thinking: { type: 'adaptive' } as any,
      messages: [{ role: 'user', content: this.buildPrompt(session) }],
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        fullText += event.delta.text;
        sendEvent('delta', { text: event.delta.text });
      }
    }

    try {
      const venture = JSON.parse(fullText) as GeneratedVenture;
      venture.generatedAt = new Date().toISOString();
      sendEvent('complete', { venture });
    } catch {
      sendEvent('error', { message: 'Failed to parse AI response' });
    }

    res.write('event: done\ndata: {}\n\n');
    res.end();
  }
}
