import {
  BarChart2,
  FileSearch,
  Menu,
  Settings,
  TrendingUp,
  Users,
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

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
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

          {/* Settings at the bottom */}
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
          </div>
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;