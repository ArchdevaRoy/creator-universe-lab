import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import CreatorBlueprint from "./pages/CreatorBlueprint";
import SeriesBuilder from "./pages/SeriesBuilder";
import ScriptStudio from "./pages/ScriptStudio";
import RepurposeLab from "./pages/RepurposeLab";
import ContentCalendar from "./pages/ContentCalendar";
import HookAnalyzer from "./pages/HookAnalyzer";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfileSettings from "./pages/settings/ProfileSettings";
import NotificationSettings from "./pages/settings/NotificationSettings";
import AccountSettings from "./pages/settings/AccountSettings";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Pricing from "./pages/Pricing";
import FeedPage from "./pages/FeedPage";
import LibraryPage from "./pages/LibraryPage";
import WalletPage from "./pages/WalletPage";
import ProfilePage from "./pages/ProfilePage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    {/* Public routes (no sidebar) */}
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
    <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />
    <Route path="/terms" element={<TermsConditions />} />

    {/* Protected routes (with sidebar layout) */}
    <Route
      path="/dashboard"
      element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>}
    />
    <Route
      path="/blueprint"
      element={<ProtectedRoute><AppLayout><CreatorBlueprint /></AppLayout></ProtectedRoute>}
    />
    <Route
      path="/series"
      element={<ProtectedRoute><AppLayout><SeriesBuilder /></AppLayout></ProtectedRoute>}
    />
    <Route
      path="/script"
      element={<ProtectedRoute><AppLayout><ScriptStudio /></AppLayout></ProtectedRoute>}
    />
    <Route
      path="/repurpose"
      element={<ProtectedRoute><AppLayout><RepurposeLab /></AppLayout></ProtectedRoute>}
    />
    <Route
      path="/calendar"
      element={<ProtectedRoute><AppLayout><ContentCalendar /></AppLayout></ProtectedRoute>}
    />
    <Route
      path="/analyzer"
      element={<ProtectedRoute><AppLayout><HookAnalyzer /></AppLayout></ProtectedRoute>}
    />
    <Route
      path="/analytics"
      element={<ProtectedRoute><AppLayout><AnalyticsPage /></AppLayout></ProtectedRoute>}
    />
    <Route
      path="/settings"
      element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>}
    />
    <Route
      path="/settings/profile"
      element={<ProtectedRoute><AppLayout><ProfileSettings /></AppLayout></ProtectedRoute>}
    />
    <Route
      path="/settings/notifications"
      element={<ProtectedRoute><AppLayout><NotificationSettings /></AppLayout></ProtectedRoute>}
    />
    <Route
      path="/settings/account"
      element={<ProtectedRoute><AppLayout><AccountSettings /></AppLayout></ProtectedRoute>}
    />
    <Route
      path="/feed"
      element={<ProtectedRoute><AppLayout><FeedPage /></AppLayout></ProtectedRoute>}
    />
    <Route
      path="/library"
      element={<ProtectedRoute><AppLayout><LibraryPage /></AppLayout></ProtectedRoute>}
    />
    <Route
      path="/wallet"
      element={<ProtectedRoute><AppLayout><WalletPage /></AppLayout></ProtectedRoute>}
    />
    <Route
      path="/profile/:id"
      element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>}
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
