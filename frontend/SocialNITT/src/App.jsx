import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  setToken,
  login,
  logoutUser,
} from "./redux/slices/authSlice";
import { fetchProducts } from "./redux/slices/productSlice";
import { fetchServices } from "./redux/slices/serviceSlice";
import { fetchFoods } from "./redux/slices/foodSlice";
import { setAxiosToken, clearAxiosToken } from "./components/utils/axiosClient";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Body from "./components/body/Body";
import axios from "axios";
import Chatbot from "./components/ai/Chatbot";
import AdminDashboard from "./components/body/admin/AdminDashboard";

// Token Handler Component
function TokenHandler() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for access token in URL parameters (from DAuth callback)
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("access_token");

    if (token) {
      try {
        // Store token and set firstLogin flag
        localStorage.setItem("firstLogin", "true");

        // Dispatch the token to Redux
        dispatch(setToken(token));

        // Update axios token - CRITICAL STEP
        setAxiosToken(token);

        // IMPORTANT CHANGE: Fetch user data first, then set logged in
        dispatch(fetchUser())
          .unwrap() // This ensures we wait for the user data to load
          .then(() => {
            // Now we know user data is loaded, set login state
            dispatch(login());

            // NOW fetch all the required data
            dispatch(fetchProducts());
            dispatch(fetchServices());
            dispatch(fetchFoods());

            // Clean up URL (remove token from URL)
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);

            // Only navigate after data is loaded
            navigate("/");
          })
          .catch((error) => {
            console.error("Failed to fetch user data:", error);
            localStorage.removeItem("firstLogin");
          });
      } catch (error) {
        console.error("❌ Error handling DAuth token:", error);
      }
    }
  }, [location.search, dispatch, navigate]);

  return null; // This component doesn't render anything
}

function App() {
  const dispatch = useDispatch();
  const { token, user, isLogged } = useSelector((state) => state.auth);

  // Listen for token events from axiosClient
  useEffect(() => {
    const handleTokenRefreshed = (event) => {
      const { token: newToken } = event.detail;
      dispatch(setToken(newToken));
    };

    const handleTokenExpired = () => {
      dispatch(logoutUser());
      localStorage.removeItem("firstLogin");
      window.location.href = "/login";
    };

    window.addEventListener("tokenRefreshed", handleTokenRefreshed);
    window.addEventListener("tokenExpired", handleTokenExpired);

    return () => {
      window.removeEventListener("tokenRefreshed", handleTokenRefreshed);
      window.removeEventListener("tokenExpired", handleTokenExpired);
    };
  }, [dispatch]);

  // Sync token with axiosClient whenever it changes
  useEffect(() => {
    console.log(
      "🔄 Token sync effect triggered. Token:",
      token ? "present" : "missing"
    );
    if (token && token !== "null") {
      setAxiosToken(token);
      console.log("✅ Token synced to axios");
    } else {
      clearAxiosToken();
      console.log("🧹 Token cleared from axios");
    }
  }, [token]);

  // Handle refresh token on app load
  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin && !token) {
      console.log("🔄 Getting refresh token...");
      const getToken = async () => {
        try {
          console.log("🔄 Attempting to refresh token...");
          const res = await axios.post("/user/refresh_token", null);
          const refreshedToken = res.data.access_token;
          console.log("✅ Token refreshed successfully");

          dispatch(setToken(refreshedToken));
          // Update axios token
          setAxiosToken(refreshedToken);
        } catch (error) {
          console.error("❌ Error getting refresh token:", error);
          // Clear invalid session
          localStorage.removeItem("firstLogin");
          clearAxiosToken();
        }
      };
      getToken();
    }
  }, [dispatch, token]);

  // Fetch user data when token is available
  useEffect(() => {
    if (token && !isLogged) {
      console.log("✅ Token available, fetching user data...");
      dispatch(fetchUser()); // No need to pass token, axiosClient handles it
    }
  }, [token, isLogged, dispatch]);

  // Fetch app data when user is loaded
  useEffect(() => {
    if (isLogged && user && Object.keys(user).length > 0) {
      console.log("✅ User loaded, fetching app data...");
      dispatch(fetchProducts());
      dispatch(fetchServices());
      dispatch(fetchFoods());
    }
  }, [isLogged, user, dispatch]);

  return (
    <Router>
      <div className="App">
        <Header />
        <TokenHandler /> {/* Add DAuth token handler */}
        <Routes>
          <Route path="/*" element={<Body />} />
          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              user?.role === 1 ? <AdminDashboard /> : <Navigate to="/" />
            }
          />
        </Routes>
        <Chatbot />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
