import { Toaster } from "../src/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Courses from "./pages/Courses";
import StudyRoom from "./pages/StudyRoom";
import Leaderboard from "./pages/Leaderboard";
import AskDoubts from "./pages/AskDoubts";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import InstructorDashboard from "./pages/InstructorDasboard";
import StudentDashboard from "./pages/StudentDashboard";
import CourseCreator from "./pages/CourseCreator";
import Certificate from "./pages/Certificate";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/study-room" element={<StudyRoom />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/doubts" element={<AskDoubts />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
              <Route path="/instructor/courses/create" element={<CourseCreator />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/certificate/:courseId" element={<Certificate />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            git push --force        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
