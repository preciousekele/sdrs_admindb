import React, { useState, useEffect } from "react";
import {
  Edit,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import RecordDetailsModal from "./RecordDetailsModal";

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

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

const RecordsTable = ({ records, onDeleteRecord }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Filter out any records that might have isDeleted set to true
    // This ensures consistency between server state and UI
    const activeRecords = Array.isArray(records)
      ? records.filter((record) => !record.isDeleted)
      : [];

    console.log(
      `Filtered ${records?.length || 0} records to ${
        activeRecords.length
      } active records`
    );
    setFilteredRecords(activeRecords);
  }, [records]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Make sure we're only searching through non-deleted records
    const activeRecords = Array.isArray(records)
      ? records.filter((record) => !record.isDeleted)
      : [];

    const filtered = activeRecords.filter(
      (record) =>
        (record.studentName?.toLowerCase() || "").includes(term) ||
        (record.matricNumber?.toString() || "").includes(term) ||
        (record.offense?.toLowerCase() || "").includes(term) ||
        (record.department?.toLowerCase() || "").includes(term) ||
        (record.status?.toLowerCase() || "").includes(term)
    );

    setFilteredRecords(filtered);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Calculate pagination values
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

  // Modal handlers
  const openModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRecord(null);
    setIsModalOpen(false);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg p-6 border border-gray-700 mb-8 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-100 whitespace-nowrap">
          Disciplinary Records
        </h2>
        <div className="relative w-full sm:w-auto min-w-[200px]">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

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
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {currentRecords.length > 0 ? (
              currentRecords.map((record, index) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusClass(
                        record.status
                      )}`}
                    >
                      {record.status || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 flex space-x-3">
                    {/* Edit button */}
                    <Link
                      to={`/edit-record/${record.id}`}
                      state={{ record }}
                      className="text-blue-500 hover:text-blue-600"
                      title="Edit Record"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>

                    {/* View button */}
                    <button
                      onClick={() => openModal(record)}
                      className="text-gray-300 hover:text-white"
                      aria-label="View Details"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-300">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

      {/* Record Details Modal */}
      <RecordDetailsModal
        record={selectedRecord}
        isOpen={isModalOpen}
        onClose={closeModal}
        onDelete={onDeleteRecord}
      />
    </motion.div>
  );
};

export default RecordsTable;
