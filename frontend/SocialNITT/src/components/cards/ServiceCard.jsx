import React from "react";
import { Link } from "react-router-dom";
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
  const userId = typeof item.user === "string" ? item.user : item.user?._id;

  return (
    <article className="custom-card">
      <Link to={`/view_${type}/${item._id}`} className="card-link">
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
          {!isProfileView && (
  <div className="service-card-user">
    👤 {item.user?.name || "Anonymous"}
  </div>
)}

        </div>
      </Link>

      {/* Action Buttons (Only for Profile View) */}
      {isProfileView && (
        <>
          <div className="card-archive">
            <p>
              
              {item.isArchived === 1 ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i>}
            </p>
          </div>
          <div className="card-actions">
            <div className="action-row">
              <Link to={`/edit_service/${item._id}`} className="card-button edit-button">
                Edit
              </Link>
              <button
                className="card-button delete-button"
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