/**
 * Fetch all records from the API
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Promise resolving to records data
 */
export const fetchRecords = async (token) => {
  try {
    const response = await fetch("https://sdars-backend.onrender.com/api/records", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching records: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchRecords service:", error);
    throw error;
  }
};

/**
 * Create a new record
 * @param {Object} recordData - The record data to create
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Promise resolving to created record
 */
export const createRecord = async (recordData, token) => {
  try {
    const response = await fetch("https://sdars-backend.onrender.com/api/records", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recordData),
    });

    if (!response.ok) {
      throw new Error(`Error creating record: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in createRecord service:", error);
    throw error;
  }
};

/**
 * Update an existing record
 * @param {number} id - Record ID
 * @param {Object} recordData - Updated record data
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Promise resolving to updated record
 */
export const updateRecord = async (id, recordData, token) => {
  try {
    const response = await fetch(`https://sdars-backend.onrender.com/api/records/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recordData),
    });

    if (!response.ok) {
      throw new Error(`Error updating record: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in updateRecord service:", error);
    throw error;
  }
};

/**
 * Delete a record
 * @param {number} id - Record ID to delete
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Promise resolving to deletion result
 */
export const deleteRecord = async (id, token) => {
  try {
    const response = await fetch(`https://sdars-backend.onrender.com/api/records/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Only parse once and return
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error deleting record`);
    }

    return data;
  } catch (error) {
    console.error("Error in deleteRecord service:", error);
    throw error;
  }
};


/**
 * Fetch statistics for the dashboard
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Promise resolving to stats data
 */
export const fetchStats = async (token) => {
  try {
    const response = await fetch("https://sdars-backend.onrender.com/api/records/stats", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching stats: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchStats service:", error);
    throw error;
  }
};
