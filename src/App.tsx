import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PricingSection } from "./components/PricingSection";
import { Home } from "./pages/Home";
import { AdminDashboard } from "./pages/AdminDashboard"; // Import the AdminDashboard

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<PricingSection />} />
        <Route path="/admin" element={<AdminDashboard />} /> {/* Add the admin route */}
      </Routes>
    </Router>
  );
}

export default App;
