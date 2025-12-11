import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserChallenge, Badge, Challenge, OnboardingStep } from '@/types';
import { defaultChallenges, defaultBadges } from '@/data/defaults';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarding: boolean;
  onboardingStep: OnboardingStep;
  userChallenges: UserChallenge[];
  availableChallenges: Challenge[];
  badges: Badge[];
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  setOnboardingStep: (step: OnboardingStep) => void;
  completeOnboarding: () => void;
  addChallengeToRoutine: (challengeId: string) => void;
  removeChallengeFromRoutine: (userChallengeId: string) => void;
  markChallengeComplete: (userChallengeId: string) => void;
  postponeChallenge: (userChallengeId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

const getTodayKey = () => {
  return new Date().toISOString().split('T')[0];
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('habitus_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isOnboarding, setIsOnboarding] = useState(() => {
    return localStorage.getItem('habitus_onboarding_complete') !== 'true';
  });
  
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('profile');
  
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>(() => {
    const saved = localStorage.getItem('habitus_user_challenges');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [badges, setBadges] = useState<Badge[]>(defaultBadges);

  useEffect(() => {
    if (user) {
      localStorage.setItem('habitus_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('habitus_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('habitus_user_challenges', JSON.stringify(userChallenges));
  }, [userChallenges]);

  const login = async (email: string, password: string) => {
    // Simulated login
    const newUser: User = {
      id: '1',
      name: '',
      email,
      xp: 0,
      objectives: [],
      createdAt: new Date(),
      notificationPreferences: {
        timesPerDay: 1,
        times: ['08:00'],
        daysOfWeek: [1, 2, 3, 4, 5],
      },
    };
    setUser(newUser);
  };

  const loginWithGoogle = async () => {
    // Simulated Google login
    const newUser: User = {
      id: '1',
      name: '',
      email: 'user@gmail.com',
      photoURL: 'https://ui-avatars.com/api/?name=User&background=2f9e77&color=fff',
      xp: 0,
      objectives: [],
      createdAt: new Date(),
      notificationPreferences: {
        timesPerDay: 1,
        times: ['08:00'],
        daysOfWeek: [1, 2, 3, 4, 5],
      },
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setUserChallenges([]);
    localStorage.removeItem('habitus_user');
    localStorage.removeItem('habitus_user_challenges');
    localStorage.removeItem('habitus_onboarding_complete');
    setIsOnboarding(true);
    setOnboardingStep('profile');
  };

  const register = async (email: string, password: string) => {
    await login(email, password);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const completeOnboarding = () => {
    setIsOnboarding(false);
    localStorage.setItem('habitus_onboarding_complete', 'true');
  };

  const addChallengeToRoutine = (challengeId: string) => {
    const challenge = defaultChallenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const newUserChallenge: UserChallenge = {
      id: `uc_${Date.now()}`,
      challengeId,
      challenge,
      schedule: {
        daysOfWeek: [1, 2, 3, 4, 5],
        times: ['08:00'],
      },
      progress: {
        [getTodayKey()]: { status: 'pendente' },
      },
    };

    setUserChallenges(prev => [...prev, newUserChallenge]);
  };

  const removeChallengeFromRoutine = (userChallengeId: string) => {
    setUserChallenges(prev => prev.filter(uc => uc.id !== userChallengeId));
  };

  const markChallengeComplete = (userChallengeId: string) => {
    const todayKey = getTodayKey();
    
    setUserChallenges(prev => prev.map(uc => {
      if (uc.id === userChallengeId) {
        return {
          ...uc,
          progress: {
            ...uc.progress,
            [todayKey]: { status: 'concluido', completedAt: new Date() },
          },
        };
      }
      return uc;
    }));

    // Add XP
    const challenge = userChallenges.find(uc => uc.id === userChallengeId);
    if (challenge && user) {
      const xpToAdd = challenge.challenge.xpReward;
      updateUser({ xp: user.xp + xpToAdd });
    }

    // Check for badge unlocks
    checkBadgeUnlocks();
  };

  const postponeChallenge = (userChallengeId: string) => {
    const todayKey = getTodayKey();
    
    setUserChallenges(prev => prev.map(uc => {
      if (uc.id === userChallengeId) {
        return {
          ...uc,
          progress: {
            ...uc.progress,
            [todayKey]: { status: 'adiado' },
          },
        };
      }
      return uc;
    }));
  };

  const checkBadgeUnlocks = () => {
    const completedToday = userChallenges.filter(uc => 
      uc.progress[getTodayKey()]?.status === 'concluido'
    ).length;

    setBadges(prev => prev.map(badge => {
      if (badge.unlocked) return badge;
      
      // First challenge badge
      if (badge.id === 'first_step' && completedToday >= 1) {
        return { ...badge, unlocked: true, unlockedAt: new Date() };
      }
      
      return badge;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isOnboarding: !!user && isOnboarding,
        onboardingStep,
        userChallenges,
        availableChallenges: defaultChallenges,
        badges,
        login,
        loginWithGoogle,
        logout,
        register,
        updateUser,
        setOnboardingStep,
        completeOnboarding,
        addChallengeToRoutine,
        removeChallengeFromRoutine,
        markChallengeComplete,
        postponeChallenge,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
