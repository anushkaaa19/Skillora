import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import InstructorDashboard from "./pages/InstructorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CourseCreator from "./pages/CourseCreator";
import Certificate from "./pages/Certificate";
import React from "react";

const queryClient = new QueryClient();

const App = function() {
  return React.createElement(Provider, { store: store },
    React.createElement(QueryClientProvider, { client: queryClient },
      React.createElement(TooltipProvider, null,
        React.createElement(Toaster, null),
        React.createElement(Sonner, null),
        React.createElement(BrowserRouter, null,
          React.createElement(Routes, null,
            React.createElement(Route, { path: "/", element: React.createElement(Index) }),
            React.createElement(Route, { path: "/login", element: React.createElement(Login) }),
            React.createElement(Route, { path: "/signup", element: React.createElement(Signup) }),
            React.createElement(Route, { path: "/courses", element: React.createElement(Courses) }),
            React.createElement(Route, { path: "/study-room", element: React.createElement(StudyRoom) }),
            React.createElement(Route, { path: "/leaderboard", element: React.createElement(Leaderboard) }),
            React.createElement(Route, { path: "/doubts", element: React.createElement(AskDoubts) }),
            React.createElement(Route, { path: "/cart", element: React.createElement(Cart) }),
            React.createElement(Route, { path: "/instructor/dashboard", element: React.createElement(InstructorDashboard) }),
            React.createElement(Route, { path: "/instructor/courses/create", element: React.createElement(CourseCreator) }),
            React.createElement(Route, { path: "/student/dashboard", element: React.createElement(StudentDashboard) }),
            React.createElement(Route, { path: "/certificate/:courseId", element: React.createElement(Certificate) }),
            React.createElement(Route, { path: "*", element: React.createElement(NotFound) })
          )
        )
      )
    )
  );
};

export default App;