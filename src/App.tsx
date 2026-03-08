import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
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
import AppearanceSettings from "./pages/settings/AppearanceSettings";
import Pricing from "./pages/Pricing";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/blueprint" element={<CreatorBlueprint />} />
            <Route path="/series" element={<SeriesBuilder />} />
            <Route path="/script" element={<ScriptStudio />} />
            <Route path="/repurpose" element={<RepurposeLab />} />
            <Route path="/calendar" element={<ContentCalendar />} />
            <Route path="/analyzer" element={<HookAnalyzer />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/profile" element={<ProfileSettings />} />
            <Route path="/settings/notifications" element={<NotificationSettings />} />
            <Route path="/settings/account" element={<AccountSettings />} />
            <Route path="/settings/appearance" element={<AppearanceSettings />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
