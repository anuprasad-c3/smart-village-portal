import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Schemes from "./pages/Schemes";
import SchemeDetail from "./pages/SchemeDetail";
import ApplyScheme from "./pages/ApplyScheme";
import CitizenDashboard from "./pages/CitizenDashboard";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageSchemes from "./pages/admin/ManageSchemes";
import ManageApplications from "./pages/admin/ManageApplications";
import LocalHelp from "./pages/LocalHelp";
import NotFound from "./pages/NotFound";
import Updates from "./pages/Updates";
import ManageUpdates from "./pages/admin/ManageUpdate";

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/schemes/:id" element={<SchemeDetail />} />
            <Route path="/schemes/:id/apply" element={<ApplyScheme />} />
            <Route path="/dashboard" element={<CitizenDashboard />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/schemes" element={<ManageSchemes />} />
            <Route
              path="/admin/applications"
              element={<ManageApplications />}
            />
            <Route path="/help" element={<LocalHelp />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/updates" element={<Updates />} />

            <Route path="/admin/updates" element={<ManageUpdates />} />
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
