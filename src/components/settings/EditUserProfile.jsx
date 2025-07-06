import { useState, useEffect } from "react";
import { ArrowLeft, Check, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://sdars-backend.onrender.com/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log("API response:", data);

        if (data && data.name && data.email) {
          setUserData({
            name: data.name,
            email: data.email,
          });
        } else {
          throw new Error("User data is not available");
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong fetching profile");
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://sdars-backend.onrender.com/api/users/profile/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess(true);
      setError("");
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate("/settingspage");
    console.log("Navigate back to settings");
  };

  return (
    <div className="bg-gray-900 p-8 shadow-lg w-full max-w-lg mx-auto relative">
      <div className="max-w-md mx-auto px-4 py-8">
        <button
          onClick={goBack}
          className="flex items-center text-indigo-400 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Settings
        </button>

        {success && (
          <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded mb-4 flex items-center">
            <Check size={20} className="mr-2" />
            Profile updated successfully!
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-gray-900 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex space-x-4 justify-between items-center mb-4">
              <h2 className="text-lg text-white font-semibold">Edit Profile</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-indigo-300 hover:text-indigo-200"
                >
                  <Pencil size={18} />
                </button>
              )}
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {isEditing && (
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`${
                    loading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } text-white font-bold py-2 px-4 rounded transition duration-200 flex-1`}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
