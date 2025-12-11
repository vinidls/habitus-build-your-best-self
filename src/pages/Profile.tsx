import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Bell, 
  Trophy, 
  History, 
  Info, 
  LogOut,
  ChevronRight,
  Camera,
  Mail
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { BottomNav } from '@/components/BottomNav';
import { XPDisplay } from '@/components/XPDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const menuItems = [
  { icon: User, label: 'Dados pessoais', id: 'personal' },
  { icon: Info, label: 'Sobre mim', id: 'about' },
  { icon: Bell, label: 'Notificações', id: 'notifications' },
  { icon: Trophy, label: 'Emblemas', id: 'badges' },
  { icon: History, label: 'Histórico', id: 'history' },
  { icon: Info, label: 'Sobre o app', id: 'app-info' },
];

export const Profile = () => {
  const { user, updateUser, logout, badges, userChallenges } = useApp();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');

  const handleSaveName = () => {
    if (editName.trim()) {
      updateUser({ name: editName.trim() });
      setIsEditing(false);
      toast({
        title: 'Perfil atualizado',
        description: 'Suas alterações foram salvas.',
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMenuClick = (id: string) => {
    switch (id) {
      case 'badges':
        navigate('/achievements');
        break;
      case 'notifications':
        toast({
          title: 'Notificações',
          description: 'Funcionalidade em desenvolvimento.',
        });
        break;
      default:
        toast({
          title: menuItems.find(m => m.id === id)?.label,
          description: 'Funcionalidade em desenvolvimento.',
        });
    }
  };

  // Calculate completed challenges history
  const completedHistory = userChallenges.flatMap(uc => 
    Object.entries(uc.progress)
      .filter(([_, p]) => p.status === 'concluido')
      .map(([date, p]) => ({
        date,
        challenge: uc.challenge,
        completedAt: p.completedAt,
      }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const unlockedBadges = badges.filter(b => b.unlocked);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with profile info */}
      <header className="bg-gradient-primary text-primary-foreground p-6 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center overflow-hidden border-4 border-primary-foreground/30">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-primary-foreground/80" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-card text-foreground flex items-center justify-center shadow-card">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User info */}
          <div className="flex-1">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <button className="text-left">
                  <h1 className="text-xl font-bold">{user?.name}</h1>
                  <p className="text-primary-foreground/70 text-sm flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {user?.email}
                  </p>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Nome</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Seu nome"
                  />
                  <Button onClick={handleSaveName} className="w-full">
                    Salvar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <XPDisplay xp={user?.xp || 0} size="sm" />
          </div>
        </div>
      </header>

      {/* Stats row */}
      <div className="px-4 -mt-4">
        <Card className="p-4 animate-slide-up">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{completedHistory.length}</p>
              <p className="text-xs text-muted-foreground">Concluídos</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{unlockedBadges.length}</p>
              <p className="text-xs text-muted-foreground">Emblemas</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{user?.objectives.length || 0}</p>
              <p className="text-xs text-muted-foreground">Objetivos</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Menu */}
      <main className="px-4 mt-6">
        <div className="space-y-2">
          {menuItems.map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => handleMenuClick(id)}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:bg-accent transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="flex-1 text-left font-medium">{label}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full mt-6"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Deslogar
        </Button>

        {/* App version */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Habitus v1.0.0
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
