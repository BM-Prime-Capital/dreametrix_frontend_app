/* eslint-disable @typescript-eslint/no-explicit-any */
export async function requestApprobationList(
    accessToken: string,
    tenantDomain: string
  ) {
  
      try {
      const url = `${tenantDomain}/parents/admin/pending-link-requests/`
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        return {
          success: false,
          message: errorData || "Error Getting Request."
        };
      }
  
      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error("Error", error);
      return {
        success: false,
        message: "Error Getting Request."
      };
    }
  }

  export async function approveParentRequest(
    accessToken: string,
    tenantDomain: string,
    requestId: number
  ) {
    try {

        console.log("requestId", requestId); 
      const url = `${tenantDomain}/parents
      ${requestId}/`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        return {
          success: false,
          message: errorData || "Error approving request."
        };
      }
  
      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error("Error", error);
      return {
        success: false,
        message: "Error approving request."
      };
    }
  }


  export async function getStudentProfileInfo(
    accessToken: string,
    tenantDomain: string
  ) {
    try {

      const url = `${tenantDomain}/profiles/profile/`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        return {
          success: false,
          message: errorData || "Error approving request."
        };
      }
  
      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error("Error", error);
      return {
        success: false,
        message: "Error approving request."
      };
    }
  }

  export async function getTeacherData(
    accessToken: string,
    tenantDomain: string,
    id: string
  ) {
    try {

      const url = `${tenantDomain}/teachers/${id}/`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        return {
          success: false,
          message: errorData || "Error approving request."
        };
      }
  
      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error("Error", error);
      return {
        success: false,
        message: "Error approving request."
      };
    }
  }

  export async function getStudentData(
    accessToken: string,
    tenantDomain: string,
    id: string
  ) {
    try {

      const url = `${tenantDomain}/students/${id}/`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        return {
          success: false,
          message: errorData || "Error approving request."
        };
      }
  
      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error("Error", error);
      return {
        success: false,
        message: "Error approving request."
      };
    }
  }


  export async function updateStudentProfile(
    accessToken: string,
    tenantDomain: string,
    updateData: {
      user?: Record<string, any>;
      profile?: Record<string, any>;
    }
  ) {
    try {
      const url = `${tenantDomain}/profiles/profile/`;
      
      const response = await fetch(url, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updateData),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Profile update error:", errorData);
        return {
          success: false,
          message: errorData || "Error updating profile."
        };
      }
  
      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error("Error updating profile:", error);
      return {
        success: false,
        message: "Error updating profile."
      };
    }
  }

export const changePassword = async (
    accessToken: string,
    tenantDomain: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<any> => {
    const BASE_URL =`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}`;
    const response = await fetch(`${BASE_URL}/accounts/change-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to change password");
    }
  
    return await response.json();
  };