import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchFoods } from "../../../redux/slices/foodSlice";
import { getImageUrl } from "../../utils/axiosClient";
import axiosClient from "../../utils/axiosClient";

function ViewFood() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  const foods = useSelector((state) => state.foods.items);
  const status = useSelector((state) => state.foods.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFoods());
    }
  }, [dispatch, status]);

  const food = foods.find((s) => s._id === id);

  // Load Leaflet CSS and JS
  useEffect(() => {
    if (!document.querySelector('link[href*="leaflet"]')) {
      const leafletCSS = document.createElement("link");
      leafletCSS.rel = "stylesheet";
      leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      leafletCSS.integrity =
        "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      leafletCSS.crossOrigin = "";
      document.head.appendChild(leafletCSS);
      const customCSS = document.createElement("style");
      customCSS.textContent = `
        .leaflet-container {
          font-family: inherit !important;
        }
        .leaflet-control-zoom {
          font-size: 14px !important;
        }
        .leaflet-popup-content {
          font-family: inherit !important;
        }
        #leaflet-map-food {
          image-rendering: -webkit-optimize-contrast !important;
          image-rendering: crisp-edges !important;
          image-rendering: pixelated !important;
        }
        .leaflet-layer img {
          image-rendering: -webkit-optimize-contrast !important;
        }
      `;
      document.head.appendChild(customCSS);
    }
    if (!window.L && !document.querySelector('script[src*="leaflet"]')) {
      const leafletJS = document.createElement("script");
      leafletJS.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      leafletJS.integrity =
        "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      leafletJS.crossOrigin = "";
      leafletJS.onload = () => {
        setTimeout(() => setMapLoaded(true), 100);
      };
      leafletJS.onerror = () => setMapError(true);
      document.head.appendChild(leafletJS);
    } else if (window.L) {
      setMapLoaded(true);
    }
  }, []);

  const geocodeLocation = async (locationName) => {
    try {
      const nitTrichyCenter = { lat: 10.7672, lng: 78.8172 };
      const searchRadius = 0.02;
      let response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationName + " NIT Trichy Tiruchirappalli Tamil Nadu India"
        )}&limit=1&countrycodes=in`
      );
      let data = await response.json();
      if (!data || data.length === 0) {
        response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            locationName + " Tiruchirappalli Tamil Nadu India"
          )}&limit=5&countrycodes=in`
        );
        data = await response.json();
      }
      if (!data || data.length === 0) {
        response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            locationName + " Tamil Nadu India"
          )}&limit=5&countrycodes=in`
        );
        data = await response.json();
      }
      if (data && data.length > 0) {
        let bestResult = data[0];
        let minDistance = Infinity;
        for (let result of data) {
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);
          const distance = Math.sqrt(
            Math.pow(lat - nitTrichyCenter.lat, 2) +
              Math.pow(lng - nitTrichyCenter.lng, 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            bestResult = result;
          }
        }
        const resultLat = parseFloat(bestResult.lat);
        const resultLng = parseFloat(bestResult.lon);
        const distanceFromNIT = Math.sqrt(
          Math.pow(resultLat - nitTrichyCenter.lat, 2) +
            Math.pow(resultLng - nitTrichyCenter.lng, 2)
        );
        if (distanceFromNIT > searchRadius) {
          return {
            lat: nitTrichyCenter.lat,
            lng: nitTrichyCenter.lng,
            displayName: `${locationName} (Near NIT Trichy Campus)`,
            isApproximate: true,
          };
        }
        return {
          lat: resultLat,
          lng: resultLng,
          displayName: bestResult.display_name,
          isApproximate: false,
        };
      }
      return {
        lat: nitTrichyCenter.lat,
        lng: nitTrichyCenter.lng,
        displayName: `${locationName} (NIT Trichy Campus)`,
        isApproximate: true,
      };
    } catch (error) {
      return {
        lat: 10.7672,
        lng: 78.8172,
        displayName: `${locationName} (NIT Trichy Campus)`,
        isApproximate: true,
      };
    }
  };

  useEffect(() => {
    if (mapLoaded && food && food.location && !coordinates) {
      initializeMap();
    }
    // eslint-disable-next-line
  }, [mapLoaded, food, coordinates]);

  const initializeMap = async () => {
    const coords = await geocodeLocation(food.location);
    if (coords) {
      setCoordinates(coords);
      const mapContainer = document.getElementById("leaflet-map-food");
      if (mapContainer) {
        mapContainer.innerHTML = "";
      }
      const map = window.L.map("leaflet-map-food", {
        preferCanvas: false,
        renderer: window.L.svg(),
      }).setView([coords.lat, coords.lng], coords.isApproximate ? 16 : 17);

      window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        tileSize: 256,
        zoomOffset: 0,
        detectRetina: true,
      }).addTo(map);

      setTimeout(() => {
        map.invalidateSize();
      }, 100);

      const getMarkerColor = (urgency) => {
        switch (urgency) {
          case "Urgent":
            return "#FF4444";
          case "High":
            return "#FF8800";
          case "Medium":
            return "#FFA500";
          case "Low":
            return "#4CAF50";
          default:
            return "#666";
        }
      };

      const markerColor = coords.isApproximate
        ? "#ffc107"
        : getMarkerColor(food.urgency);
      const customIcon = window.L.divIcon({
        html: `
          <div style="
            background-color: ${markerColor};
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid #fff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              color: white;
              font-size: 12px;
              transform: rotate(45deg);
              font-weight: bold;
            ">🍽️</div>
          </div>
        `,
        className: "custom-marker",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });

      const popupContent = `
        <div style="padding: 10px; min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">🍽️ ${
            food.title
          }</h4>
          <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">
            <strong>📍 ${food.location}</strong>
          </p>
          <p style="margin: 0 0 5px 0; color: ${getMarkerColor(
            food.urgency
          )}; font-size: 14px; font-weight: bold;">
            🚨 ${food.urgency} Priority
          </p>
          ${
            coords.isApproximate
              ? '<p style="margin: 0 0 5px 0; color: #ffc107; font-size: 12px; font-style: italic;">⚠️ Approximate location (NIT Trichy Campus)</p>'
              : ""
          }
          <p style="margin: 0; color: #007bff; font-weight: bold; font-size: 16px;">💰 Budget: ₹${
            food.budget
          }</p>
        </div>
      `;

      // ✅ Fix: Create marker variable before using it
      const marker = window.L.marker([coords.lat, coords.lng], {
        icon: customIcon,
      }).addTo(map);
      marker.bindPopup(popupContent).openPopup();
    } else {
      setMapError(true);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Urgent":
        return "#FF4444";
      case "High":
        return "#FF8800";
      case "Medium":
        return "#FFA500";
      case "Low":
        return "#4CAF50";
      default:
        return "#666";
    }
  };

  // --- Notification Trigger for Contact ---
  const getWhatsappNumber = (phone) => {
    if (!phone) return "";

    // Remove all non-digit characters
    let cleanNumber = phone.replace(/[^0-9]/g, "");

    // Handle different Indian phone number formats
    if (cleanNumber.length === 10) {
      // 10-digit number - add India country code
      return `91${cleanNumber}`;
    } else if (cleanNumber.length === 11 && cleanNumber.startsWith("0")) {
      // 11-digit number starting with 0 - remove 0 and add 91
      return `91${cleanNumber.substring(1)}`;
    } else if (cleanNumber.length === 12 && cleanNumber.startsWith("91")) {
      // Already has India country code
      return cleanNumber;
    } else if (cleanNumber.length === 13 && cleanNumber.startsWith("091")) {
      // Remove leading 0 from country code
      return cleanNumber.substring(1);
    }

    // Default: add India country code
    return `91${cleanNumber}`;
  };

  const handleContact = async () => {
    try {
      await axiosClient.post(`/api/foods/contact/${food._id}`);
    } catch (err) {
      console.error("Notification error:", err);
    }

    const whatsappNumber = getWhatsappNumber(food.phone);

    // ✅ Fixed WhatsApp URL format
    if (whatsappNumber && whatsappNumber.length >= 12) {
      window.open(`https://wa.me/${whatsappNumber}`, "_blank"); // ✅ Removed +91 and space
    } else {
      alert("Invalid phone number format. Please contact the seller directly.");
      console.warn("Invalid phone number:", food.phone, "→", whatsappNumber);
    }
  };

  // ✅ Add the missing handleFeedback function
  const handleFeedback = () => {
    try {
      navigate("/contact", {
        state: {
          foodId: food._id,
          foodTitle: food.title,
          feedbackType: "food",
          prefilledMessage: `I would like to provide feedback about the food: ${food.title}`,
        },
      });
    } catch (err) {
      console.error("Navigation error:", err);
    }
  };

  if (!food)
    return (
      <h2 style={{ textAlign: "center", margin: "50px 0" }}>Food not found.</h2>
    );

  return (
    <section className="cta-secondary">
      <div className="cta-cover"></div>
      <div className="cta-container">
        <div className="cta-details">
          <h3>{food.title}</h3>
          <div className="service-view-info">
            <div className="info-row">
              <span className="service-budget">💰 Budget: ₹ {food.budget}</span>
              <span
                className="service-urgency"
                style={{ color: getUrgencyColor(food.urgency) }}
              >
                🚨 {food.urgency} Priority
              </span>
            </div>
            <div className="info-row">
              <span>📍 Location: {food.location}</span>
              <span>
                📅 Posted: {new Date(food.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="info-row">
              <span>👤 Posted by: {food.user?.name || "Anonymous"}</span>
              <span
                className="service-status"
                style={{
                  color: food.status === "Active" ? "#4CAF50" : "#666",
                  fontWeight: "bold",
                }}
              >
                📊 Status: {food.status}
              </span>
            </div>
          </div>
          <div className="service-description">
            <h4>Description:</h4>
            <p>{food.description}</p>
          </div>
          <button className="cta-btn" type="button" onClick={handleContact}>
            Contact for Food
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
          <button className="cta-btn" onClick={handleFeedback} type="button">
            Feedback {/*Fixed spelling */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
       {/* adding map at this location not anywhere else */}  {food.location && (
        <div
          className="map-section"
          style={{
            margin: "40px 0",
            padding: "0 20px",
            maxWidth: "1200px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h4
            style={{
              marginBottom: "20px",
              color: "#333",
              textAlign: "center",
              fontSize: "24px",
            }}
          >
            🍽️ Food Location
          </h4>
          {!mapLoaded && !mapError && (
            <div
              style={{
                height: "400px",
                background: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            >
              <p>Loading map...</p>
            </div>
          )}
          {mapError && (
            <div
              style={{
                height: "400px",
                background: "#f8f9fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                border: "1px solid #ddd",
                color: "#666",
                flexDirection: "column",
              }}
            >
              <p>Unable to load map or find location.</p>
              <p style={{ fontSize: "14px", marginTop: "10px" }}>
                Location: <strong>{food.location}</strong>
              </p>
            </div>
          )}
          <div
            id="leaflet-map-food"
            style={{
              height: "400px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #ddd",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              display: mapLoaded && !mapError ? "block" : "none",
              imageRendering: "crisp-edges",
              WebkitImageRendering: "-webkit-optimize-contrast",
            }}
          ></div>
          {coordinates && (
            <div
              style={{
                marginTop: "15px",
                textAlign: "center",
                padding: "10px",
                background: coordinates.isApproximate ? "#fff3cd" : "#f8f9fa",
                borderRadius: "5px",
                border: `1px solid ${
                  coordinates.isApproximate ? "#ffeaa7" : "#e9ecef"
                }`,
              }}
            >
              <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                <i
                  className="fa fa-map-marker"
                  style={{
                    color: coordinates.isApproximate
                      ? "#ffc107"
                      : getUrgencyColor(food.urgency),
                    marginRight: "5px",
                  }}
                ></i>
                {food.location}
                {coordinates.isApproximate && (
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "12px",
                      color: "#856404",
                      fontStyle: "italic",
                    }}
                  >
                    (Approximate - NIT Trichy Campus)
                  </span>
                )}
              </p>
              <p
                style={{ margin: "5px 0 0 0", color: "#888", fontSize: "12px" }}
              >
                Coordinates: {coordinates.lat.toFixed(6)},{" "}
                {coordinates.lng.toFixed(6)}
              </p>
            </div>
          )}
        </div>
      )}
      </div>
    
    </section>
  );
}

export default ViewFood;
