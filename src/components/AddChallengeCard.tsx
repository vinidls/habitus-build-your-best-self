import { Plus, Clock } from 'lucide-react';
import { Challenge } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';

interface AddChallengeCardProps {
  challenge: Challenge;
  isAdded?: boolean;
}

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

export const AddChallengeCard = ({ challenge, isAdded }: AddChallengeCardProps) => {
  const { addChallengeToRoutine } = useApp();

  return (
    <Card className={cn(
      'p-4 transition-all duration-300',
      isAdded && 'opacity-50'
    )}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-2xl">
          {challenge.icon}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">
            {challenge.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
            {challenge.description}
          </p>

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

        <Button
          size="icon"
          variant={isAdded ? "secondary" : "default"}
          className="shrink-0"
          onClick={() => !isAdded && addChallengeToRoutine(challenge.id)}
          disabled={isAdded}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};
