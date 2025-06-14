import { useState, useEffect } from "react";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Component mount effect
  useEffect(() => {
    console.log("ChangePassword component mounted");
    return () => {
      console.log("ChangePassword component unmounted");
    };
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    // Log the values for debugging
    console.log("current:", currentPassword);
    console.log("new:", newPassword);
    console.log("confirm:", confirmNewPassword);
    
    setError(null);
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }
      
      console.log("Sending request to change password...");
      
      // Prepare the payload as per your API requirements
      const payload = {
        currentPassword,
        newPassword,
        // Some APIs might also expect confirmPassword or other fields
        confirmNewPassword
      };
      
      console.log("Request payload:", JSON.stringify(payload));
      
      const response = await fetch("https://sdars-backend.onrender.com/api/users/profile/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Get complete response text for debugging
      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);
      
      // Try to parse as JSON if possible
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.log("Response is not JSON:", responseText);
        data = { error: "Invalid server response" };
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to change password. Server returned: " + response.status);
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password change error:", err);
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto  p-6 shadow-lg bg-gray-900 rounded-lg text-gray-100" style={{width: '100%', position: 'relative', zIndex: 1}}>
      <h2 className="text-2xl text-center font-semibold mb-60">Change Password</h2>

      {success && (
        <div className="mb-4 p-3 bg-green-800 border border-green-500 rounded text-green-200">
          Password changed successfully.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-800 border border-red-500 rounded text-red-200">
          {error}
        </div>
      )}

      <div>
        <div className="mb-4">
          <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 px-4 py-2 w-full bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-indigo-500 text-white"
            style={{cursor: 'text'}}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 px-4 py-2 w-full bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-indigo-500 text-white"
            style={{cursor: 'text'}}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmNewPassword" className="block text-sm font-medium mb-1">
            Confirm New Password
          </label>
          <input
            id="confirmNewPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 px-4 py-2 w-full bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-indigo-500 text-white"
            style={{cursor: 'text'}}
          />
        </div>

        <button
          id="submitButton"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 px-4 rounded font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
          style={{position: 'relative', zIndex: 2, cursor: 'pointer'}}
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
