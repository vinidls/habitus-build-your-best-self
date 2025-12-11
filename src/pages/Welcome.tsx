import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
};

export const Welcome = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center animate-slide-up">
        {/* Animated icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mx-auto animate-float">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute inset-0 w-24 h-24 rounded-full bg-primary/20 mx-auto animate-pulse-soft" />
        </div>

        {/* Greeting */}
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, <span className="text-gradient">{user?.name}</span>!
        </h1>

        {/* Main message */}
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          Explore o aplicativo, crie rotina, edite seus desafios, faça parte da comunidade e se divirta
        </p>

        {/* CTA Button */}
        <Button
          variant="gradient"
          size="xl"
          className="w-full"
          onClick={() => navigate('/home')}
        >
          Comece
          <ArrowRight className="w-5 h-5" />
        </Button>

        {/* Decorative elements */}
        <div className="flex justify-center gap-4 mt-12">
          {['📖', '🏃', '🧘', '👨‍🍳', '💪'].map((emoji, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-xl bg-card shadow-card flex items-center justify-center text-xl"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
