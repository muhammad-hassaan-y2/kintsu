import { Request, Response } from 'express';
import { mockParticipants, mockSessions } from '../data/mockData.js';

export const getAnalyticsSummary = (req: Request, res: Response): void => {
  const totalSessions = mockSessions.length;
  const totalParticipants = mockParticipants.length;

  const avgDeEscalation = Math.round(
    mockParticipants.reduce((acc, p) => acc + p.deEscalationScore, 0) / (totalParticipants || 1)
  );

  const avgEmpathy = Math.round(
    mockParticipants.reduce((acc, p) => acc + p.empathyScore, 0) / (totalParticipants || 1)
  );

  res.json({
    success: true,
    data: {
      metrics: {
        activeParticipants: totalParticipants,
        rehabilitationHours: 340,
        completedScenarios: 128,
        deEscalationRate: `${avgDeEscalation}%`,
        empathyRating: `${avgEmpathy}%`
      },
      blockPerformance: [
        { block: 'Block A', attendance: '92%', deEscalation: 88 },
        { block: 'Block B', attendance: '85%', deEscalation: 74 },
        { block: 'Block C', attendance: '94%', deEscalation: 84 }
      ],
      aiInsights: [
        {
          date: '2026-08-20',
          title: 'De-escalation Growth',
          insight: 'Block C participants demonstrated a 14% improvement in impulse control after session #101.'
        }
      ]
    }
  });
};
