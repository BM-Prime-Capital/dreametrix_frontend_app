"use server";

export interface Notification {
  id: number;
  message: string;
  created_at: string;
  read: boolean;
}

/**
 * Fetch all notifications for the current user
 */
export async function getNotifications(
  tenantPrimaryDomain: string,
  accessToken: string
): Promise<Notification[]> {
  if (!tenantPrimaryDomain || !accessToken) {
    throw new Error("Tenant domain and access token are required.");
  }

  try {
    const url = new URL("/notifications/", tenantPrimaryDomain).toString();
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await safeParseJSON(response);
      const message =
        errorData?.message || "Failed to fetch notifications.";
      throw new Error(message);
    }

    const data = await response.json();
    return Array.isArray(data.results) ? data.results : [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Could not load notifications. Please try again.");
  }
}

/**
 * Mark a specific notification as read
 */
export async function markNotificationAsRead(
  tenantPrimaryDomain: string,
  accessToken: string,
  notificationId: number
): Promise<void> {
  if (!tenantPrimaryDomain || !accessToken || !notificationId) {
    throw new Error("All parameters are required to mark a notification as read.");
  }

  try {
    const url = new URL(`/notifications/${notificationId}/mark_as_read/`, tenantPrimaryDomain).toString();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await safeParseJSON(response);
      const message =
        errorData?.message || `Failed to mark notification ${notificationId} as read.`;
      throw new Error(message);
    }
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error);
    throw new Error("Could not mark notification as read. Please try again.");
  }
}

/**
 * Mark all notifications as read for the current user
 */
export async function markAllAsRead(
  tenantPrimaryDomain: string,
  accessToken: string
): Promise<void> {
  if (!tenantPrimaryDomain || !accessToken) {
    throw new Error("Tenant domain and access token are required.");
  }

  try {
    const url = new URL("/notifications/read_all/", tenantPrimaryDomain).toString();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await safeParseJSON(response);
      const message =
        errorData?.message || `Failed to mark all notifications as read.`;
      throw new Error(message);
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw new Error("Could not mark all notifications as read. Please try again.");
  }
}


// Helper to parse JSON safely
async function safeParseJSON(response: Response): Promise<any | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
