import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pencil, Save, X } from "lucide-react"; // Added Save and X icons
import { updateRecord } from "../../services/recordService";

const EditRecordForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const record = location.state?.record;

  if (!record) {
    navigate("/records");
  }

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    studentName: record?.studentName || "",
    matricNumber: record?.matricNumber || "",
    department: record?.department || "",
    offense: record?.offense || "",
    punishment: record?.punishment || "",
    date: record?.date || "",
    status: record?.status || "Pending", // Default to first option
  });

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }

      const { ...dataWithoutDate } = formData; // Ignore date for update
      await updateRecord(record.id, dataWithoutDate, token);

      console.log("Record updated successfully!");
      setIsEditing(false);

      // Go back to records page after update
      navigate("/records");
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      // Reset to original values
      studentName: record?.studentName || "",
      matricNumber: record?.matricNumber || "",
      offense: record?.offense || "",
      punishment: record?.punishment || "",
      date: record?.date || "",
      status: record?.status || "Pending",
    });
  };

  return (
    <div className="bg-gray-800 p-8 shadow-lg w-full max-w-lg mx-auto relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          {isEditing ? "Edit Record" : "Record Details"}
        </h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Cancel editing"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                type="submit"
                form="editForm"
                className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                aria-label="Save changes"
              >
                <Save className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={toggleEdit}
              className="p-2 text-gray-400 hover:text-indigo-400 transition-colors"
              aria-label="Edit record"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <form id="editForm" onSubmit={handleSubmit}>
        {/* Student Name */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Student Name</label>
          {isEditing ? (
            <input
              type="text"
              id="studentName"
              value={formData.studentName}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          ) : (
            <div className="p-2 bg-gray-700 rounded-md text-gray-300">
              {formData.studentName}
            </div>
          )}
        </div>

        {/* Matric Number */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Matric Number</label>
          {isEditing ? (
            <input
              type="text"
              id="matricNumber"
              value={formData.matricNumber}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          ) : (
            <div className="p-2 bg-gray-700 rounded-md text-gray-300">
              {formData.matricNumber}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Department</label>
          {isEditing ? (
            <input
              type="text"
              id="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          ) : (
            <div className="p-2 bg-gray-700 rounded-md text-gray-300">
              {formData.department}
            </div>
          )}
        </div>

        {/* Offense */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Offense</label>
          {isEditing ? (
            <input
              type="text"
              id="offense"
              value={formData.offense}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          ) : (
            <div className="p-2 bg-gray-700 rounded-md text-gray-300">
              {formData.offense}
            </div>
          )}
        </div>

        {/* Punishment */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Punishment</label>
          {isEditing ? (
            <input
              type="text"
              id="punishment"
              value={formData.punishment}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          ) : (
            <div className="p-2 bg-gray-700 rounded-md text-gray-300">
              {formData.punishment}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Date</label>
          {isEditing ? (
            <input
              type="date"
              id="date"
              value={formData.date ? formData.date.slice(0, 10) : ""}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          ) : (
            <div className="p-2 bg-gray-700 rounded-md text-gray-300">
              {new Date(formData.date).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-gray-400 mb-1">Status</label>
          {isEditing ? (
            <select
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Resolved">Resolved</option>
            </select>
          ) : (
            <div className="p-2 bg-gray-700 rounded-md text-gray-300">
              {formData.status}
            </div>
          )}
        </div>

        {isEditing && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditRecordForm;
