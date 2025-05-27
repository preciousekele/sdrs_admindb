import {
  BarChart2,
  FileSearch,
  Menu,
  Settings,
  Users,
  LogOut,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";

const MAIN_ITEMS = [
  { name: "Overview", icon: BarChart2, color: "#6366f1", href: "/" },
  { name: "Records", icon: FileSearch, color: "#8B5CF6", href: "/records" },
  { name: "Users", icon: Users, color: "#EC4899", href: "/users" },
];

const SETTINGS_ITEM = { 
  name: "Settings", 
  icon: Settings, 
  color: "#D3D3D3", 
  href: "/settings" 
};

const LOGOUT_ITEM = {
  name: "Logout",
  icon: LogOut,
  color: "#EF4444", 
};

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    // 1. Clear any auth tokens from localStorage/sessionStorage
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    
    setShowLogoutModal(false);
    
    // 4. Redirect to home page
    //pushed to github, this would be changed
    window.location.href = "https://preciousekele.github.io/sdars_frontend/#/login";
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <motion.div
        className="relative z-10 transition-all duration-300 ease-in-out flex-shrink-0"
        animate={{ width: isSidebarOpen ? 256 : 80 }}
      >
        <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
          >
            <Menu size={24} />
          </motion.button>

          <nav className="mt-8 flex flex-col flex-grow">
            {/* Main Items */}
            <div className="flex-grow">
              {MAIN_ITEMS.map((item) => (
                <Link key={item.href} to={item.href}>
                  <motion.div 
                    className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2"
                  >
                    <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          className="ml-4 whitespace-nowrap"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2, delay: 0.3 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Settings and Logout at the bottom */}
            <div className="mt-auto">
              <Link to={SETTINGS_ITEM.href}>
                <motion.div 
                  className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2"
                >
                  <SETTINGS_ITEM.icon size={20} style={{ color: SETTINGS_ITEM.color, minWidth: "20px" }} />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {SETTINGS_ITEM.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
              
              {/* Logout Button */}
              <motion.div 
                onClick={handleLogoutClick}
                className="flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 cursor-pointer"
              >
                <LOGOUT_ITEM.icon size={20} style={{ color: LOGOUT_ITEM.color, minWidth: "20px" }} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {LOGOUT_ITEM.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </nav>
        </div>
      </motion.div>
      
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 w-80 border border-gray-700 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Confirm Logout</h3>
              
            </div>
            
            <p className="text-gray-300 mb-6">Are you sure you want to log out?</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleLogoutCancel}
                className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
