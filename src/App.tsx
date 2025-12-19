import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { InstitutionProvider } from "@/contexts/InstitutionContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Classes from "./pages/Classes";
import Attendance from "./pages/Attendance";
import MarkAttendance from "./pages/MarkAttendance";
import RiskAnalysis from "./pages/RiskAnalysis";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import MyRecords from "./pages/MyRecords";
import Recommendations from "./pages/Recommendations";
import Resources from "./pages/Resources";
import UploadNotes from "./pages/UploadNotes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <InstitutionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/mark-attendance" element={<MarkAttendance />} />
              <Route path="/risk-analysis" element={<RiskAnalysis />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/my-records" element={<MyRecords />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/upload-notes" element={<UploadNotes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </InstitutionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
