import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../utils/axiosClient';
import './Notification.css';

function NotificationBell() {
  const [show, setShow] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const bellRef = useRef(null);

  useEffect(() => {
    if (show) {
      axiosClient.get('/api/notifications').then(res => setNotifications(res.data));
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
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show]);

  const handleDeleteProduct = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosClient.delete(`/api/products/${itemId}`);
      setNotifications(notifications.filter(n => n.itemId !== itemId));
      alert("Product deleted successfully!");
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  const handleDismiss = (id) => {
    setNotifications(notifications.filter(n => n._id !== id));
  };

  return (
    <li className="notification-bell-container" ref={bellRef}>
      <button 
        className="notification-bell-button"
        onClick={() => setShow(s => !s)}
        aria-label="Show notifications"
      >
        <span role="img" aria-label="bell">🔔</span>
      </button>
      
      {show && (
        <div className="notification-dropdown">
          {/* Header */}
          <div className="notification-header">
            <span className="notification-title">
              <span className="notification-icon">🔔</span>
              Notifications
            </span>
            <button
              className="notification-close-btn"
              onClick={() => setShow(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Notification List */}
          <div className="notification-list-container">
            <ul className="notification-list">
              {notifications.length === 0 && (
                <li className="notification-empty">No notifications</li>
              )}
              {notifications.map(n => (
                <li key={n._id} className="notification-item">
                  <div className="notification-message">{n.message}</div>
                  <div className="notification-actions">
                    <button
                      className="notification-btn notification-dismiss-btn"
                      onClick={() => handleDismiss(n._id)}
                    >
                      Dismiss
                    </button>
                    {n.itemType === 'Product' && (
                      <button
                        className="notification-btn notification-delete-btn"
                        onClick={() => handleDeleteProduct(n.itemId)}
                      >
                        Delete Product
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}

export default NotificationBell;