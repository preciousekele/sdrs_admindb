import { useState } from "react";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";
import { createRecord } from "../../services/recordService";

const AddRecordForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    studentName: "",
    matricNumber: "",
    level: "100",
    department: "",
    offense: "",
    punishment: "Nil",
    date: "",
    status: "pending",
    punishmentDuration: "Nil",
    resumptionPeriod: "Nil",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate matricNumber as a number
      if (isNaN(parseInt(formData.matricNumber))) {
        throw new Error("Matric Number must be a valid number");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      await createRecord(formData, token);

      // Reset form
      setFormData({
        studentName: "",
        matricNumber: "",
        level: "100",
        department: "",
        offense: "",
        punishment: "Nil",
        date: "",
        status: "pending",
        punishmentDuration: "Nil",
        resumptionPeriod: "Nil",
      });

      // Navigate back to records page
      navigate("/records", {
        state: { success: true, message: "Record added successfully" },
      });
    } catch (err) {
      console.error("Failed to add record:", err);
      setError(err.message || "Failed to add record. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Add New Record" />

      {error && (
        <div className="bg-red-500 text-white p-3 mb-4 rounded">{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-900 p-6 text-white"
      >
        <div>
          <label className="block mb-1">Student Name</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Matric Number</label>
          <input
            type="number" // Changed to number type for better validation
            name="matricNumber"
            value={formData.matricNumber}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Level</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded p-2"
            required
          >
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Offense</label>
          <input
            type="text"
            name="offense"
            value={formData.offense}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Punishment</label>
          <input
            type="text"
            name="punishment"
            value={formData.punishment}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Duration of Punishment</label>
          <input
            type="text"
            name="punishmentDuration"
            value={formData.punishmentDuration}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded p-2"
            placeholder="e.g. 2 months or First Semester"
          />
        </div>

        <div>
          <label className="block mb-1">Resumption Period</label>
          <input
            type="text"
            name="resumptionPeriod"
            value={formData.resumptionPeriod}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded p-2"
            placeholder="e.g. Second Semester or Next Session"
          />
        </div>

        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded p-2"
          >
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="review">Under Review</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Record"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/records")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecordForm;
