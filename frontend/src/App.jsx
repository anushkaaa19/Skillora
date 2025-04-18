import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home"; // Assuming Home component is in a pages folder
import "./App.css";

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex-col font-intern">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;