import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { objectives, meditationMethods } from '@/data/defaults';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export const Onboarding = () => {
  const { user, updateUser, onboardingStep, setOnboardingStep, completeOnboarding } = useApp();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>(user?.objectives || []);
  const [meditationFrequency, setMeditationFrequency] = useState(3);
  const [meditationDuration, setMeditationDuration] = useState(10);
  const [meditationMethod, setMeditationMethod] = useState('guided');

  const handleProfileSubmit = () => {
    if (!name.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Por favor, insira seu nome.',
        variant: 'destructive',
      });
      return;
    }
    updateUser({ name: name.trim() });
    setOnboardingStep('objectives');
  };

  const handleObjectivesSubmit = () => {
    if (selectedObjectives.length === 0) {
      toast({
        title: 'Selecione ao menos um objetivo',
        description: 'Escolha pelo menos um objetivo para continuar.',
        variant: 'destructive',
      });
      return;
    }
    updateUser({ objectives: selectedObjectives });
    
    // Check if meditation is selected
    if (selectedObjectives.includes('Meditar diariamente')) {
      setOnboardingStep('meditation');
    } else {
      completeOnboarding();
      navigate('/welcome');
    }
  };

  const handleMeditationSubmit = () => {
    completeOnboarding();
    navigate('/welcome');
  };

  const toggleObjective = (obj: string) => {
    setSelectedObjectives(prev => 
      prev.includes(obj) 
        ? prev.filter(o => o !== obj)
        : [...prev, obj]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col p-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {['profile', 'objectives', 'meditation'].map((step, i) => (
          <div
            key={step}
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-300',
              onboardingStep === step 
                ? 'w-8 bg-primary' 
                : i < ['profile', 'objectives', 'meditation'].indexOf(onboardingStep)
                  ? 'bg-primary'
                  : 'bg-muted'
            )}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full animate-slide-up">
        {/* Profile Step */}
        {onboardingStep === 'profile' && (
          <>
            <div className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow">
              <Leaf className="w-10 h-10 text-primary-foreground" />
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-2">
              Como podemos te chamar?
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Vamos personalizar sua experiência
            </p>

            <Input
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-14 text-lg text-center"
              autoFocus
            />

            <Button
              variant="gradient"
              size="lg"
              className="w-full mt-6"
              onClick={handleProfileSubmit}
            >
              Continuar
              <ArrowRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Objectives Step */}
        {onboardingStep === 'objectives' && (
          <>
            <h1 className="text-2xl font-bold text-center mb-2">
              Quais são seus objetivos?
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              Selecione um ou mais objetivos
            </p>

            <div className="grid grid-cols-2 gap-3 w-full mb-6">
              {objectives.map((obj) => (
                <button
                  key={obj}
                  onClick={() => toggleObjective(obj)}
                  className={cn(
                    'p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 text-left',
                    selectedObjectives.includes(obj)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card hover:border-primary/50'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                      selectedObjectives.includes(obj)
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    )}>
                      {selectedObjectives.includes(obj) && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <span className="line-clamp-2">{obj}</span>
                  </div>
                </button>
              ))}
            </div>

            <Button
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={handleObjectivesSubmit}
            >
              Salvar
              <ArrowRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Meditation Step */}
        {onboardingStep === 'meditation' && (
          <>
            <div className="text-5xl mb-4">🧘</div>
            
            <h1 className="text-2xl font-bold text-center mb-2">
              Configurar Meditação
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              Vamos criar sua rotina de meditação
            </p>

            <div className="w-full space-y-6">
              {/* Frequency */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Quantas vezes por semana?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <button
                      key={num}
                      onClick={() => setMeditationFrequency(num)}
                      className={cn(
                        'flex-1 py-3 rounded-xl font-semibold transition-all',
                        meditationFrequency === num
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border hover:border-primary'
                      )}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Quanto tempo por sessão? (minutos)
                </label>
                <Input
                  type="number"
                  min={5}
                  max={60}
                  value={meditationDuration}
                  onChange={(e) => setMeditationDuration(Number(e.target.value))}
                  className="h-12"
                />
              </div>

              {/* Method */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Método preferido
                </label>
                <div className="space-y-2">
                  {meditationMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setMeditationMethod(method.id)}
                      className={cn(
                        'w-full p-3 rounded-xl border-2 text-left font-medium transition-all',
                        meditationMethod === method.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card hover:border-primary/50'
                      )}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant="gradient"
              size="lg"
              className="w-full mt-6"
              onClick={handleMeditationSubmit}
            >
              Concluir
              <Check className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
