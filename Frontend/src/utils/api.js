const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Syncs Clerk user to backend MongoDB
 * @param {string} sessionToken - Clerk session token
 * @param {Object} user - Clerk user object
 */
export async function syncUserToBackend(sessionToken, user) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        clerk_id: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || user.firstName || "",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to sync user:", error);
      throw new Error(error.error || "Failed to sync user");
    }

    const data = await response.json();
    console.log("User synced successfully:", data);
    return data;
  } catch (error) {
    console.error("Error syncing user to backend:", error);
    throw error;
  }
}

