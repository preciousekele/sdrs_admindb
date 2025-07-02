import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trash2,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "../../components/common/Header";
import { Link } from "react-router-dom";

const DeletedRecordsPage = () => {
  const [deletedRecords, setDeletedRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State to force refresh

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;

  useEffect(() => {
    fetchDeletedRecords();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  useEffect(() => {
    console.log("Setting filtered records:", deletedRecords);
    setFilteredRecords(deletedRecords);
  }, [deletedRecords]);

  const fetchDeletedRecords = async () => {
    setLoading(true);
    setError(null);
    console.log("Fetching deleted records...");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://sdars-backend.onrender.com/api/records/deleted/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // Add cache control to prevent browser caching
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching deleted records: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Extract the records based on API structure
      let recordsArray = [];

      if (data.deletedRecords && Array.isArray(data.deletedRecords)) {
        // If the API returns data in the format { deletedRecords: [...] }
        recordsArray = data.deletedRecords;
      } else if (Array.isArray(data)) {
        // If the API directly returns an array
        recordsArray = data;
      } else if (data.records && Array.isArray(data.records)) {
        // Fallback for other formats
        recordsArray = data.records;
      }

      console.log("Processed records array:", recordsArray);
      setDeletedRecords(recordsArray);
    } catch (error) {
      console.error("Error loading deleted records:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://sdars-backend.onrender.com/api/records/restore/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error restoring record: ${response.status}`);
      }

      // Remove the restored record from the local state
      setDeletedRecords((prev) => prev.filter((record) => record.id !== id));

      // Show success message
      alert("Record restored successfully!");

      // Force a refresh to ensure we have the latest data
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error restoring record:", error);
      alert(`Failed to restore record: ${error.message}`);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Ensure we're filtering an array
    if (!Array.isArray(deletedRecords)) {
      console.error("deletedRecords is not an array:", deletedRecords);
      setFilteredRecords([]);
      return;
    }

    const filtered = deletedRecords.filter(
      (record) =>
        (record.studentName?.toLowerCase() || "").includes(term) ||
        (record.matricNumber?.toString() || "").includes(term) ||
        (record.level?.toLowerCase() || "").includes(term) ||
        (record.offense?.toLowerCase() || "").includes(term) ||
        (record.department?.toLowerCase() || "").includes(term) ||
        (record.status?.toLowerCase() || "").includes(term)
    );

    setFilteredRecords(filtered);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Calculate pagination values
  // Ensure filteredRecords is an array before trying to slice it
  const safeFilteredRecords = Array.isArray(filteredRecords)
    ? filteredRecords
    : [];
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = safeFilteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(safeFilteredRecords.length / recordsPerPage);

  // Pagination navigation handlers
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "under review":
      case "review":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Function to manually refresh data
  const handleManualRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="DELETED RECORDS" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-between mb-6">
            <Link
              to="/records"
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Records
            </Link>

            <button
              onClick={handleManualRefresh}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </button>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg p-6 border border-gray-700 mb-8 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-100 whitespace-nowrap">
              Deleted Disciplinary Records
            </h2>
            <div className="relative w-full sm:w-auto min-w-[200px]">
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
              <p className="mt-2 text-gray-300">Loading deleted records...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>Error: {error}</p>
              <button
                className="mt-2 text-blue-500 underline"
                onClick={fetchDeletedRecords}
              >
                Retry
              </button>
            </div>
          ) : safeFilteredRecords.length === 0 ? (
            <div className="text-center py-10 text-gray-300">
              <p>No deleted records found.</p>
              <p className="text-sm mt-2">
                {deletedRecords.length > 0
                  ? `Found ${deletedRecords.length} records but filter returned none.`
                  : "..."}
              </p>
              <button
                className="mt-2 text-blue-500 underline"
                onClick={handleManualRefresh}
              >
                Refresh Data
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      S/N
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Matric Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Offense
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Punishment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Deleted Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {currentRecords.map((record, index) => (
                    <tr
                      key={record.id}
                      className="hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {indexOfFirstRecord + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                        {record.studentName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {record.matricNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {record.level || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {record.department || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {record.offense || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {record.punishment || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(record.createdAt || record.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(record.deletedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusClass(
                            record.status
                          )}`}
                        >
                          {record.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <button
                          onClick={() => handleRestore(record.id)}
                          className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span>Restore</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination controls */}
          {safeFilteredRecords.length > recordsPerPage && (
            <div className="flex justify-center items-center mt-4 space-x-4">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <span className="text-gray-300 text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default DeletedRecordsPage;
