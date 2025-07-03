import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducts } from '../../../redux/slices/productSlice'
import { getImageUrl } from '../../utils/axiosClient'
import axiosClient from '../../utils/axiosClient'

function ViewProduct() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [coordinates, setCoordinates] = useState(null)

  const products = useSelector(state => state.products.items)
  const status = useSelector(state => state.products.status)

  // ✅ Fetch products on component mount if not already fetched
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts())
    }
  }, [dispatch, status])

  const product = products.find(p => p._id === id)

  // Load Leaflet CSS and JS
  useEffect(() => {
    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const leafletCSS = document.createElement('link')
      leafletCSS.rel = 'stylesheet'
      leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
      leafletCSS.crossOrigin = ''
      document.head.appendChild(leafletCSS)
      
      // Add custom CSS to fix blurred map
      const customCSS = document.createElement('style')
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
        #leaflet-map {
          image-rendering: -webkit-optimize-contrast !important;
          image-rendering: crisp-edges !important;
          image-rendering: pixelated !important;
        }
        .leaflet-layer img {
          image-rendering: -webkit-optimize-contrast !important;
        }
      `
      document.head.appendChild(customCSS)
    }

    // Load Leaflet JS
    if (!window.L && !document.querySelector('script[src*="leaflet"]')) {
      const leafletJS = document.createElement('script')
      leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      leafletJS.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
      leafletJS.crossOrigin = ''
      leafletJS.onload = () => {
        // Small delay to ensure CSS is loaded
        setTimeout(() => setMapLoaded(true), 100)
      }
      leafletJS.onerror = () => setMapError(true)
      document.head.appendChild(leafletJS)
    } else if (window.L) {
      setMapLoaded(true)
    }
  }, [])

  // Geocode location using free Nominatim API with NIT Trichy bounds
  const geocodeLocation = async (locationName) => {
    try {
      // NIT Trichy coordinates and bounds
      const nitTrichyCenter = { lat: 10.7672, lng: 78.8172 }
      const searchRadius = 0.02 // About 2km radius
      
      // First try: Search with NIT Trichy + location name
      let response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName + ' NIT Trichy Tiruchirappalli Tamil Nadu India')}&limit=1&countrycodes=in`
      )
      let data = await response.json()
      
      // Second try: Search with broader Trichy area if first search fails
      if (!data || data.length === 0) {
        response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName + ' Tiruchirappalli Tamil Nadu India')}&limit=5&countrycodes=in`
        )
        data = await response.json()
      }
      
      // Third try: Search with just the location name but bounded to Tamil Nadu
      if (!data || data.length === 0) {
        response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName + ' Tamil Nadu India')}&limit=5&countrycodes=in`
        )
        data = await response.json()
      }
      
      if (data && data.length > 0) {
        // Find the result closest to NIT Trichy
        let bestResult = data[0]
        let minDistance = Infinity
        
        for (let result of data) {
          const lat = parseFloat(result.lat)
          const lng = parseFloat(result.lon)
          
          // Calculate distance from NIT Trichy center
          const distance = Math.sqrt(
            Math.pow(lat - nitTrichyCenter.lat, 2) + 
            Math.pow(lng - nitTrichyCenter.lng, 2)
          )
          
          if (distance < minDistance) {
            minDistance = distance
            bestResult = result
          }
        }
        
        const resultLat = parseFloat(bestResult.lat)
        const resultLng = parseFloat(bestResult.lon)
        
        // If result is too far from NIT Trichy, use NIT Trichy center as fallback
        const distanceFromNIT = Math.sqrt(
          Math.pow(resultLat - nitTrichyCenter.lat, 2) + 
          Math.pow(resultLng - nitTrichyCenter.lng, 2)
        )
        
        if (distanceFromNIT > searchRadius) {
          console.log(`Location "${locationName}" not found near NIT Trichy, using campus center`)
          return {
            lat: nitTrichyCenter.lat,
            lng: nitTrichyCenter.lng,
            displayName: `${locationName} (Near NIT Trichy Campus)`,
            isApproximate: true
          }
        }
        
        return {
          lat: resultLat,
          lng: resultLng,
          displayName: bestResult.display_name,
          isApproximate: false
        }
      }
      
      // Fallback to NIT Trichy center if nothing found
      console.log(`No results found for "${locationName}", using NIT Trichy center`)
      return {
        lat: nitTrichyCenter.lat,
        lng: nitTrichyCenter.lng,
        displayName: `${locationName} (NIT Trichy Campus)`,
        isApproximate: true
      }
      
    } catch (error) {
      console.error('Geocoding error:', error)
      // Final fallback to NIT Trichy
      return {
        lat: 10.7672,
        lng: 78.8172,
        displayName: `${locationName} (NIT Trichy Campus)`,
        isApproximate: true
      }
    }
  }

  // Initialize map when everything is ready
  useEffect(() => {
    if (mapLoaded && product && product.location && !coordinates) {
      initializeMap()
    }
  }, [mapLoaded, product, coordinates])

  const initializeMap = async () => {
    const coords = await geocodeLocation(product.location)
    
    if (coords) {
      setCoordinates(coords)
      
      // Clear any existing map
      const mapContainer = document.getElementById('leaflet-map')
      if (mapContainer) {
        mapContainer.innerHTML = ''
      }

      // Create the map with specific options to prevent blurring
      const map = window.L.map('leaflet-map', {
        preferCanvas: false,
        renderer: window.L.svg()
      }).setView([coords.lat, coords.lng], coords.isApproximate ? 16 : 17) // Zoom closer for campus locations

      // Add OpenStreetMap tiles with better quality settings
      window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        tileSize: 256,
        zoomOffset: 0,
        detectRetina: true
      }).addTo(map)

      // Force map to refresh after a short delay
      setTimeout(() => {
        map.invalidateSize()
      }, 100)

      // Custom marker icon with different color for approximate locations
      const markerColor = coords.isApproximate ? '#ffc107' : '#dc3545' // Yellow for approximate, red for exact
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
            ">${coords.isApproximate ? '📍' : '📍'}</div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      })

      // Add marker with popup
      const marker = window.L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(map)
      
      const popupContent = `
        <div style="padding: 10px; min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">${product.title}</h4>
          <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">
            <strong>📍 ${product.location}</strong>
          </p>
          ${coords.isApproximate ? 
            '<p style="margin: 0 0 5px 0; color: #ffc107; font-size: 12px; font-style: italic;">⚠️ Approximate location (NIT Trichy Campus)</p>' : 
            ''
          }
          <p style="margin: 0; color: #007bff; font-weight: bold; font-size: 16px;">₹${product.price}</p>
        </div>
      `
      
      marker.bindPopup(popupContent).openPopup()

    } else {
      setMapError(true)
    }
  }

  // --- Contact Button Handler ---
  const handleContact = async () => {
    try {
      await axiosClient.post(`/api/products/contact/${product._id}`);
    } catch (err) {
      // Optionally show an error or ignore
      console.error("Notification error:", err);
    }
    window.open(`https://wa.me/${product.phone}`, '_blank');
  };

  if (!product) return <h2 style={{ textAlign: 'center', margin: '50px 0' }}>Product not found.</h2>

  return (
    <section className="cta-secondary">
      <div className="cta-cover"></div>
      <div className="cta-container">
        <div className="cta-details">
          <h3>{product.title}</h3>
          <div className="first">
            <p>₹ {product.price}</p>
            <p><i className="fa fa-map-marker" title="location"></i>📍 {product.location}</p>
          </div>
          <div className="second">
            <p>🏷️ Category: {product.category}</p>
            <p><i className="fa fa-calendar" title="Posted at"></i>📅 {product.updatedAt.slice(0, 10)}</p>
          </div>
          <p> {product.description}</p>
          <button
            className="cta-btn"
            onClick={handleContact}
            type="button"
          >
            Contact
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
        <div className="cta-image">
          <img 
            src={getImageUrl(product.image)}
            alt={product.title}
            onError={(e) => {
              e.target.src = 'http://localhost:5000/uploads/default-avatar.png'
            }}
          />
        </div>
      </div>
      
      {/* OpenStreetMap Section */}
      {product.location && (
        <div className="map-section" style={{ 
          margin: '40px 0', 
          padding: '0 20px',
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <h4 style={{ 
            marginBottom: '20px', 
            color: '#333',
            textAlign: 'center',
            fontSize: '24px'
          }}>
            📍 Location
          </h4>
          
          {!mapLoaded && !mapError && (
            <div style={{
              height: '400px',
              background: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <p>Loading map...</p>
            </div>
          )}
          
          {mapError && (
            <div style={{
              height: '400px',
              background: '#f8f9fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              border: '1px solid #ddd',
              color: '#666',
              flexDirection: 'column'
            }}>
              <p>Unable to load map or find location.</p>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>
                Location: <strong>{product.location}</strong>
              </p>
            </div>
          )}
          
          <div
            id="leaflet-map"
            style={{
              height: '400px',
              width: '100%',
              borderRadius: '8px',
              border: '1px solid #ddd',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: mapLoaded && !mapError ? 'block' : 'none',
              imageRendering: 'crisp-edges',
              WebkitImageRendering: '-webkit-optimize-contrast'
            }}
          ></div>
          
          {coordinates && (
            <div style={{
              marginTop: '15px',
              textAlign: 'center',
              padding: '10px',
              background: coordinates.isApproximate ? '#fff3cd' : '#f8f9fa',
              borderRadius: '5px',
              border: `1px solid ${coordinates.isApproximate ? '#ffeaa7' : '#e9ecef'}`
            }}>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                <i className="fa fa-map-marker" style={{ color: coordinates.isApproximate ? '#ffc107' : '#dc3545', marginRight: '5px' }}></i>
                {product.location}
                {coordinates.isApproximate && (
                  <span style={{ 
                    marginLeft: '10px', 
                    fontSize: '12px', 
                    color: '#856404',
                    fontStyle: 'italic'
                  }}>
                    (Approximate - NIT Trichy Campus)
                  </span>
                )}
              </p>
              <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '12px' }}>
                Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default ViewProduct