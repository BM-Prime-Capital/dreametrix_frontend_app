

export async function updateParentStatusAction(
  parentId: number,
  status: 'active' | 'inactive',
  accessToken: string,
  tenantDomain: string,
) {

    try {
    const url = `${tenantDomain}/parents/validate/${parentId}/`;
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    //console.log("accessToken", accessToken)
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return {
        success: false,
        message: errorData || "Error updating parent status."
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
      message: "Network error while updating parent status."
    };
  }
}

export async function getParentList(
    accessToken: string,
    tenantDomain: string,
  ) {
  
      try {
      const url = `${tenantDomain}/parents/`;
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      //console.log("accessToken", accessToken)
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(url, {
        method: "GET",
        headers
        //body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        return {
          success: false,
          message: errorData || "Error Getting parent."
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
        message: "Error Getting parent."
      };
    }
  }

export async function getParentDetails(
    accessToken: string,
    tenantDomain: string,
    parentId: string
  ) {
  
      try {
      const url = `${tenantDomain}/parents/${parentId}/`;
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      //console.log("accessToken", accessToken)
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(url, {
        method: "GET",
        headers
        //body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        return {
          success: false,
          message: errorData || "Error Getting parent."
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
        message: "Error Getting parent."
      };
    }
  }
export async function getAllChildren(
accessToken: string,
tenantDomain: string,
) {

try {
const url = `${tenantDomain}/parents/parent/linked-students/`;
const headers: HeadersInit = {
"Content-Type": "application/json",
};

//console.log("accessToken", accessToken)
if (accessToken) {
headers["Authorization"] = `Bearer ${accessToken}`;
}

const response = await fetch(url, {
method: "GET",
headers
//body: JSON.stringify({}),
});

if (!response.ok) {
const errorData = await response.text();
return {
    success: false,
    message: errorData || "Error Getting Children."
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
message: "Error Getting Children."
};
}
}

export async function getPendingRelationship(
    accessToken: string,
    tenantDomain: string,
  ) {
  
      try {
      const url = `${tenantDomain}/parents/parent/pending-student-links/`;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      //console.log("accessToken", accessToken)
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(url, {
        method: "GET",
        headers
        //body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        return {
          success: false,
          message: errorData || "Error Getting Children."
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
        message: "Error Getting Children."
      };
    }
  }

export async function requestNewLink(
accessToken: string,
tenantDomain: string,
studentCode: string
) {
try {
    const url = `${tenantDomain}/parents/request-link/`;
    
    const headers: HeadersInit = {
    "Content-Type": "application/json",
    };
    
    if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
    }
    
    const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
        student_code: studentCode
    }),
    });

    if (!response.ok) {
    const errorData = await response.text();
    return {
        success: false,
        message: errorData || "Error requesting new link."
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
    message: "Network error while requesting new link."
    };
}
}

export async function requestUnlink(
    accessToken: string,
    tenantDomain: string,
    studentId: number,
    relationId: number
  ) {
    try {
      const url = `${tenantDomain}/parents/request-unlink/`;
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          student_id: studentId,
          relation_id: relationId
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        return {
          success: false,
          message: errorData || "Error requesting unlink."
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
        message: "Network error while requesting unlink."
      };
    }
  }



  