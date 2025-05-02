import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute"
import { useState } from "react";
import { useEffect } from "react";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    console.log("Local and session storage cleared.");
  }, [])

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/dashboard" element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <Dashboard />

          </PrivateRoute>
          } />
      </Routes>
    </div>
  );
}

export default App;
