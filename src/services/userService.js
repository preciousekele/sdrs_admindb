/**
 * Update an existing user
 * @param {number} id - User ID
 * @param {Object} userData - Updated user data
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Promise resolving to updated user
 */
export const updateUser = async (id, userData, token) => {
    try {
      const response = await fetch(`https://sdars-backend.onrender.com/api/users/edit-user/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error(`Error updating user: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error in updateUser service:", error);
      throw error;
    }
  };
  
  
  /**
   * Delete a user
   * @param {number} id - User ID to delete
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} - Promise resolving to deletion result
   */
  export const deleteUser = async (id, token) => {
    try {
      const response = await fetch(`https://sdars-backend.onrender.com/api/users/delete-user/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error in deleteUser service:", error);
      throw error;
    }
  };
  
