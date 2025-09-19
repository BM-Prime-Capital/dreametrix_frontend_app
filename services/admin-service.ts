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
      const url = `${tenantDomain}/parents/approve-unlink/${requestId}/`;
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