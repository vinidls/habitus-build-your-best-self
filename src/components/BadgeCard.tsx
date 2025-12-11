import { Lock } from 'lucide-react';
import { Badge as BadgeType } from '@/types';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
  badge: BadgeType;
}

const tierStyles = {
  bronze: 'from-badge-bronze/20 to-badge-bronze/5 border-badge-bronze/30',
  silver: 'from-badge-silver/20 to-badge-silver/5 border-badge-silver/30',
  gold: 'from-badge-gold/20 to-badge-gold/5 border-badge-gold/30',
};

export const BadgeCard = ({ badge }: BadgeCardProps) => {
  return (
    <div
      className={cn(
        'relative p-4 rounded-2xl border bg-gradient-to-br transition-all duration-300',
        badge.unlocked 
          ? tierStyles[badge.tier]
          : 'from-muted/50 to-muted/20 border-border opacity-60'
      )}
    >
      <div className="flex flex-col items-center text-center">
        <div className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3',
          badge.unlocked 
            ? 'bg-card shadow-card' 
            : 'bg-muted'
        )}>
          {badge.unlocked ? badge.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
        </div>
        
        <h3 className={cn(
          'font-bold text-sm',
          badge.unlocked ? 'text-foreground' : 'text-muted-foreground'
        )}>
          {badge.title}
        </h3>
        
        <p className="text-xs text-muted-foreground mt-1">
          {badge.unlocked ? badge.description : badge.criteria}
        </p>
        
        {badge.unlocked && badge.unlockedAt && (
          <span className="text-[10px] text-muted-foreground mt-2">
            Desbloqueado em {new Date(badge.unlockedAt).toLocaleDateString('pt-BR')}
          </span>
        )}
      </div>
    </div>
  );
};
