import { X, Edit, Trash2, Download } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { deleteRecord } from "../../services/recordService";
import { downloadRecordPDF } from "../../utils/pdfUtils";

const RecordDetailsModal = ({
  record,
  isOpen,
  onClose,
  onDelete, // Parent passes this to refresh UI
}) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Close modal on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Navigate to Edit form
  const handleEdit = () => {
    navigate(`/edit-record/${record.id}`, { state: { record } });
    onClose(); // Close modal after navigating
  };

  // Confirm and process deletion
  const confirmDelete = async () => {
    if (
      !window.confirm(
        "ARE YOU SURE YOU WANT TO PERMANENTLY DELETE THIS RECORD? This will also update offense counts for other records of the same student."
      )
    )
      return;

    try {
      console.log("Confirm delete called for record:", record.id);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found!");
        alert("Authentication token not found. Please log in again.");
        return;
      }

      // Actually call the delete service
      const response = await deleteRecord(record.id, token);
      console.log("Delete response:", response);

      // Show success message
      alert("Record deleted successfully!");

      // Assuming deletion was successful, handle UI update
      if (onDelete) {
        console.log("Calling onDelete callback...");
        onDelete(record.id);
      }
      onClose(); // close the details modal
    } catch (error) {
      console.error("Error deleting record:", error);
      alert(`Failed to delete record: ${error.message || "Unknown error"}`);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString; // Return original if formatting fails
    }
  };

  if (!isOpen || !record) return null;

  return (
    <>
      {/* Main Details Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Modal content */}
        <div
          ref={modalRef}
          className="relative bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100">
                {record.studentName}
              </h2>
              <p className="text-gray-400">{record.matricNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Level</h3>
              <p className="text-lg text-gray-200">{record.level || "N/A"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Department
              </h3>
              <p className="text-lg text-gray-200">
                {record.department || "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Offense
              </h3>
              <p className="text-lg text-gray-200">{record.offense}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Punishment
              </h3>
              <p className="text-lg text-gray-200">{record.punishment}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Date</h3>
              <p className="text-lg text-gray-200">{formatDate(record.date)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
              <p className="text-lg text-gray-200">{record.status}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Offense Count
              </h3>
              <p className="text-lg text-gray-200">
                {record.offenseCount || 1}
                <span className="text-sm text-gray-400 ml-1">
                  {record.offenseCount === 1
                    ? "(1st offense)"
                    : record.offenseCount === 2
                    ? "(2nd offense)"
                    : record.offenseCount === 3
                    ? "(3rd offense)"
                    : ``}
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Punishment Duration
              </h3>
              <p className="text-lg text-gray-200">
                {record.punishmentDuration?.toLowerCase() !== "nil" &&
                record.punishmentDuration
                  ? `Effective from ${record.punishmentDuration}`
                  : "Nil"}
              </p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Resumption Date
              </h3>
              <p className="text-lg text-gray-200">
                {record.resumptionPeriod?.toLowerCase() !== "nil" &&
                record.resumptionPeriod
                  ? `Effective from ${record.resumptionPeriod}`
                  : "Nil"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t border-gray-700 pt-4">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors"
              aria-label="Edit record"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => downloadRecordPDF(record)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={confirmDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors"
              aria-label="Delete record"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordDetailsModal;
