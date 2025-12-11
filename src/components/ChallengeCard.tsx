import { Check, Clock, MoreHorizontal, X } from 'lucide-react';
import { UserChallenge } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';

interface ChallengeCardProps {
  userChallenge: UserChallenge;
  variant?: 'routine' | 'available';
}

const getTodayKey = () => new Date().toISOString().split('T')[0];

const difficultyColors = {
  facil: 'bg-success/10 text-success',
  medio: 'bg-warning/10 text-warning',
  dificil: 'bg-destructive/10 text-destructive',
};

const difficultyLabels = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
};

export const ChallengeCard = ({ userChallenge, variant = 'routine' }: ChallengeCardProps) => {
  const { markChallengeComplete, postponeChallenge, removeChallengeFromRoutine } = useApp();
  const { challenge, progress } = userChallenge;
  const todayProgress = progress[getTodayKey()];
  const isCompleted = todayProgress?.status === 'concluido';
  const isPostponed = todayProgress?.status === 'adiado';

  return (
    <Card 
      className={cn(
        'p-4 transition-all duration-300',
        isCompleted && 'bg-success/5 border-success/30',
        isPostponed && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
          isCompleted ? 'bg-success/20' : 'bg-accent'
        )}>
          {isCompleted ? <Check className="w-6 h-6 text-success" /> : challenge.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={cn(
                'font-semibold text-foreground',
                isCompleted && 'line-through text-muted-foreground'
              )}>
                {challenge.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                {challenge.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className={cn(
              'px-2 py-0.5 rounded-md text-xs font-medium',
              difficultyColors[challenge.difficulty]
            )}>
              {difficultyLabels[challenge.difficulty]}
            </span>
            {challenge.durationMinutes > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {challenge.durationMinutes} min
              </span>
            )}
            <span className="text-xs text-xp font-semibold">
              +{challenge.xpReward} XP
            </span>
          </div>
        </div>
      </div>

      {variant === 'routine' && !isCompleted && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
          <Button
            size="sm"
            variant="gradient"
            className="flex-1"
            onClick={() => markChallengeComplete(userChallenge.id)}
          >
            <Check className="w-4 h-4" />
            Concluir
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => postponeChallenge(userChallenge.id)}
          >
            <Clock className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => removeChallengeFromRoutine(userChallenge.id)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {isCompleted && (
        <div className="mt-4 pt-4 border-t border-success/20">
          <p className="text-sm text-success font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            Concluído hoje!
          </p>
        </div>
      )}
    </Card>
  );
};
