import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../common/Header';

const UserActivityLog = () => {
  const { userId } = useParams();  // Get userId from the route params
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserActivities = async () => {
      if (!userId) {
        setError('User ID is missing');
        return;
      }

      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`https://sdars-backend.onrender.com/api/users/user/${userId}/activity`, {
          
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setActivities(response.data);
      } catch (err) {
        setError('Failed to fetch user activities');
        console.error('Error fetching user activities:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserActivities();
    } else {
      setError('Invalid user ID');
    }
  }, [userId]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
        <div className="flex-1 overflow-auto relative z-10">
          <Header title="USER ACTIVITY LOG" />
    <div className="container mx-auto p-4">
      <div className="bg-gray-900 shadow-lg p-6">
        <p className="mt-2 text-lg text-gray-600"></p>
        
        <table className="min-w-full mt-6 table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300 bg-gray-800 border-b">Action</th>
              <th className="px-4 py-2 text text-sm font-medium text-gray-300 bg-gray-800 border-b">Timestamp</th>
              <th className="px-4 py-2 text text-sm font-medium text-gray-300 bg-gray-800 border-b">IP Address</th>
              <th className="px-4 py-2 text text-sm font-medium text-gray-300 bg-gray-800 border-b">User Agent</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.timestamp} className="border-b hover:bg-gray-500/50">
                <td className="px-4 py-2 text-sm text-gray-">{activity.action}</td>
                <td className="px-4 py-2 text-sm text-gray-">{new Date(activity.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-gray-">{activity.ipAddress}</td>
                <td className="px-4 py-2 text-sm text-gray-">{activity.userAgent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default UserActivityLog;
