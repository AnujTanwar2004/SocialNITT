import axios from "axios";

// Use environment variable for baseURL
const API_URL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
});

// Variable to store the current token
let currentToken = null;

// Function to set token (called from outside)
export const setAxiosToken = (token) => {
  console.log(
    "🔧 setAxiosToken called with:",
    token ? "token present" : "no token"
  );
  currentToken = token;
 
  if (token) {
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("✅ Default Authorization header set");
  } else {
    delete axiosClient.defaults.headers.common["Authorization"];
    console.log("🗑️ Authorization header removed");
  }
};

// Function to clear token
export const clearAxiosToken = () => {
  console.log("🧹 clearAxiosToken called");
  currentToken = null;
  delete axiosClient.defaults.headers.common["Authorization"];
};

// Function to get current token (for debugging)
export const getCurrentToken = () => {
  console.log("🔍 getCurrentToken:", currentToken ? "present" : "missing");
  return currentToken;
};

// Request interceptor to add token to headers
axiosClient.interceptors.request.use(
  (config) => {
    // Double-check token is present
    const token =
      currentToken ||
      axiosClient.defaults.headers.common["Authorization"]?.replace(
        "Bearer ",
        ""
      );

    console.log("📤 REQUEST INTERCEPTOR:");
    console.log("  - URL:", config.url);
    console.log("  - Method:", config.method?.toUpperCase());
    console.log("  - Base URL:", config.baseURL);
    console.log("  - Full URL:", `${config.baseURL}${config.url}`);
    console.log("  - Current token:", currentToken ? "present" : "missing");
    console.log(
      "  - Default header:",
      axiosClient.defaults.headers.common["Authorization"]
        ? "present"
        : "missing"
    );

    if (token && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("  ✅ Token added to request");
    } else {
      console.log("  ❌ No valid token to add");
    }

    // Log the final authorization header
    console.log(
      "  - Final Auth Header:",
      config.headers.Authorization || "undefined"
    );

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosClient.interceptors.response.use(
  (response) => {
    console.log("📥 RESPONSE SUCCESS:", response.config.url, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    /* console.log("📥 RESPONSE ERROR:");
    console.log("  - URL:", originalRequest.url);
    console.log("  - Status:", error.response?.status || 0);
    console.log("  - Message:", error.response?.data?.msg || error.message); */

    // Handle network errors
    if (!error.response) {
      c/* onsole.log(
        "❌ NETWORK ERROR - Backend server not reachable at:",
        axiosClient.defaults.baseURL
      );
      console.log("  - Check if backend server is running");
      console.log(
        "  - Try accessing in browser:",
        `${axiosClient.defaults.baseURL}/`
      ); */
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
       /*  console.log("🔄 Token expired, trying to refresh..."); */
         const refreshResponse = await axios.post("/user/refresh_token", null, {
          baseURL: API_URL,
          withCredentials: true,
        });

        const newToken = refreshResponse.data.access_token;
/*         console.log("✅ Token refreshed successfully");
 */
        // Update the current token
        setAxiosToken(newToken);

        // Dispatch event to update Redux store
        window.dispatchEvent(
          new CustomEvent("tokenRefreshed", {
            detail: { token: newToken },
          })
        );

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);
        // Clear token
        clearAxiosToken();
        // Dispatch event to logout
        window.dispatchEvent(new CustomEvent("tokenExpired"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to get full image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return `${API_URL}/uploads/default-avatar.png`;
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export default axiosClient;
