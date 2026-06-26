import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PaymentLogs from "./pages/PaymentLogs";
import DistrictReport from "./pages/DistrictReport";
import CategoryReport from "./pages/CategoryReport";
import OfficerRegister from "./pages/OfficerRegister";

import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLIC ROUTE (NO NAVBAR) */}
        <Route path="/" element={<Login />} />

        {/* ADMIN ROUTES (WITH NAVBAR) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="payments" element={<PaymentLogs />} />
          <Route path="districts" element={<DistrictReport />} />
          <Route path="categories" element={<CategoryReport />} />
          <Route path="officers" element={<OfficerRegister />} />
        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;