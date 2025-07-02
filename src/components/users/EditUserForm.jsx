import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pencil, Save, X } from "lucide-react";
import { updateUser } from "../../services/userService"; // You need to define this service

const EditUserForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  if (!user) {
    navigate("/users");
  }

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "user",
    status: user?.status || "inactive",
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

      await updateUser(user.id, formData, token);
      console.log("User updated successfully!");
      setIsEditing(false);
      navigate("/users"); // redirect after save
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "user",
      status: user?.status || "inactive",
    });
  };

  return (
    <div className="bg-gray-800 p-8 shadow-lg w-full max-w-lg mx-auto relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          {isEditing ? "Edit User" : "User Details"}
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
                form="editUserForm"
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
              aria-label="Edit user"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <form id="editUserForm" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Name</label>
          {isEditing ? (
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-300"
              required
            />
          ) : (
            <div className="p-2 bg-gray-700 rounded-md text-gray-300">
              {formData.name}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Email</label>
          {isEditing ? (
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-300"
              required
            />
          ) : (
            <div className="p-2 bg-gray-700 rounded-md text-gray-300">
              {formData.email}
            </div>
          )}
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Role</label>
          {isEditing ? (
            <select
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-300"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          ) : (
            <div className="p-2 bg-gray-700 rounded-md text-gray-300">
              {formData.role}
            </div>
          )}
        </div>

        {/* Status */}
        {/* <div className="mb-6">
          <label className="block text-gray-400 mb-1">Status</label>
          {isEditing ? (
            <select
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-300"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          ) : (
            <div className="p-2 bg-gray-700 rounded-md text-gray-300">
              {formData.status}
            </div>
          )}
        </div> */}
        {isEditing && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditUserForm;
