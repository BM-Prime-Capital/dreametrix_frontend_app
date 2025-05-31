interface ApiOptions {
  url: string;
  data?: any;
  token?: string;
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Fonction générique pour effectuer une requête GET
 */
export async function fetchGet<T>({ url, token, headers = {} }: ApiOptions): Promise<ApiResponse<T>> {
  try {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: defaultHeaders,
    });

    const data = await response.json();

    return {
      data,
      status: response.status
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Une erreur est survenue',
      status: 500
    };
  }
}

/**
 * Fonction générique pour effectuer une requête POST
 */
export async function fetchPost<T>({ url, data, token, headers = {} }: ApiOptions): Promise<ApiResponse<T>> {
  try {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    return {
      data: responseData,
      status: response.status
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Une erreur est survenue',
      status: 500
    };
  }
}

/**
 * Fonction générique pour effectuer une requête PUT
 */
export async function fetchPut<T>({ url, data, token, headers = {} }: ApiOptions): Promise<ApiResponse<T>> {
  try {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    return {
      data: responseData,
      status: response.status
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Une erreur est survenue',
      status: 500
    };
  }
}

/**
 * Fonction générique pour effectuer une requête DELETE
 */
export async function fetchDelete<T>({ url, token, headers = {} }: ApiOptions): Promise<ApiResponse<T>> {
  try {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers: defaultHeaders,
    });

    const responseData = await response.json();

    return {
      data: responseData,
      status: response.status
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Une erreur est survenue',
      status: 500
    };
  }
} 