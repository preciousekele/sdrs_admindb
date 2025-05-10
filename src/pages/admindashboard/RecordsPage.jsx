import { useState, useEffect } from "react";
import {
  CheckCircle,
  ClipboardList,
  Clock,
  FilePlus2,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "../../components/common/StatCard";
import { Link } from "react-router-dom";
import RecordsTable from "../../components/cases/RecordTable";
import Header from "../../components/common/Header";
import { fetchRecords } from "../../services/recordService";

const RecordsPage = () => {
  const [stats, setStats] = useState({
    totalRecords: 0,
    offenses: {},
    pendingCount: 0,
    resolvedCount: 0,
    resolutionRate: 0,
  });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDeleteRecord = (deletedId) => {
    setRecords(prev => prev.filter(record => record.id !== deletedId));
  };
  
  // Fetch stats and records on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const token = localStorage.getItem("token");
  
        // Fetch stats
        const statsRes = await fetch("http://localhost:5000/api/records/stats", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!statsRes.ok) {
          throw new Error(`Error fetching stats: ${statsRes.status}`);
        }
  
        const statsData = await statsRes.json();
        setStats(statsData.stats);
  
        // Fetch records and SORT them immediately
        const recordsData = await fetchRecords(token);
        const sortedRecords = (recordsData.records || []).sort((a, b) => a.id - b.id);
  
        setRecords(sortedRecords);
  
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, []); // empty array means run once when component mounts
  

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="CASES RECORD" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 xl:px-20">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Cases"
            Icon={ClipboardList}
            value={stats.totalRecords || "0"}
            color="#6366F1"
          />
          <StatCard
            name="Resolved Cases"
            Icon={CheckCircle}
            value={stats.resolvedCount || "0"}
            color="#10B981"
          />
          <StatCard
            name="Pending Cases"
            Icon={Clock}
            value={stats.pendingCount || "0"}
            color="#FF0000"
          />
          <StatCard
            name="Cases Rate"
            Icon={TrendingUp}
            value={`${stats.resolutionRate || "0"}%`}
            color="#8B5CF6"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-end mb-6">
            <Link
              to="/add-record"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
            >
              <FilePlus2 className="h-4 w-4" />
              New Record
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-gray-300">Loading records...</p>
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
        ) : records.length === 0 ? (
          <div className="text-center py-10 text-gray-300">
            <p>No records found. Add a new record to get started.</p>
          </div>
        ) : (
          <RecordsTable records={records} 
          onDeleteRecord={handleDeleteRecord}
          />
        )}
         <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
        <div className="flex justify-end mb-6">
            <Link
              to="/deleted-records"
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" />
              View Deleted Records
            </Link>
          </div>
          </motion.div>
      </main>
      
    </div>
  );
};

export default RecordsPage;
