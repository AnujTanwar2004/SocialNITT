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

  // Example delete handler for product notifications (optional)
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

  return (
    <li style={{ position: 'relative' }} ref={bellRef}>
      <button onClick={() => setShow(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <span role="img" aria-label="bell">🔔</span>
      </button>
      {show && (
        <div style={{
          position: 'absolute', right: 0, top: '2rem', background: '#fff', border: '1px solid #ccc', borderRadius: 8, minWidth: 250, zIndex: 1000
        }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 10 }}>
            {notifications.length === 0 && <li>No notifications</li>}
            {notifications.map(n => (
              <li key={n._id} style={{ marginBottom: 10 }}>
                <div>{n.message}</div>
                {n.itemType === 'Product' && (
                  <button
                    style={{
                      marginTop: 5,
                      background: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      padding: '4px 10px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleDeleteProduct(n.itemId)}
                  >
                    Delete Product
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default NotificationBell;