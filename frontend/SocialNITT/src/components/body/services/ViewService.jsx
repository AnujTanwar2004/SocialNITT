import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchServices } from "../../../redux/slices/serviceSlice";
import { getImageUrl } from "../../utils/axiosClient";
import axiosClient from "../../utils/axiosClient"; // ✅ Add this import

function ViewService() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const navigate = useNavigate(); // ✅ Fix the variable name
  const services = useSelector((state) => state.services.items);
  const status = useSelector((state) => state.services.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchServices());
    }
  }, [dispatch, status]);

  const service = services.find((s) => s._id === id);

  // Load Leaflet CSS and JS
  useEffect(() => {
    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const leafletCSS = document.createElement("link");
      leafletCSS.rel = "stylesheet";
      leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      leafletCSS.integrity =
        "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      leafletCSS.crossOrigin = "";
      document.head.appendChild(leafletCSS);

      // Add custom CSS to fix blurred map
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
        #leaflet-map-service {
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

    // Load Leaflet JS
    if (!window.L && !document.querySelector('script[src*="leaflet"]')) {
      const leafletJS = document.createElement("script");
      leafletJS.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      leafletJS.integrity =
        "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      leafletJS.crossOrigin = "";
      leafletJS.onload = () => {
        // Small delay to ensure CSS is loaded
        setTimeout(() => setMapLoaded(true), 100);
      };
      leafletJS.onerror = () => setMapError(true);
      document.head.appendChild(leafletJS);
    } else if (window.L) {
      setMapLoaded(true);
    }
  }, []);

  // Geocode location using free Nominatim API with NIT Trichy bounds
  const geocodeLocation = async (locationName) => {
    try {
      // NIT Trichy coordinates and bounds
      const nitTrichyCenter = { lat: 10.7672, lng: 78.8172 };
      const searchRadius = 0.02; // About 2km radius

      // First try: Search with NIT Trichy + location name
      let response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationName + " NIT Trichy Tiruchirappalli Tamil Nadu India"
        )}&limit=1&countrycodes=in`
      );
      let data = await response.json();

      // Second try: Search with broader Trichy area if first search fails
      if (!data || data.length === 0) {
        response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            locationName + " Tiruchirappalli Tamil Nadu India"
          )}&limit=5&countrycodes=in`
        );
        data = await response.json();
      }

      // Third try: Search with just the location name but bounded to Tamil Nadu
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

        // If result is too far from NIT Trichy, use NIT Trichy center as fallback
        const distanceFromNIT = Math.sqrt(
          Math.pow(resultLat - nitTrichyCenter.lat, 2) +
            Math.pow(resultLng - nitTrichyCenter.lng, 2)
        );

        if (distanceFromNIT > searchRadius) {
          console.log(
            `Location "${locationName}" not found near NIT Trichy, using campus center`
          );
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

      // Fallback to NIT Trichy center if nothing found
      console.log(
        `No results found for "${locationName}", using NIT Trichy center`
      );
      return {
        lat: nitTrichyCenter.lat,
        lng: nitTrichyCenter.lng,
        displayName: `${locationName} (NIT Trichy Campus)`,
        isApproximate: true,
      };
    } catch (error) {
      console.error("Geocoding error:", error);
      // Final fallback to NIT Trichy
      return {
        lat: 10.7672,
        lng: 78.8172,
        displayName: `${locationName} (NIT Trichy Campus)`,
        isApproximate: true,
      };
    }
  };

  // Initialize map when everything is ready
  useEffect(() => {
    if (mapLoaded && service && service.location && !coordinates) {
      initializeMap();
    }
  }, [mapLoaded, service, coordinates]);

  const initializeMap = async () => {
    const coords = await geocodeLocation(service.location);

    if (coords) {
      setCoordinates(coords);

      // Clear any existing map
      const mapContainer = document.getElementById("leaflet-map-service");
      if (mapContainer) {
        mapContainer.innerHTML = "";
      }

      // Create the map with specific options to prevent blurring
      const map = window.L.map("leaflet-map-service", {
        preferCanvas: false,
        renderer: window.L.svg(),
      }).setView([coords.lat, coords.lng], coords.isApproximate ? 16 : 17); // Zoom closer for campus locations

      // Add OpenStreetMap tiles with better quality settings
      window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        tileSize: 256,
        zoomOffset: 0,
        detectRetina: true,
      }).addTo(map);

      // Force map to refresh after a short delay
      setTimeout(() => {
        map.invalidateSize();
      }, 100);

      // Custom marker icon with different color for services (blue/purple based on urgency)
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

      // Get service type icon
      const getServiceIcon = (serviceType) => {
        switch (serviceType?.toLowerCase()) {
          case "needed":
            return "🔍";
          case "offering":
            return "🤝";
          default:
            return "⚙️";
        }
      };

      const markerColor = coords.isApproximate
        ? "#ffc107"
        : getMarkerColor(service.urgency);
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
            ">${getServiceIcon(service.serviceType)}</div>
          </div>
        `,
        className: "custom-marker",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });

      // Add marker with popup
      const marker = window.L.marker([coords.lat, coords.lng], {
        icon: customIcon,
      }).addTo(map);

      const popupContent = `
        <div style="padding: 10px; min-width: 220px;">
          <h4 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">${getServiceIcon(
            service.serviceType
          )} ${service.title}</h4>
          <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">
            <strong>📍 ${service.location}</strong>
          </p>
          <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">
            📋 ${service.category} | 🔄 ${service.serviceType}
          </p>
          <p style="margin: 0 0 5px 0; color: ${getMarkerColor(
            service.urgency
          )}; font-size: 14px; font-weight: bold;">
            🚨 ${service.urgency} Priority
          </p>
          ${
            coords.isApproximate
              ? '<p style="margin: 0 0 5px 0; color: #ffc107; font-size: 12px; font-style: italic;">⚠️ Approximate location (NIT Trichy Campus)</p>'
              : ""
          }
          <p style="margin: 0; color: #007bff; font-weight: bold; font-size: 16px;">💰 Budget: ₹${
            service.budget
          }</p>
        </div>
      `;

      marker.bindPopup(popupContent).openPopup();
    } else {
      setMapError(true);
    }
  };
   // --- Notification Trigger for Contact ---
  const getWhatsappNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  let cleanNumber = phone.replace(/[^0-9]/g, '');
  
  // Handle different Indian phone number formats
  if (cleanNumber.length === 10) {
    // 10-digit number - add India country code
    return `91${cleanNumber}`;
  } else if (cleanNumber.length === 11 && cleanNumber.startsWith('0')) {
    // 11-digit number starting with 0 - remove 0 and add 91
    return `91${cleanNumber.substring(1)}`;
  } else if (cleanNumber.length === 12 && cleanNumber.startsWith('91')) {
    // Already has India country code
    return cleanNumber;
  } else if (cleanNumber.length === 13 && cleanNumber.startsWith('091')) {
    // Remove leading 0 from country code
    return cleanNumber.substring(1);
  }
  
  // Default: add India country code
  return `91${cleanNumber}`;
};

const handleContact = async () => {
  try {
    await axiosClient.post(`/api/service/contact/${food._id}`);
  } catch (err) {
    console.error("Notification error:", err);
  }
  
  const whatsappNumber = getWhatsappNumber(food.phone);
  
  // Ensure we have a valid Indian number (minimum 12 digits: 91 + 10 digits)
  if (whatsappNumber && whatsappNumber.length >= 12) {
    window.open(`https://wa.me/+91 ${whatsappNumber}`, '_blank');
  } else {
    alert('Invalid phone number format. Please contact the seller directly.');
    console.warn('Invalid phone number:', food.phone, '→', whatsappNumber);
  }
};


   const handleFeedback = () => {
     try {
      navigate("/contact", {
        state: {
          serviceId: service._id, 
          serviceTitle: service.title,  
          feedbackType: "food",  
          prefilledMessage: `I would like to provide feedback about the service: ${service.title}`, // ✅ Fixed
        },
      });
    } catch (err) {
      console.error("Navigation error:", err);
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

  if (!service)
    return (
      <h2 style={{ textAlign: "center", margin: "50px 0" }}>
        Service not found.
      </h2>
    );

  return (
    <section className="cta-secondary">
      <div className="cta-cover"></div>
      <div className="cta-container">
        <div className="cta-details">
          <h3>{service.title}</h3>
          <div className="service-view-info">
            <div className="info-row">
              <span className="service-budget">
                💰 Budget: ₹ {service.budget}
              </span>
              <span
                className="service-urgency"
                style={{ color: getUrgencyColor(service.urgency) }}
              >
                🚨 {service.urgency} Priority
              </span>
            </div>
            <div className="info-row">
              <span>📋 Category: {service.category}</span>
              <span>🔄 Type: {service.serviceType}</span>
            </div>
            <div className="info-row">
              <span>📍 Location: {service.location}</span>
              <span>
                📅 Posted: {new Date(service.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="info-row">
              <span>👤 Posted by: {service.user?.name || "Anonymous"}</span>
              <span
                className="service-status"
                style={{
                  color: service.status === "Active" ? "#4CAF50" : "#666",
                  fontWeight: "bold",
                }}
              >
                📊 Status: {service.status}
              </span>
            </div>
          </div>
          <div className="service-description">
            <h4>Description:</h4>
            <p>{service.description}</p>

           
          </div>
           <button
              className="cta-btn"
              onClick={handleContact}  
              type="button"
            >
              Contact
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

            <button
              className="cta-btn"
              onClick={handleFeedback}  
              type="button"
            >
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
        {service.location && (
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
            ⚙️ Service Location
          </h4>

          {/* Map loader and error UI */}
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
                Location: <strong>{service.location}</strong>
              </p>
            </div>
          )}

          <div
            id="leaflet-map-service"
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
                      : getUrgencyColor(service.urgency),
                    marginRight: "5px",
                  }}
                ></i>
                {service.location}
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

export default ViewService;
