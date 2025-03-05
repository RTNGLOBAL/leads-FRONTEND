import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VendorRegistration from './components/VendorForm';
import BuyerForm from './components/BuyerForm';
import Login from './components/Login';
import Signup from './components/signup';
import AdminDashboard from './Dashboard/AdminDashboard/AdminDashboard';
import VendorDashboard from './Dashboard/VendorDashboard/VendorDashboard';
import BuyerDashboard from './Dashboard/BuyerDashboard/BuyerDashboard';
import ForgetPassword from './components/forgetpasswor';
import ResetPassword from './components/ResetPassword';

const App = () => {
  return (
    <Router>
      <div style={{padding:"1rem" ,backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/admin-dashboard" element={<AdminDashboard/>} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard/>} />
        <Route path="/vendor-dashboard" element={<VendorDashboard/>} />
        <Route path="/vendor" element={<VendorRegistration />} />
          <Route path="/vendor/:email" element={<VendorRegistration />} />
          <Route path="/buyer" element={<BuyerForm />} />
          <Route path="/buyer/:email" element={<BuyerForm />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

