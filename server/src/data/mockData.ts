import { RehabilitationSession, Story, VideoItem, BookItem, Participant, DiscussionGuide, ResourceItem, User } from '../types/index.js';

export const mockUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Priya Rajan',
    email: 'priya.rajan@kintsu.org',
    role: 'instructor',
    facility: 'Central Rehabilitation Facility - Block C',
    avatarInitials: 'PR'
  },
  {
    id: 'usr-2',
    name: 'Dr. Sharma',
    email: 'dr.sharma@kintsu.org',
    role: 'psychologist',
    facility: 'Central Rehabilitation Facility',
    avatarInitials: 'DS'
  }
];

export const mockSessions: RehabilitationSession[] = [
  {
    id: 'sess-101',
    title: 'Anger Management & De-escalation',
    subtitle: 'Mastering Emotional Control in High-Pressure Situations',
    category: 'Anger Management',
    scheduledDate: '2026-08-21',
    scheduledTime: '10:00 AM',
    block: 'Block C',
    targetCount: 18,
    completedCount: 14,
    instructorId: 'usr-1',
    instructorName: 'Priya Rajan',
    status: 'in-progress',
    description: 'A structured classroom session designed to help participants recognize emotional triggers, practice breathing techniques, and apply de-escalation strategies.',
    steps: [
      {
        stepNumber: 1,
        type: 'video',
        title: 'Opening Motivational Video: Breaking the Impulse Cycle',
        durationMinutes: 7,
        content: 'A short visual presentation illustrating how emotional responses form and how a 5-second pause can prevent lifetime consequences.',
        mediaUrl: 'https://cdn.kintsu.org/videos/impulse-control.mp4'
      },
      {
        stepNumber: 2,
        type: 'story',
        title: 'Real-Life Story: Vikram\'s Turning Point',
        durationMinutes: 10,
        content: 'The journey of a former inmate who mastered emotional discipline after 8 years in prison and built a community youth center.'
      },
      {
        stepNumber: 3,
        type: 'discussion',
        title: 'Group Discussion: Recognizing Your Emotional Triggers',
        durationMinutes: 15,
        content: 'Guided discussion led by instructor on identifying internal warning signs before anger escalates.',
        questions: [
          'What physical signs tell you that anger is taking over?',
          'What would you have done differently in a recent conflict?',
          'How does remaining calm protect your future?'
        ]
      },
      {
        stepNumber: 4,
        type: 'activity',
        title: 'Emotional Learning Activity: The 5-4-3-2-1 Calm Routine',
        durationMinutes: 10,
        content: 'Interactive breathing and sensory grounding exercise performed together by all participants.'
      },
      {
        stepNumber: 5,
        type: 'reflection',
        title: 'Personal Reflection & Journaling',
        durationMinutes: 8,
        content: 'Participants write down one commitment for the week on how to handle frustration constructively.'
      },
      {
        stepNumber: 6,
        type: 'closing',
        title: 'Closing Message: Building Self-Respect Daily',
        durationMinutes: 5,
        content: 'Summary by Priya Rajan emphasizing that self-control is the ultimate sign of strength.'
      }
    ],
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-08-21T09:30:00Z'
  },
  {
    id: 'sess-102',
    title: 'Re-entry Preparation: Society & Modern Workplace',
    subtitle: 'Navigating Digital Payments, Online Services, and New Workplaces',
    category: 'Life After Prison',
    scheduledDate: '2026-08-22',
    scheduledTime: '02:00 PM',
    block: 'Block A & B',
    targetCount: 25,
    completedCount: 0,
    instructorId: 'usr-1',
    instructorName: 'Priya Rajan',
    status: 'upcoming',
    description: 'Preparing participants for release by demystifying modern technology, digital banking, job applications, and rebuilding family relationships.',
    steps: [
      {
        stepNumber: 1,
        type: 'video',
        title: 'Video: How Society Has Changed Over the Last Decade',
        durationMinutes: 10,
        content: 'Overview of modern digital infrastructure, online services, and smart workplace environments.'
      },
      {
        stepNumber: 2,
        type: 'discussion',
        title: 'Discussion: Overcoming Fear of Re-entry',
        durationMinutes: 20,
        content: 'Addressing anxiety regarding employment, social acceptance, and family reconciliation.',
        questions: [
          'What is your biggest concern about life after release?',
          'How can you demonstrate positive change to employers and family?'
        ]
      },
      {
        stepNumber: 3,
        type: 'closing',
        title: 'Closing Empowerment Message',
        durationMinutes: 10,
        content: 'Reiterating that change is a continuous journey step-by-step.'
      }
    ],
    createdAt: '2026-08-18T10:00:00Z',
    updatedAt: '2026-08-18T10:00:00Z'
  }
];

export const mockStories: Story[] = [
  {
    id: 'story-1',
    title: 'The Second Chance of Marcus Vance',
    category: 'Second Chances',
    summary: 'After serving 12 years, Marcus committed to learning computer programming and now mentors underprivileged youth.',
    fullText: 'Marcus Vance spent over a decade reflecting on a single impulsive night that altered his life trajectory. Instead of surrender, he dedicated his prison hours to reading, discipline, and understanding human empathy...',
    authorOrSource: 'ReStart Case Studies',
    tags: ['Rehabilitation', 'Discipline', 'Mentorship'],
    moral: 'Your past explains where you have been, but it never defines where you can go.',
    estimatedReadTime: '6 mins',
    featured: true,
    createdAt: '2026-08-01T08:00:00Z'
  },
  {
    id: 'story-2',
    title: 'The Soldier Who Never Left a Teammate Behind',
    category: 'Discipline',
    summary: 'A story of endurance, accountability, and unwavering loyalty during extreme hardship.',
    fullText: 'Discipline is not doing what you want when it is easy; it is doing what is right when everything inside you wants to quit...',
    authorOrSource: 'Military Honor Archives',
    tags: ['Discipline', 'Teamwork', 'Responsibility'],
    moral: 'True strength is built in moments when giving up seems like the only option.',
    estimatedReadTime: '8 mins',
    featured: true,
    createdAt: '2026-08-05T08:00:00Z'
  },
  {
    id: 'story-3',
    title: 'Rebuilding the Broken Bridge to Family',
    category: 'Family',
    summary: 'How honest communication, patience, and consistent actions restored trust with children after 9 years apart.',
    fullText: 'Restoring family trust requires time and humility. When Ramesh was released, his daughter did not recognize him...',
    authorOrSource: 'Family Reconciliation Project',
    tags: ['Family', 'Forgiveness', 'Patience'],
    moral: 'Trust is not demanded through words; it is earned through quiet, consistent actions.',
    estimatedReadTime: '7 mins',
    featured: false,
    createdAt: '2026-08-10T08:00:00Z'
  }
];

export const mockVideos: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Understanding Consequences: The Ripple Effect of Actions',
    category: 'Emotional Intelligence',
    duration: '12:45',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop',
    videoUrl: 'https://cdn.kintsu.org/videos/ripple-effect.mp4',
    description: 'Visual analysis of how a single emotional choice impacts families, victims, communities, and self.',
    tags: ['Consequences', 'Empathy', 'Responsibility']
  },
  {
    id: 'vid-2',
    title: 'Mastering De-escalation & Conflict Resolution',
    category: 'Anger Management',
    duration: '15:20',
    thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop',
    videoUrl: 'https://cdn.kintsu.org/videos/deescalation-guide.mp4',
    description: 'Demonstrations of verbal calm-down tactics and body language control during tense interactions.',
    tags: ['De-escalation', 'Communication', 'Calm']
  }
];

export const mockBooks: BookItem[] = [
  {
    id: 'book-1',
    title: "Man's Search for Meaning",
    author: 'Viktor E. Frankl',
    category: 'Philosophy',
    description: 'Psychiatrist Viktor Frankl\'s memoir of suffering in concentration camps and his discover of logotherapy — finding purpose in all circumstances.',
    summaryText: 'Even in conditions of severe restriction, human beings retain the ultimate freedom: to choose one\'s attitude in any given set of circumstances.',
    audiobookAvailable: true,
    recommendedForStage: 'Active Healing',
    incentiveEligible: true
  },
  {
    id: 'book-2',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-improvement',
    description: 'A practical framework for improving every day through tiny 1% changes in habits, mindset, and routine.',
    summaryText: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    audiobookAvailable: true,
    recommendedForStage: 'Skills & Growth',
    incentiveEligible: true
  },
  {
    id: 'book-3',
    title: 'Long Walk to Freedom',
    author: 'Nelson Mandela',
    category: 'Biography',
    description: 'The inspiring autobiography of Nelson Mandela detailing 27 years of imprisonment and his journey to lead a nation with forgiveness.',
    summaryText: 'Resentment is like drinking poison and then hoping it will kill your enemies.',
    audiobookAvailable: true,
    recommendedForStage: 'Orientation',
    incentiveEligible: true
  }
];

export const mockParticipants: Participant[] = [
  {
    id: 'prt-101',
    nameIdentifier: 'Participant #101 (Block C)',
    block: 'Block C',
    rehabilitationStage: 'Active Healing',
    deEscalationScore: 84,
    empathyScore: 78,
    sessionsAttended: 14,
    booksCompleted: 3,
    caseWorkerNotes: [
      'Demonstrates high engagement during group discussions.',
      'Completed Victor Frankl reading assignment with thoughtful written reflection.'
    ],
    lastActiveDate: '2026-08-20'
  },
  {
    id: 'prt-102',
    nameIdentifier: 'Participant #102 (Block C)',
    block: 'Block C',
    rehabilitationStage: 'Skills & Growth',
    deEscalationScore: 68,
    empathyScore: 71,
    sessionsAttended: 9,
    booksCompleted: 1,
    caseWorkerNotes: [
      'Showed strong empathy cues but missed 2 de-escalation opportunities in roleplay practice.',
      'Recommended for the 5-4-3-2-1 Calm Routine follow-up.'
    ],
    lastActiveDate: '2026-08-21'
  },
  {
    id: 'prt-103',
    nameIdentifier: 'Participant #103 (Block A)',
    block: 'Block A',
    rehabilitationStage: 'Re-entry Prep',
    deEscalationScore: 92,
    empathyScore: 89,
    sessionsAttended: 22,
    booksCompleted: 5,
    caseWorkerNotes: [
      'Ready for digital payments and modern workplace orientation session.',
      'Active peer mentor during group discussions.'
    ],
    lastActiveDate: '2026-08-19'
  }
];

export const mockDiscussionGuides: DiscussionGuide[] = [
  {
    id: 'guide-1',
    topic: 'Consequences & Victim Empathy',
    suggestedQuestions: [
      'What consequences did the victim and their family face?',
      'How could this situation have been avoided before emotions took over?',
      'What would you have done differently with your current mindset?'
    ],
    instructorTips: [
      'Maintain a calm, non-judgmental tone.',
      'Encourage peer feedback after each response.',
      'Focus on accountability rather than shame.'
    ],
    targetOutcome: 'Develop perspective-taking and awareness of long-term emotional impact.'
  },
  {
    id: 'guide-2',
    topic: 'Handling Rejection & Frustration',
    suggestedQuestions: [
      'When someone disrespects you or rejects your effort, what is your initial thought?',
      'Is reacting aggressively actually giving that person control over your life?',
      'How does walking away demonstrate true power?'
    ],
    instructorTips: [
      'Use real-life examples from workplace and family settings.',
      'Roleplay both positive and negative responses.'
    ],
    targetOutcome: 'Empower participants to detach self-worth from external reactions.'
  }
];

export const mockResources: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'National Prisoner Rehabilitation & Re-entry Manual 2026',
    type: 'Government Standard',
    description: 'Official framework for vocational training, psycho-social support, and community reintegration.',
    content: 'Full official guidelines for correctional counselors and NGO partners.'
  },
  {
    id: 'res-2',
    title: 'Guide to Digital Literacy & Financial Services Post-Release',
    type: 'Tech & Digital Re-entry',
    description: 'Instructional material covering mobile banking, digital identification, and online job platforms.',
    content: 'Step-by-step curriculum for teaching modern digital tools in prison classrooms.'
  }
];
