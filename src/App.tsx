import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isOnboarding } = useApp();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (isOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isOnboarding } = useApp();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (!isOnboarding) {
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isOnboarding } = useApp();
  
  if (isAuthenticated && isOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />
      <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
