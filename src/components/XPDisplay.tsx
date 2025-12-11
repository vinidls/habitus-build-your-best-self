import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XPDisplayProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const XPDisplay = ({ xp, size = 'md', showLabel = true }: XPDisplayProps) => {
  const sizeClasses = {
    sm: 'text-sm gap-1',
    md: 'text-base gap-1.5',
    lg: 'text-xl gap-2',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={cn(
      'flex items-center font-bold text-xp',
      sizeClasses[size]
    )}>
      <Zap className={iconSizes[size]} />
      <span>{xp.toLocaleString('pt-BR')}</span>
      {showLabel && <span className="text-muted-foreground font-medium">XP</span>}
    </div>
  );
};
