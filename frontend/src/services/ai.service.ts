/**
 * AI Service — calls Anthropic API directly from the browser.
 * The API key is provided by the user and stored in localStorage.
 * This pattern is appropriate for personal/friends apps where the
 * user is the API key owner.
 */
import Anthropic from '@anthropic-ai/sdk';
import { Session, GeneratedVenture } from '../types';

function buildPrompt(session: Session): string {
  const participantsList = session.participants
    .map((p) => `- ${p.name} (${p.emoji})`)
    .join('\n');

  const ideasList = session.ideas
    .map((i) => `[${i.category.toUpperCase()}] ${i.participantName}: "${i.content}"`)
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

export async function generateVentureStream(
  session: Session,
  apiKey: string,
  onDelta: (text: string) => void,
  onProgress: (msg: string) => void
): Promise<GeneratedVenture> {
  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  onProgress('Analizando ideas del grupo...');

  let fullText = '';

  const stream = client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 4000,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    thinking: { type: 'adaptive' } as any,
    messages: [{ role: 'user', content: buildPrompt(session) }],
  });

  let hasSeenJson = false;

  for await (const event of stream) {
    if (
      event.type === 'content_block_start' &&
      event.content_block.type === 'thinking'
    ) {
      onProgress('Pensando profundamente...');
    }

    if (
      event.type === 'content_block_start' &&
      event.content_block.type === 'text'
    ) {
      onProgress('Generando el plan de negocio...');
      hasSeenJson = true;
    }

    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      fullText += event.delta.text;
      if (hasSeenJson) {
        onDelta(event.delta.text);
      }
    }
  }

  onProgress('Finalizando...');

  try {
    // Extract JSON from the response (handle potential surrounding text)
    const jsonMatch = fullText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');

    const venture = JSON.parse(jsonMatch[0]) as GeneratedVenture;
    venture.generatedAt = new Date().toISOString();

    // Ensure all participants have contributions
    const participantIds = new Set(session.participants.map(p => p.id));
    const contributionIds = new Set(venture.contributions?.map(c => c.participantId) || []);

    for (const participant of session.participants) {
      if (!contributionIds.has(participant.id)) {
        venture.contributions = venture.contributions || [];
        venture.contributions.push({
          participantId: participant.id,
          participantName: participant.name,
          ideasUsed: [],
          contribution: 'Participó en la sesión de brainstorming',
        });
      }
    }

    return venture;
  } catch {
    throw new Error('No se pudo parsear la respuesta de IA. Intentá de nuevo.');
  }
}
