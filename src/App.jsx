import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/login";
import ForgotPassword from "./pages/login/forget";
import Dashboard from "./pages/dashboard/dashboard";
import AppLayout from "./components/sidebarcomponents";
import Customers from "./pages/customer/customer";
import Employee from "./pages/employees/employee";
import EmployeeDetail from "./pages/employees/empoyeedetails";
import Shopping from "./pages/order/shopping";
import ProfitLoss from "./pages/profitloss/profitloss"; 
import Expense from "./pages/expense/expense";
import DailyChart from "./pages/dailychart/dailychart";
import CosticAcid from "./pages/Costic-Asid/costicasid";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 🔥 MAIN LAYOUT */}
        <Route path="/" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />

          <Route path="employee">
            <Route index element={<Employee />} />
            <Route path=":id" element={<EmployeeDetail />} />
          </Route>

          <Route path="shopping" element={<Shopping />} />
          <Route path="expense" element={<Expense />} />
          <Route path="daily-chart" element={<DailyChart />} />

          {/* ✅ FIXED */}
          <Route path="costic-asid" element={<CosticAcid />} />

          <Route path="/Profit-Loss" element={<AppLayout />}>
            <Route index element={<ProfitLoss />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
