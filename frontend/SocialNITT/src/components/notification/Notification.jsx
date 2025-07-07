import React, { useState, useEffect, useRef } from "react";
import axiosClient from "../utils/axiosClient";
import "./notification.css";

function NotificationBell() {
  const [show, setShow] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const bellRef = useRef(null);

  // Enhanced error handling and loading states
  useEffect(() => {
    if (show) {
      setLoading(true);
      axiosClient
        .get("/api/notifications")
        .then((res) => {
          setNotifications(res.data);
          setHasNew(res.data.some(n => !n.read));
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch notifications:", err);
          setNotifications([]);
          setLoading(false);
        });
    }
  }, [show]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setShow(false);
      }
    }
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  // Enhanced delete handlers with better UX
  const handleDeleteProduct = async (itemId, notificationId) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this product?\n\nThis action cannot be undone."))
      return;
    
    try {
      await axiosClient.delete(`/api/products/${itemId}`);
      setNotifications(notifications.filter((n) => n._id !== notificationId));
      
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.textContent = '✅ Product deleted successfully!';
      successDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white; padding: 12px 20px; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        font-weight: 600; animation: slideIn 0.3s ease;
      `;
      document.body.appendChild(successDiv);
      setTimeout(() => successDiv.remove(), 3000);
      
    } catch (err) {
      console.error("Delete error:", err);
      
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.textContent = '❌ Failed to delete product. Please try again.';
      errorDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: linear-gradient(135deg, #dc3545, #c82333);
        color: white; padding: 12px 20px; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        font-weight: 600;
      `;
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 3000);
    }
  };

  const handleDeleteService = async (itemId, notificationId) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this service?\n\nThis action cannot be undone."))
      return;
    
    try {
      await axiosClient.delete(`/api/services/${itemId}`);
      setNotifications(notifications.filter((n) => n._id !== notificationId));
      
      const successDiv = document.createElement('div');
      successDiv.textContent = '✅ Service deleted successfully!';
      successDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white; padding: 12px 20px; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        font-weight: 600;
      `;
      document.body.appendChild(successDiv);
      setTimeout(() => successDiv.remove(), 3000);
      
    } catch (err) {
      console.error("Delete error:", err);
      
      const errorDiv = document.createElement('div');
      errorDiv.textContent = '❌ Failed to delete service. Please try again.';
      errorDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: linear-gradient(135deg, #dc3545, #c82333);
        color: white; padding: 12px 20px; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        font-weight: 600;
      `;
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 3000);
    }
  };

  const handleDeleteFood = async (itemId, notificationId) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this food item?\n\nThis action cannot be undone.")) 
      return;
    
    try {
      await axiosClient.delete(`/api/foods/${itemId}`);
      setNotifications(notifications.filter((n) => n._id !== notificationId));
      
      const successDiv = document.createElement('div');
      successDiv.textContent = '✅ Food item deleted successfully!';
      successDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white; padding: 12px 20px; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        font-weight: 600;
      `;
      document.body.appendChild(successDiv);
      setTimeout(() => successDiv.remove(), 3000);
      
    } catch (err) {
      console.error("Delete error:", err);
      
      const errorDiv = document.createElement('div');
      errorDiv.textContent = '❌ Failed to delete food item. Please try again.';
      errorDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: linear-gradient(135deg, #dc3545, #c82333);
        color: white; padding: 12px 20px; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        font-weight: 600;
      `;
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 3000);
    }
  };

  // Enhanced dismiss with smooth animation
  const handleDismiss = async (id) => {
    try {
      await axiosClient.patch(`/api/notifications/${id}/read`);
      
      // Smooth removal animation
      const notificationElement = document.querySelector(`[data-notification-id="${id}"]`);
      if (notificationElement) {
        notificationElement.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
          setNotifications(notifications.filter((n) => n._id !== id));
        }, 300);
      } else {
        setNotifications(notifications.filter((n) => n._id !== id));
      }
      
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      setNotifications(notifications.filter((n) => n._id !== id));
    }
  };

  // Clear all notifications
  const handleClearAll = async () => {
    if (notifications.length === 0) return;
    
    if (!window.confirm("🗑️ Clear all notifications?\n\nThis will mark all notifications as read."))
      return;
    
    try {
      await axiosClient.patch("/api/notifications/read-all");
      setNotifications([]);
      setHasNew(false);
    } catch (err) {
      console.error("Failed to clear all notifications:", err);
    }
  };

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <li className="notification-bell-container" ref={bellRef}>
      <button
        className={`notification-bell-button ${hasNew ? 'has-new' : ''}`}
        onClick={() => setShow((s) => !s)}
        aria-label={`Show notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        title={`${notifications.length} notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      >
        <span role="img" aria-label="notification bell">
          🔔
        </span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {show && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <span className="notification-title">
              <span className="notification-icon">🔔</span>
              Notifications
              {unreadCount > 0 && (
                <span style={{ 
                  fontSize: '12px', 
                  background: 'rgba(255,255,255,0.2)', 
                  padding: '2px 8px', 
                  borderRadius: '12px',
                  marginLeft: '8px'
                }}>
                  {unreadCount} new
                </span>
              )}
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {notifications.length > 0 && (
                <button
                  className="notification-close-btn"
                  onClick={handleClearAll}
                  title="Clear all notifications"
                  style={{ fontSize: '14px', padding: '4px 8px', borderRadius: '6px' }}
                >
                  Clear All
                </button>
              )}
              <button
                className="notification-close-btn"
                onClick={() => setShow(false)}
                aria-label="Close notifications"
                title="Close"
              >
                ×
              </button>
            </div>
          </div>

          <div className="notification-list-container">
            {loading ? (
              <div className="notification-loading">
                <div style={{ 
                  display: 'inline-block', 
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px'
                }}>
                  ⏳
                </div>
                Loading notifications...
              </div>
            ) : (
              <ul className="notification-list">
                {notifications.length === 0 && (
                  <li className="notification-empty">
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔕</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                      No notifications
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      You're all caught up!
                    </div>
                  </li>
                )}
                {notifications.map((n) => (
                  <li 
                    key={n._id} 
                    className={`notification-item ${!n.read ? 'unread' : ''}`}
                    data-notification-id={n._id}
                  >
                    <div className="notification-message">
                      {!n.read && <span className="notification-status unread"></span>}
                      {n.read && <span className="notification-status read"></span>}
                      {n.message}
                    </div>
                    
                    {n.createdAt && (
                      <div style={{ 
                        fontSize: '11px', 
                        color: '#666', 
                        marginBottom: '8px',
                        fontStyle: 'italic'
                      }}>
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    )}
                    
                    <div className="notification-actions">
                      <button
                        className="notification-btn notification-dismiss-btn"
                        onClick={() => handleDismiss(n._id)}
                      >
                        ✓ Dismiss
                      </button>
                      
                      {n.itemType === "Product" && n.itemId && (
                        <button
                          className="notification-btn notification-delete-btn"
                          onClick={() => handleDeleteProduct(n.itemId, n._id)}
                        >
                          🗑️ Delete Product
                        </button>
                      )}
                      
                      {n.itemType === "Service" && n.itemId && (
                        <button
                          className="notification-btn notification-delete-btn"
                          onClick={() => handleDeleteService(n.itemId, n._id)}
                        >
                          🗑️ Delete Service
                        </button>
                      )}
                      
                      {n.itemType === "Food" && n.itemId && (
                        <button
                          className="notification-btn notification-delete-btn"
                          onClick={() => handleDeleteFood(n.itemId, n._id)}
                        >
                          🗑️ Delete Food
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideOut {
          from { 
            opacity: 1; 
            transform: translateX(0); 
            max-height: 200px; 
          }
          to { 
            opacity: 0; 
            transform: translateX(100%); 
            max-height: 0; 
            margin: 0;
            padding: 0;
          }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateX(100%); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
      `}</style>
    </li>
  );
}

export default NotificationBell;