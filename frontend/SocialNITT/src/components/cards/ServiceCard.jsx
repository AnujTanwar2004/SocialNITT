import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import './ServiceCard.css';

function ServiceCard({
  item,
  type,
  getUrgencyColor,
  getStatusColor,
  isProfileView = false,
  handleDelete,
  handleArchive,
}) {
  const { user } = useSelector((state) => state.auth);
  const userId = typeof item.user === "string" ? item.user : item.user?._id;

  return (
    <article className="service-card">
      <Link to={`/view_service/${item._id}`} className="card-link">
        {/* Header */}
        <div className="service-title-badges">
          <div className="service-card-header">
            <h3 className="service-card-title">{item.title}</h3>
            <span className="service-card-date">{new Date(item.updatedAt).toLocaleDateString()}</span>
          </div>

          {/* Badges */}
          <div className="service-card-badges">
            {item.urgency && (
              <span
                className="service-card-badge urgency"
                style={{ backgroundColor: getUrgencyColor(item.urgency) }}
              >
                {item.urgency}
              </span>
            )}
            {item.status && (
              <span
                className="service-card-badge status"
                style={{ backgroundColor: getStatusColor(item.status) }}
              >
                {item.status}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="card-body">
          <span className="card-price">₹ {item.budget}</span>
          <p className="card-description">{item.description}</p>

          <div className="service-card-info">
            <div className="service-card-category">📋 {item.category}</div>
            <div className="service-card-location">📍 {item.location}</div>
          </div>
        </div>
        </Link>
        {/* User Info */}
        {!isProfileView && (
          <div className="service-card-user">
            {user && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  borderLeft: "3px solid #850E35"
                }}
              >
                <p style={{ margin: 0, color: "#333" }}>{user.name}</p>
              </div>
            )}
          </div>
        )}
      

      {/* Profile View Actions */}
      {isProfileView && (
        <>
          <div className="card-archive">
            <p>
              {item.isArchived === 1 ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i>}
            </p>
          </div>
          <div className="card-actions">
            <div className="action-row">
              <Link to={`/edit_service/${item._id}`} className="   cta-btn">
                Edit
              </Link>
              <button
                className="card-button  "
                onClick={() => handleDelete(item._id, userId, "service")}
              >
                Delete
              </button>
            </div>
            <button
              className="card-button"
              onClick={() => handleArchive(item._id, item.isArchived)}
            >
              {item.isArchived === 1 ? "Unarchive" : "Archive"}
            </button>
          </div>
        </>
      )}
    </article>
  );
}

export default ServiceCard;
