import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import OverviewPage from "./pages/admindashboard/Overview";
import Sidebar from "./components/common/Sidebar";
import UsersPage from "./pages/admindashboard/UsersPage";
import AnalyticsPage from "./pages/admindashboard/AnalyticsPage";
import SettingsPages from "./pages/admindashboard/SettingsPages";
import AddRecordForm from "./components/cases/AddRecordForm";
import EditRecordForm from "./components/cases/EditRecordForm";
import RecordsPage from "./pages/admindashboard/RecordsPage";
import UserActivityLog from "./components/users/userActivityLog";
import EditUserForm from "./components/users/EditUserForm";
import EditProfile from "./components/settings/EditUserProfile";
import ChangePassword from "./components/settings/EditPassword";
import Profile from "./components/settings/Profile";
import DeletedRecordsPage from "./components/cases/deletedRecordsPage";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get from URL params first (for initial login)
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get('token');
    const userFromURL = params.get('user');
    
    if (tokenFromURL && userFromURL) {
      // Store in localStorage for future use
      localStorage.setItem("token", tokenFromURL);
      localStorage.setItem("user", userFromURL);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }
    
    // Regular localStorage check for returning users
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("ADMIN APP: Reading token:", token);
    console.log("ADMIN APP: Reading user:", user);
    if (token && user.role === "admin") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center  bg-gray-900 text-gray-100 justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    window.location.href = "http://localhost:3000/login";
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* bg1 */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br" />
        <div className="absolute inset-0" />
      </div>

      {/* above the route because it should be seen on all pages */}
      {/* add toaster to the react: npm install react-hot-toast
        installing this when there's network
      */}
      {/* <Toaster position="top-right" reverseOrder={false} /> */}

      <Sidebar />
      <Routes>
        <Route index element={<OverviewPage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/users" element={<UsersPage />} />
        {/* <Route path="/orders" element={<OrdersPage />} /> */}
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPages />} />
        <Route path="/add-record" element={<AddRecordForm />} />
        <Route path="/edit-record/:id" element={<EditRecordForm />} />
        <Route path="/deleted-records" element={<DeletedRecordsPage />} />
        <Route path="/users/:userId/activity" element={<UserActivityLog />} />
        <Route path="/edit-user/:id" element={<EditUserForm />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/settings" element={<Profile />} />
        
      </Routes>
    </div>
  );
}

export default App;
