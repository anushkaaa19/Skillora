import { Toaster } from "../src/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Courses from "./pages/Courses";
import RoleProtectedRoute from './components/RoleProtectedRoute';

import Leaderboard from "./pages/Leaderboard";
import AskDoubts from "./pages/AskDoubts";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import InstructorDashboard from "./pages/InstructorDasboard";
import StudentDashboard from "./pages/StudentDashboard";
import CreateCourse from "./pages/CreateCourse";
import Certificate from "./pages/Certificate";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from './components/ProtectedRoute'; // add this at top
import CourseDetail from './pages/CourseDetail'; // or wherever it's located
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CheckEmailPage from "./pages/CheckEmail";
import CourseBuilder from './pages/CourseBuilder'; // ✅ import your component
import CoursePlayer from './pages/CoursePlayer';
import Profile from "./pages/Profile";
import CourseStructureEditor from "./pages/CourseStructureEditor"
const queryClient = new QueryClient();
function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
          <Routes>
          <Route path="/check-email" element={<CheckEmailPage />} />
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/leaderboard" element={
  <ProtectedRoute><Leaderboard /></ProtectedRoute>
} />

<Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/dashboard/course/:courseId" element={<CoursePlayer />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route
  path="/instructor/course-builder/:courseId"
  element={
    <RoleProtectedRoute allowedRoles={["Instructor"]}>
      <CourseBuilder />
    </RoleProtectedRoute>
  }
/>

            <Route path="/instructor/dashboard" element={
  <RoleProtectedRoute allowedRoles={["Instructor"]}>
    <InstructorDashboard />
  </RoleProtectedRoute>
} />

<Route path="/student/dashboard" element={
  <RoleProtectedRoute allowedRoles={["student","Student"]}>
    <StudentDashboard />
  </RoleProtectedRoute>
} />

<Route path="/instructor/courses/create" element={
  <RoleProtectedRoute allowedRoles={["Instructor"]}>
    <CreateCourse />
  </RoleProtectedRoute>
} />

<Route path="/instructor/course/:courseId/manage" element={
  <RoleProtectedRoute allowedRoles={["Instructor"]}>
    <CourseStructureEditor />
  </RoleProtectedRoute>
} />

<Route path="/cart" element={
  <RoleProtectedRoute allowedRoles={["student","Student"]}>
    <Cart />
  </RoleProtectedRoute>
} />

<Route path="/certificate/:courseId" element={
  <RoleProtectedRoute allowedRoles={["student","Student"]}>
    <Certificate />
  </RoleProtectedRoute>
} />

=            <Route path="*" element={<NotFound />} />

            <Route path="/doubts" element={<AskDoubts />} />
          </Routes>       
      </TooltipProvider>
    </QueryClientProvider>
  );
}
export default App;
