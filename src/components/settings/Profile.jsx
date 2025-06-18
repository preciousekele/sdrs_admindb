import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  const handleEditProfileClick = () => {
    navigate("/edit-profile");
  };


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Adjust key as needed
        const response = await axios.get("https://sdars-backend.onrender.com/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div className="text-gray-400">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-red-500">Failed to load profile.</div>;
  }

  return (
    <SettingSection icon={User} title="Profile">
      <div className="flex flex-col sm:flex-row items-center mb-6">
        <img
          src="data:image/jpeg;base64,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"
          alt="Profile"
          className="rounded-full w-20 h-20 object-cover mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-100">{user.name}</h3>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
      </div>

      <button
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
        onClick={handleEditProfileClick}
      >
        Edit Profile
      </button>
    </SettingSection>
  );
};

export default Profile;
