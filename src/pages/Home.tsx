import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { BottomNav } from '@/components/BottomNav';
import { ChallengeCard } from '@/components/ChallengeCard';
import { AddChallengeCard } from '@/components/AddChallengeCard';
import { ProgressRing } from '@/components/ProgressRing';
import { XPDisplay } from '@/components/XPDisplay';
import { Button } from '@/components/ui/button';
import { ChallengeCategory } from '@/types';
import { cn } from '@/lib/utils';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
};

const getTodayKey = () => new Date().toISOString().split('T')[0];

const categories: { id: ChallengeCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'Todos', icon: '✨' },
  { id: 'leitura', label: 'Leitura', icon: '📖' },
  { id: 'exercicio', label: 'Exercício', icon: '🏃' },
  { id: 'meditacao', label: 'Meditação', icon: '🧘' },
  { id: 'culinaria', label: 'Culinária', icon: '👨‍🍳' },
  { id: 'habilidades', label: 'Habilidades', icon: '🎯' },
  { id: 'outros', label: 'Outros', icon: '📦' },
];

export const Home = () => {
  const { user, userChallenges, availableChallenges } = useApp();
  const [showAddChallenges, setShowAddChallenges] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'all'>('all');

  const todayKey = getTodayKey();
  const completedToday = userChallenges.filter(
    uc => uc.progress[todayKey]?.status === 'concluido'
  ).length;
  const totalToday = userChallenges.length;
  const progressPercent = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const addedChallengeIds = userChallenges.map(uc => uc.challengeId);
  const filteredAvailableChallenges = availableChallenges.filter(
    c => selectedCategory === 'all' || c.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-6 pb-16 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/80 text-sm">{getGreeting()}</p>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
          </div>
          <XPDisplay xp={user?.xp || 0} />
        </div>
      </header>

      {/* Progress Card */}
      <div className="px-4 -mt-10">
        <div className="bg-card rounded-2xl p-6 shadow-card animate-slide-up">
          <div className="flex items-center gap-6">
            <ProgressRing progress={progressPercent} size={100}>
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">{completedToday}</span>
                <span className="text-muted-foreground">/{totalToday}</span>
              </div>
            </ProgressRing>
            <div>
              <h2 className="font-bold text-lg">Progresso de hoje</h2>
              <p className="text-sm text-muted-foreground">
                {completedToday === totalToday && totalToday > 0
                  ? 'Parabéns! Você completou todos os desafios!'
                  : totalToday === 0
                    ? 'Adicione desafios à sua rotina'
                    : `Faltam ${totalToday - completedToday} desafios para concluir`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="px-4 mt-6">
        {/* Toggle between routine and add challenges */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            {showAddChallenges ? 'Adicionar Desafios' : 'Minha Rotina'}
          </h2>
          <Button
            variant={showAddChallenges ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowAddChallenges(!showAddChallenges)}
          >
            {showAddChallenges ? (
              'Ver Rotina'
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Adicionar
              </>
            )}
          </Button>
        </div>

        {/* Category filter (only when adding) */}
        {showAddChallenges && (
          <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all',
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border hover:border-primary'
                )}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Challenge list */}
        <div className="space-y-3">
          {showAddChallenges ? (
            filteredAvailableChallenges.length > 0 ? (
              filteredAvailableChallenges.map((challenge) => (
                <AddChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  isAdded={addedChallengeIds.includes(challenge.id)}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum desafio disponível nesta categoria
              </div>
            )
          ) : userChallenges.length > 0 ? (
            userChallenges.map((uc) => (
              <ChallengeCard key={uc.id} userChallenge={uc} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="font-bold text-lg mb-2">Nenhum desafio ainda</h3>
              <p className="text-muted-foreground mb-4">
                Adicione desafios à sua rotina para começar
              </p>
              <Button onClick={() => setShowAddChallenges(true)}>
                <Plus className="w-4 h-4" />
                Adicionar Desafios
              </Button>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
