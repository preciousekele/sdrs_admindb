import { useEffect, useState } from "react";
import { User, User2, UserCheck, UsersIcon } from "lucide-react";
import Header from "../../components/common/Header";
import { motion } from "framer-motion";
import StatCard from "../../components/common/StatCard";
import UserTable from "../../components/users/UserTable";
const UsersPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    normalUsers: 0,
    activeUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch("https://sdars-backend.onrender.com/api/users/stats", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch user stats: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched stats:", data); 
        setStats(data);
      } catch (err) {
        console.error("Error fetching user stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const updateLastSeen = async () => {
      try {
        const token = localStorage.getItem("token");
        await fetch("https://sdars-backend.onrender.com/api/users/heartbeat", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        console.error("Error updating last seen:", err);
      }
    };
  
    // Run immediately and then every 2 minutes
    updateLastSeen();
    const interval = setInterval(updateLastSeen, 2 * 60 * 1000);
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="USERS" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8  xl:px-20">
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status" />
            <p className="mt-2 text-gray-300">Loading user stats...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p>Error: {error}</p>
            <button
              className="mt-2 text-blue-500 underline"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* STATS */}
            <motion.div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <StatCard
                name="Total Users"
                Icon={UsersIcon}
                value={stats.totalUsers}
                color="#6366F1"
              />
              <StatCard
                name="Admin Users"
                Icon={User}
                value={stats.adminUsers}
                color="#FFF"
              />
              <StatCard
                name="Normal Users"
                Icon={User2}
                value={stats.normalUsers}
                color="#F59E0B"
              />
              <StatCard
                name="Active Users"
                Icon={UserCheck}
                value={stats.activeUsers}
                color="#22C55E"
              />
            </motion.div>

            {/* TABLE */}
            <UserTable />

            {/* CHARTS */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <UserGrowthChart />
              <UserActivityHeatmap />
              <UserDemographicsChart />
            </div> */}
          </>
        )}
      </main>
    </div>
  );
};

export default UsersPage;
