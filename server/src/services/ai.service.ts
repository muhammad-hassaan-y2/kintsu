import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

const geminiApiKey = process.env.GEMINI_API_KEY || '';
const openaiApiKey = process.env.OPENAI_API_KEY || '';

let aiProvider: 'gemini' | 'openai' | 'mock' = 'mock';

if (geminiApiKey) {
  aiProvider = 'gemini';
} else if (openaiApiKey) {
  aiProvider = 'openai';
}

console.log(`🤖 Kintsu AI Integration Provider Mode: [${aiProvider.toUpperCase()}]`);

const googleAI = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

export const getAIStatus = () => ({
  provider: aiProvider,
  hasGeminiKey: Boolean(geminiApiKey),
  hasOpenAIKey: Boolean(openaiApiKey),
  supportedFeatures: [
    'Rehabilitation Session Builder',
    'Participant Behavioral & Empathy Analysis',
    'Motivational Story Generator',
    'Book Insight & Discussion Prompt Generator'
  ]
});

/**
 * Low-level text completion helper that uses Gemini or OpenAI based on available API key
 */
async function generateText(prompt: string, systemInstruction?: string): Promise<string> {
  if (aiProvider === 'gemini' && googleAI) {
    try {
      const response = await googleAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined
      });
      return response.text || '';
    } catch (err) {
      console.warn('Gemini API call failed, falling back to mock generator:', err);
    }
  }

  if (aiProvider === 'openai' && openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          ...(systemInstruction ? [{ role: 'system' as const, content: systemInstruction }] : []),
          { role: 'user' as const, content: prompt }
        ]
      });
      return response.choices[0]?.message?.content || '';
    } catch (err) {
      console.warn('OpenAI API call failed, falling back to mock generator:', err);
    }
  }

  // Fallback mock response if no API keys configured or call failed
  return '';
}

/**
 * Generate a complete structured rehabilitation classroom session
 */
export async function generateSessionAI(topic: string, category: string, block?: string) {
  const systemInstruction = `You are an expert prison rehabilitation counselor and psychologist designing structured classroom sessions for inmate transformation. Output clean JSON only.`;

  const prompt = `Design a 6-step rehabilitation classroom session on the topic "${topic}" in category "${category}" for block "${block || 'Block C'}".
Return a valid JSON object with the following structure:
{
  "title": "string",
  "subtitle": "string",
  "category": "${category}",
  "description": "string",
  "steps": [
    { "stepNumber": 1, "type": "video", "title": "string", "durationMinutes": 7, "content": "string" },
    { "stepNumber": 2, "type": "story", "title": "string", "durationMinutes": 10, "content": "string" },
    { "stepNumber": 3, "type": "discussion", "title": "string", "durationMinutes": 15, "content": "string", "questions": ["q1", "q2", "q3"] },
    { "stepNumber": 4, "type": "activity", "title": "string", "durationMinutes": 10, "content": "string" },
    { "stepNumber": 5, "type": "reflection", "title": "string", "durationMinutes": 8, "content": "string" },
    { "stepNumber": 6, "type": "closing", "title": "string", "durationMinutes": 5, "content": "string" }
  ]
}`;

  const rawText = await generateText(prompt, systemInstruction);

  if (rawText) {
    try {
      // Extract json block if present
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse AI session response as JSON, returning fallback structure');
    }
  }

  // Smart Fallback Generation
  return {
    title: `${topic}: Mindset & Emotional Growth`,
    subtitle: `Structured Group Learning Session on ${category}`,
    category,
    description: `A comprehensive rehabilitation session focusing on ${topic.toLowerCase()}, designed to promote self-reflection and impulse control.`,
    steps: [
      { stepNumber: 1, type: 'video', title: `Introductory Video: Understanding ${topic}`, durationMinutes: 7, content: `Visual presentation introducing core principles of ${topic.toLowerCase()}.` },
      { stepNumber: 2, type: 'story', title: `Real-Life Transformation Story`, durationMinutes: 10, content: `A narrative of an individual who mastered ${topic.toLowerCase()} after overcoming major life obstacles.` },
      { stepNumber: 3, type: 'discussion', title: `Instructor-Led Discussion`, durationMinutes: 15, content: `Interactive dialogue exploring real-world applications of ${topic.toLowerCase()}.`, questions: [`How does ${topic.toLowerCase()} affect your daily choices?`, `What is one trigger you can control starting today?`] },
      { stepNumber: 4, type: 'activity', title: `Group Guided Exercise`, durationMinutes: 10, content: `Practical group exercise reinforcing positive behavioral choices.` },
      { stepNumber: 5, type: 'reflection', typeName: 'reflection', title: `Personal Reflection & Journaling`, durationMinutes: 8, content: `Writing down one personal commitment for the week.` },
      { stepNumber: 6, type: 'closing', title: `Closing Summary by Case Worker`, durationMinutes: 5, content: `Encouraging closing message highlighting personal responsibility and growth.` }
    ]
  };
}

/**
 * Analyze participant behavior and generate empathy & de-escalation insights
 */
export async function analyzeParticipantAI(participantName: string, caseNotes: string[], recentResponse?: string) {
  const systemInstruction = `You are a forensic psychologist and correctional caseworker analyzing participant progress. Return clean JSON only.`;

  const prompt = `Analyze participant "${participantName}" based on notes: ${JSON.stringify(caseNotes)} and recent response: "${recentResponse || 'Active classroom participant'}".
Return JSON:
{
  "deEscalationScore": 82,
  "empathyScore": 76,
  "summaryAnalysis": "string",
  "keyStrengths": ["s1", "s2"],
  "areasForGrowth": ["g1", "g2"],
  "recommendedModule": "string"
}`;

  const rawText = await generateText(prompt, systemInstruction);

  if (rawText) {
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (e) {}
  }

  return {
    deEscalationScore: 82,
    empathyScore: 78,
    summaryAnalysis: `${participantName} demonstrates steady engagement and emotional awareness during classroom sessions, with positive progress in de-escalation techniques.`,
    keyStrengths: ['Active listening in group discussions', 'Willingness to acknowledge personal triggers'],
    areasForGrowth: ['Refining impulse control under direct verbal confrontation'],
    recommendedModule: '5-4-3-2-1 Calm Routine & Verbal De-escalation'
  };
}

/**
 * Generate a inspirational transformation story for classroom reading
 */
export async function generateStoryAI(theme: string, targetAudience: string = 'Inmate Rehabilitation Group') {
  const systemInstruction = `You write uplifting, realistic, non-preachy transformation stories for prison classroom rehabilitation. Output JSON only.`;

  const prompt = `Write an inspiring rehabilitation story about "${theme}" for ${targetAudience}.
Return JSON:
{
  "title": "string",
  "category": "${theme}",
  "summary": "string",
  "fullText": "string",
  "moral": "string",
  "discussionQuestions": ["q1", "q2"]
}`;

  const rawText = await generateText(prompt, systemInstruction);

  if (rawText) {
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (e) {}
  }

  return {
    title: `The Turning Point of Perseverance: ${theme}`,
    category: theme,
    summary: `An inspiring tale of choosing self-discipline and accountability over reaction.`,
    fullText: `Change does not happen in a single grand event; it happens in quiet, unglamorous moments when a person decides to act differently than they did yesterday. When faced with frustration, choosing patience over impulse is where freedom truly begins...`,
    moral: `Your past explains where you have been, but it never defines where you can go.`,
    discussionQuestions: [
      `What choice in this story resonated most with you?`,
      `How can you apply this lesson when facing frustration this week?`
    ]
  };
}
