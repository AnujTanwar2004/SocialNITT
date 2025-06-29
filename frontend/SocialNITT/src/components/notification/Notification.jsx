import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../utils/axiosClient';

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
    <li style={{ position: 'relative', listStyle: 'none' }} ref={bellRef}>
      <button className='notification'
        onClick={() => setShow(s => !s)}
         
        aria-label="Show notifications"
        onMouseOver={e => {
          e.target.style.transform = "scale(1.08)";
          e.target.style.boxShadow = "0 6px 20px rgba(133, 14, 53, 0.3)";
        }}
        onMouseOut={e => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 4px 16px rgba(133, 14, 53, 0.2)";
        }}
      >
        <span role="img" aria-label="bell">🔔</span>
      </button>
      {show && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '56px',
            width: '340px',
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            zIndex: 10000,
            border: '1px solid #e1e5e9',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #850E35, #a91142)",
              color: "#fff",
              padding: "14px 18px",
              fontWeight: "600",
              fontSize: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "18px" }}>🔔</span>
              Notifications
            </span>
            <button
              onClick={() => setShow(false)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "20px",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                transition: "background 0.2s"
              }}
              onMouseOver={e => e.target.style.background = "rgba(255,255,255,0.1)"}
              onMouseOut={e => e.target.style.background = "none"}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          {/* Notification List */}
          <div style={{
            flex: 1,
            padding: "16px",
            background: "#f8f9fa",
            maxHeight: "260px",
            overflowY: "auto"
          }}>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {notifications.length === 0 && (
                <li style={{ color: "#888", textAlign: "center", padding: "24px 0" }}>No notifications</li>
              )}
              {notifications.map(n => (
                <li key={n._id} style={{
                  marginBottom: 16,
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  padding: "12px 14px"
                }}>
                  <div style={{ fontSize: "14px", color: "#333" }}>{n.message}</div>
                  <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #6c757d, #868e96)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '6px 18px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onClick={() => handleDismiss(n._id)}
                      onMouseOver={e => e.target.style.background = "#495057"}
                      onMouseOut={e => e.target.style.background = "linear-gradient(135deg, #6c757d, #868e96)"}
                    >
                      Dismiss
                    </button>
                    {n.itemType === 'Product' && (
                      <button
                        style={{
                          background: 'linear-gradient(135deg, #dc3545, #a91142)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '6px 18px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onClick={() => handleDeleteProduct(n.itemId)}
                        onMouseOver={e => e.target.style.background = "#a91142"}
                        onMouseOut={e => e.target.style.background = "linear-gradient(135deg, #dc3545, #a91142)"}
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