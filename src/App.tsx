import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PricingSection } from "./components/PricingSection";
import Home from "./pages/Home"; // Updated import
import AdminDashboard from "./pages/AdminDashboard"; // Updated import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<PricingSection />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;