export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  objectives: string[];
  xp: number;
  createdAt: Date;
  notificationPreferences: {
    timesPerDay: number;
    times: string[];
    daysOfWeek: number[];
  };
}

export interface Challenge {
  id: string;
  title: string;
  category: ChallengeCategory;
  description: string;
  durationMinutes: number;
  difficulty: 'facil' | 'medio' | 'dificil';
  xpReward: number;
  icon: string;
}

export type ChallengeCategory = 
  | 'leitura' 
  | 'exercicio' 
  | 'culinaria' 
  | 'meditacao' 
  | 'habilidades' 
  | 'outros';

export interface UserChallenge {
  id: string;
  challengeId: string;
  challenge: Challenge;
  schedule: {
    daysOfWeek: number[];
    times: string[];
  };
  progress: Record<string, ChallengeProgress>;
}

export interface ChallengeProgress {
  status: 'concluido' | 'pendente' | 'adiado';
  completedAt?: Date;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold';
  unlocked: boolean;
  unlockedAt?: Date;
  criteria: string;
}

export type OnboardingStep = 'profile' | 'objectives' | 'meditation' | 'complete';
