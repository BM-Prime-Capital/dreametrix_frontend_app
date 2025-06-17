/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

export async function getConversations(accessToken: string, tenantDomain: string) {
  console.log("accessToken", accessToken)
  console.log("tenantDomain",tenantDomain)
  
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  

  const url = `${tenantDomain}/bigbraain-chat/conversations/`;

  try {
    const response = await fetch(url, {
      method:'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("response", response)
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to access conversations.");
      } else {
        throw new Error("Error while fetching conversations.");
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
}

export async function updateConversationTitle(
  conversationId: string,
  newTitle: string,
  accessToken: string,
  tenantDomain: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantDomain}/api/chat/${conversationId}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ title: newTitle }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 403) {
        throw new Error("You don't have permission to update this conversation.");
      } else {
        throw new Error(`Error while updating conversation: ${JSON.stringify(errorData)}`);
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error updating conversation:", error);
    throw error;
  }
}

export async function deleteConversation(
  conversationId: string,
  accessToken: string,
  tenantDomain: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantDomain}/api/chat${conversationId}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 403) {
        throw new Error("You don't have permission to delete this conversation.");
      } else {
        throw new Error(`Error while deleting conversation: ${JSON.stringify(errorData)}`);
      }
    }

    return true;
  } catch (error: any) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
}

export async function clearConversations(accessToken: string, tenantDomain: string) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantDomain}/api/chat/clear`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 403) {
        throw new Error("You don't have permission to clear conversations.");
      } else {
        throw new Error(`Error while clearing conversations: ${JSON.stringify(errorData)}`);
      }
    }

    return true;
  } catch (error: any) {
    console.error("Error clearing conversations:", error);
    throw error;
  }
}