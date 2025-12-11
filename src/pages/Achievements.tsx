import { Trophy, Zap, Target, TrendingUp } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { BottomNav } from '@/components/BottomNav';
import { BadgeCard } from '@/components/BadgeCard';
import { XPDisplay } from '@/components/XPDisplay';
import { Card } from '@/components/ui/card';

const getTodayKey = () => new Date().toISOString().split('T')[0];

export const Achievements = () => {
  const { user, badges, userChallenges } = useApp();
  
  // Calculate stats
  const totalCompleted = userChallenges.reduce((acc, uc) => {
    return acc + Object.values(uc.progress).filter(p => p.status === 'concluido').length;
  }, 0);

  const completedToday = userChallenges.filter(
    uc => uc.progress[getTodayKey()]?.status === 'concluido'
  ).length;

  const totalChallenges = userChallenges.length;
  const productivityPercent = totalChallenges > 0 
    ? Math.round((completedToday / totalChallenges) * 100) 
    : 0;

  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-6 pb-8 rounded-b-[2rem]">
        <h1 className="text-2xl font-bold mb-1">Conquistas</h1>
        <p className="text-primary-foreground/80">Acompanhe seu progresso</p>
      </header>

      {/* Stats Grid */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          <Card className="p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-xp/20 flex items-center justify-center mx-auto mb-2">
              <Zap className="w-6 h-6 text-xp" />
            </div>
            <p className="text-2xl font-bold">{user?.xp || 0}</p>
            <p className="text-sm text-muted-foreground">XP Total</p>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-bold">{totalCompleted}</p>
            <p className="text-sm text-muted-foreground">Desafios</p>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <p className="text-2xl font-bold">{productivityPercent}%</p>
            <p className="text-sm text-muted-foreground">Produtividade</p>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-badge-gold/20 flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-6 h-6 text-badge-gold" />
            </div>
            <p className="text-2xl font-bold">{unlockedBadges.length}</p>
            <p className="text-sm text-muted-foreground">Emblemas</p>
          </Card>
        </div>
      </div>

      {/* Badges Section */}
      <main className="px-4 mt-6">
        {unlockedBadges.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-badge-gold" />
              Desbloqueados
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {unlockedBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-lg font-bold mb-3 text-muted-foreground">
            A desbloquear
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {lockedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Achievements;
