
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import JournalPage from "./pages/JournalPage";
import MoodCalendar from "./pages/MoodCalendar";
import WeeklySummary from "./pages/WeeklySummary";
import GoalsFeelingsPage from "./pages/GoalsFeelingsPage";
import CycleTrackingPage from "./pages/CycleTrackingPage";
import EmotionLockboxPage from "./pages/EmotionLockboxPage";
import AINotePage from "./pages/AINotePage";
import About from "./pages/About";
import Features from "./pages/Features";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/mood-calendar" element={<MoodCalendar />} />
              <Route path="/weekly-summary" element={<WeeklySummary />} />
              <Route path="/goals-feelings" element={<GoalsFeelingsPage />} />
              <Route path="/cycle-tracking" element={<CycleTrackingPage />} />
              <Route path="/emotion-lockbox" element={<EmotionLockboxPage />} />
              <Route path="/ai-note" element={<AINotePage />} />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
