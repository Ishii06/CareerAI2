import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Career from "./components/Career";
import Internship from "./components/Internship";
import Dashboard from "./components/Dashboard";
import Skills from "./components/Skills";
import Home from "./components/Home";
import ResumeBuilder from "./pages/ResumeBuilder";


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="mt-8 md:mt-16">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/career" element={<Career />} />
          <Route path="/internships" element={<Internship />} />
          <Route path="/skills" element={<Skills />} />
           <Route path="/resume-builder" element={<ResumeBuilder />} />
        </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
