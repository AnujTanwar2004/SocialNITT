import React from "react";
import { Link } from "react-router-dom";
import './ServiceCard.css';

function ServiceCard({ item, type, getUrgencyColor, getStatusColor }) {
  return (
    <article className="service-card">
      <Link to={`/view_${type}/${item._id}`} className="service-card-link">
        {/* Header */}
        <div className="service-title-badges">
        <div className="service-card-header">
          <h3 className="service-card-title">{item.title}</h3>
          <span className="service-card-date">{new Date(item.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Badges placed just below header */}
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
        <div className="service-card-body">
          <span className="service-card-price">₹ {item.budget}</span>
          <p className="service-card-description">{item.description}</p>

          <div className="service-card-info">
            <div className="service-card-category">📋 {item.category}</div>
            <div className="service-card-location">📍 {item.location}</div>
          </div>

          <div className="service-card-user">👤 {item.user?.name || "Anonymous"}</div>
        </div>
      </Link>
    </article>
  );
}

export default ServiceCard;
