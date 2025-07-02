import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
    const checkAuthentication = () => {
      try {
        // Try to get from URL params first (for initial login)
        const params = new URLSearchParams(window.location.search);
        const tokenFromURL = params.get('token');
        const userFromURL = params.get('user');
        
        console.log("ADMIN APP: Checking URL params...");
        console.log("Token from URL:", tokenFromURL ? "Present" : "Not found");
        console.log("User from URL:", userFromURL ? "Present" : "Not found");
        
        if (tokenFromURL && userFromURL) {
          try {
            // Decode and parse user data
            const decodedUser = JSON.parse(decodeURIComponent(userFromURL));
            console.log("ADMIN APP: Decoded user:", decodedUser);
            
            // Verify user is admin
            if (decodedUser.role !== "admin") {
              console.log("ADMIN APP: User is not admin, redirecting to login");
              redirectToLogin();
              return;
            }
            
            // Store in localStorage for future use
            localStorage.setItem("token", decodeURIComponent(tokenFromURL));
            localStorage.setItem("user", JSON.stringify(decodedUser));
            
            // Clean URL to remove sensitive data
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search.replace(/[?&](token|user)=[^&]*/g, '').replace(/^&/, '?').replace(/^\?$/, ''));
            
            console.log("ADMIN APP: Authentication successful via URL params");
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          } catch (parseError) {
            console.error("ADMIN APP: Error parsing URL user data:", parseError);
          }
        }
        
        // Regular localStorage check for returning users
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");
        
        console.log("ADMIN APP: Checking localStorage...");
        console.log("Token:", token ? "Present" : "Not found");
        console.log("User string:", userString ? "Present" : "Not found");
        
        if (token && userString) {
          try {
            const user = JSON.parse(userString);
            console.log("ADMIN APP: Parsed user from localStorage:", user);
            
            if (user.role === "admin") {
              console.log("ADMIN APP: Authentication successful via localStorage");
              setIsAuthenticated(true);
            } else {
              console.log("ADMIN APP: User is not admin");
              redirectToLogin();
              return;
            }
          } catch (parseError) {
            console.error("ADMIN APP: Error parsing user data from localStorage:", parseError);
            redirectToLogin();
            return;
          }
        } else {
          console.log("ADMIN APP: No valid authentication found");
          redirectToLogin();
          return;
        }
        
      } catch (error) {
        console.error("ADMIN APP: Authentication check error:", error);
        redirectToLogin();
        return;
      }
      
      setIsLoading(false);
    };
    
    checkAuthentication();
  }, []);
  
  const redirectToLogin = () => {
    // Clear any existing auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    console.log("ADMIN APP: Redirecting to login...");
    window.location.href = "https://mcu-sdars.vercel.app/login";
  };
  
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center bg-gray-900 text-gray-100 justify-center h-screen">
        Loading...
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center bg-gray-900 text-gray-100 justify-center h-screen">
        <div className="text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }
  
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        {/* bg1 */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br" />
          <div className="absolute inset-0" />
        </div>
        
        <Sidebar />
        <Routes>
          <Route index element={<OverviewPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPages />} />
          <Route path="/add-record" element={<AddRecordForm />} />
          <Route path="/edit-record/:id" element={<EditRecordForm />} />
          <Route path="/deleted-records" element={<DeletedRecordsPage />} />
          <Route path="/users/:userId/activity" element={<UserActivityLog />} />
          <Route path="/edit-user/:id" element={<EditUserForm />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/settingspage" element={<SettingsPages />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;