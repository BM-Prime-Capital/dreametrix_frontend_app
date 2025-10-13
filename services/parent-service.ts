/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

export async function getLinkedParents(
  tenantPrimaryDomain: string,
  accessToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/parents/student/linked-parents/`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to access this data.");
      } else {
        throw new Error("Error while fetching linked parents.");
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching linked parents:", error);
    throw error;
  }
}

export async function confirmParentLink(
  parentId: number,
  tenantPrimaryDomain: string,
  accessToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/parents/confirm-link/`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ parent_id: parentId }),
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to confirm this parent link.");
      } else {
        throw new Error("Error while confirming parent link.");
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error confirming parent link:", error);
    throw error;
  }
}

export async function requestUnlinkParent(
  parentId: number,
  tenantPrimaryDomain: string,
  accessToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/parents/request-unlink/`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ parent_id: parentId }),
    });

    if (!response.ok) {
      // console.log("Error requesting parent unlink:", response.json());
      if (response.status === 403) {
        throw new Error("You don't have permission to request unlinking from this parent.");
      } else {
        throw new Error("Error while requesting to unlink parent.");
      }
    }
    const body = await response.json();
    return body;
  } catch (error: any) {
    console.error("Error requesting parent unlink:", error);
    throw error;
  }
}

export async function getPendingParentLinks(
  tenantPrimaryDomain: string,
  accessToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/parents/student/pending-parent-links/`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.log(response);
      if (response.status === 403) {
        throw new Error("You don't have permission to access this data.");
      } else {
        throw new Error("Error while fetching pending parent links.");
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching pending parent links:", error);
    throw error;
  }
}

export async function rejectParentLink(
  parentId: number,
  tenantPrimaryDomain: string,
  accessToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/parents/reject-link/`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ parent_id: parentId }),
    });

    if (!response.ok) {
      console.log(response);
      if (response.status === 403) {
        throw new Error("You don't have permission to reject this parent link.");
      } else {
        throw new Error("Error while rejecting parent link.");
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error rejecting parent link:", error);
    throw error;
  }
}

export async function unlinkParent(
  parentId: number,
  tenantPrimaryDomain: string,
  accessToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/parents/unlink-requests/`;

  console.log("unlinkParent url:", url);
  console.log("unlinkParent parentId:", parentId);
  console.log("unlinkParent accessToken:", accessToken);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ parent_id: parentId }),
    });

    if (!response.ok) {
      console.log(response);
      if (response.status === 403) {
        throw new Error("You don't have permission to unlink from this parent.");
      } else {
        throw new Error("Error while unlinking parent.");
      }
    }
    const body = await response.json();
    console.log("unlinkParent response:", body);
    return body;
  } catch (error: any) {
    console.error("Error unlinking parent:", error);
    throw error;
  }
}

export async function getMyUnlinkRequests(
  tenantPrimaryDomain: string,
  accessToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/parents/unlink-requests/mine/`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to access this data.");
      } else {
        throw new Error("Error while fetching unlink requests.");
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching unlink requests:", error);
    throw error;
  }
}

export async function cancelUnlinkRequest(
  requestId: number,
  tenantPrimaryDomain: string,
  accessToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/parents/unlink-requests/${requestId}/cancel/`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to cancel this request.");
      } else if (response.status === 404) {
        throw new Error("Unlink request not found.");
      } else {
        throw new Error("Error while canceling unlink request.");
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error canceling unlink request:", error);
    throw error;
  }
}