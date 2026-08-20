import { db } from '../db/jsonDb.js';
import { GoogleGenAI } from '@google/genai';

const geminiApiKey = process.env.GEMINI_API_KEY || '';
const googleAI = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

export interface RoleplayScenario {
  scenarioId: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  actorRole: string;
  settingDescription: string;
  initialMessage: string;
  targetDeEscalationOutcome: string;
}

export interface RoleplayTurn {
  turnNumber: number;
  userInput: string;
  actorResponse: string;
  deEscalationScore: number;
  empathyFeedback: string;
}

export interface RoleplaySessionLog {
  logId: string;
  scenarioId: string;
  scenarioTitle: string;
  participantId?: string;
  participantName: string;
  instructorName: string;
  startedAt: string;
  completedAt?: string;
  turns: RoleplayTurn[];
  finalDeEscalationScore?: number;
  finalEmpathyScore?: number;
  aiAnalysisSummary?: string;
  status: 'active' | 'completed';
}

export const defaultScenarios: RoleplayScenario[] = [
  {
    scenarioId: 'scen-101',
    title: 'De-escalating Block Conflict',
    category: 'De-escalation & Calm',
    difficulty: 'Intermediate',
    actorRole: 'Agitated Cellmate',
    settingDescription: 'Common area during evening recreation hours. Another inmate is upset over a misplaced personal item.',
    initialMessage: 'Hey! Why were you standing near my bunk earlier? Did you touch my things?',
    targetDeEscalationOutcome: 'Maintain calm body language, validate feelings without admitting fault, and de-escalate tension.'
  },
  {
    scenarioId: 'scen-102',
    title: 'Re-entry Job Interview Practice',
    category: 'Life After Prison',
    difficulty: 'Intermediate',
    actorRole: 'Hiring Manager',
    settingDescription: 'Modern corporate office interview room. Manager is asking about employment gap and background.',
    initialMessage: 'Thank you for coming in today. I see a gap in your resume over recent years. Can you walk me through what you were doing during this time?',
    targetDeEscalationOutcome: 'Demonstrate honesty, personal responsibility, skills gained, and commitment to positive change.'
  },
  {
    scenarioId: 'scen-103',
    title: 'Authority Figure Interaction',
    category: 'Respect & Society',
    difficulty: 'Advanced',
    actorRole: 'Strict Facility Officer',
    settingDescription: 'Hallway during shift change. Officer demands immediate compliance during a search routine.',
    initialMessage: 'Halt right there. Step against the wall and keep your hands visible. Move now.',
    targetDeEscalationOutcome: 'Practice prompt respectful compliance while maintaining personal dignity and emotional stability.'
  }
];

export const getScenarios = (): RoleplayScenario[] => {
  const customScenarios = db.getCollection('roleplayScenarios');
  return [...defaultScenarios, ...customScenarios];
};

export const startRoleplaySession = (scenarioId: string, participantName: string, instructorName: string = 'Priya Rajan'): RoleplaySessionLog => {
  const scenarios = getScenarios();
  const scenario = scenarios.find(s => s.scenarioId === scenarioId) || scenarios[0];

  const newLog: RoleplaySessionLog = {
    logId: `rpl-log-${Date.now()}`,
    scenarioId: scenario.scenarioId,
    scenarioTitle: scenario.title,
    participantName,
    instructorName,
    startedAt: new Date().toISOString(),
    turns: [],
    status: 'active'
  };

  db.insert('roleplayLogs', newLog);
  return newLog;
};

export const processRoleplayTurnAI = async (logId: string, userInput: string): Promise<{ turn: RoleplayTurn; sessionLog: RoleplaySessionLog }> => {
  const log: RoleplaySessionLog = db.findById('roleplayLogs', logId) || {
    logId,
    scenarioId: 'scen-101',
    scenarioTitle: 'De-escalating Block Conflict',
    participantName: 'Participant',
    instructorName: 'Priya Rajan',
    startedAt: new Date().toISOString(),
    turns: [],
    status: 'active'
  };

  const scenarios = getScenarios();
  const scenario = scenarios.find(s => s.scenarioId === log.scenarioId) || scenarios[0];

  const systemInstruction = `You are playing the role of "${scenario.actorRole}" in a prison rehabilitation roleplay simulator.
Setting: ${scenario.settingDescription}. Target: ${scenario.targetDeEscalationOutcome}.
Respond realistically in character to the user's dialogue. Evaluate the user's de-escalation skill (0-100) and empathy.
Return JSON only:
{
  "actorResponse": "string",
  "deEscalationScore": 85,
  "empathyFeedback": "string"
}`;

  const conversationHistory = log.turns.map(t => `User: "${t.userInput}"\nActor: "${t.actorResponse}"`).join('\n');
  const prompt = `Previous conversation:\n${conversationHistory}\nUser latest response: "${userInput}"\nRespond in character and evaluate.`;

  let actorResponse = 'I hear what you are saying. Let us discuss this calmly.';
  let deEscalationScore = 80;
  let empathyFeedback = 'Good tone control and non-confrontational choice of words.';

  if (googleAI) {
    try {
      const response = await googleAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction }
      });
      const rawText = response.text || '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.actorResponse) actorResponse = parsed.actorResponse;
        if (typeof parsed.deEscalationScore === 'number') deEscalationScore = parsed.deEscalationScore;
        if (parsed.empathyFeedback) empathyFeedback = parsed.empathyFeedback;
      }
    } catch (err) {
      console.warn('Gemini roleplay call failed, using default simulator response:', err);
    }
  }

  const newTurn: RoleplayTurn = {
    turnNumber: log.turns.length + 1,
    userInput,
    actorResponse,
    deEscalationScore,
    empathyFeedback
  };

  log.turns.push(newTurn);
  db.update('roleplayLogs', logId, { turns: log.turns });

  return { turn: newTurn, sessionLog: log };
};

export const completeRoleplaySession = async (logId: string): Promise<RoleplaySessionLog> => {
  const log: RoleplaySessionLog = db.findById('roleplayLogs', logId) || {
    logId,
    scenarioId: 'scen-101',
    scenarioTitle: 'De-escalating Block Conflict',
    participantName: 'Participant',
    instructorName: 'Priya Rajan',
    startedAt: new Date().toISOString(),
    turns: [],
    status: 'active'
  };

  const avgDeEscalation = log.turns.length > 0
    ? Math.round(log.turns.reduce((sum, t) => sum + t.deEscalationScore, 0) / log.turns.length)
    : 80;

  const finalEmpathy = Math.min(100, Math.round(avgDeEscalation * 0.95));
  const aiSummary = `Participant demonstrated strong de-escalation awareness across ${log.turns.length} interaction turns, maintaining composure under pressure.`;

  const updatedLog = db.update('roleplayLogs', logId, {
    status: 'completed',
    completedAt: new Date().toISOString(),
    finalDeEscalationScore: avgDeEscalation,
    finalEmpathyScore: finalEmpathy,
    aiAnalysisSummary: aiSummary
  }) || {
    ...log,
    status: 'completed',
    completedAt: new Date().toISOString(),
    finalDeEscalationScore: avgDeEscalation,
    finalEmpathyScore: finalEmpathy,
    aiAnalysisSummary: aiSummary
  };

  return updatedLog;
};

export const getRoleplayHistory = (): RoleplaySessionLog[] => {
  return db.getCollection('roleplayLogs');
};
