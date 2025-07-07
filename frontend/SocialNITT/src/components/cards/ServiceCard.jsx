import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./ServiceCard.css";

function ServiceCard({
  item,
  type,
  getUrgencyColor,
  getStatusColor,
  isProfileView = false,
  handleDelete,
  handleArchive,
  handleApproval, // ✅ Add this prop for admin approval
}) {
  const { user } = useSelector((state) => state.auth);
  const userId = typeof item.user === "string" ? item.user : item.user?._id;

  return (
    <article className="service-card">
      {/* ✅ Add approval status indicator for admin */}
      {isProfileView && (
        <div
          className="approval-status"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: item.isApproved ? "#28a745" : "#ffc107",
            color: "white",
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "600",
            zIndex: 3,
          }}
        >
          {item.isApproved ? "✅ Approved" : "⏳ Pending"}
        </div>
      )}

      <Link to={`/view_service/${item._id}`} className="card-link">
        {/* Header */}
        <div className="service-title-badges">
          <div className="service-card-header">
            <h3 className="service-card-title">{item.title}</h3>
            <span className="service-card-date">
              {new Date(item.updatedAt).toLocaleDateString()}
            </span>
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
        <div className="service-card-user see-more-wrapper">
          <Link to={`/view_service/${item._id}`} className="see-more-button">
            See More
          </Link>
        </div>
      )}

      {/* Profile View Actions */}
      {isProfileView && (
        <>
          <div className="card-archive">
            <p>
              {item.isArchived === 1 ? (
                <i className="fas fa-check"></i>
              ) : (
                <i className="fas fa-times"></i>
              )}
            </p>
          </div>
          <div className="card-actions">
            {/* ✅ Add approval button for admin */}
            {handleApproval && (
              <button
                className="approval-button"
                style={{
                  background: item.isApproved ? "#dc3545" : "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  padding: "10px 16px",
                  fontWeight: "700",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  width: "100%",
                  marginBottom: "0.5rem",
                }}
                onClick={() => handleApproval(item._id, item.isApproved)}
              >
                {item.isApproved ? "Revoke Approval" : "Approve"}
              </button>
            )}

            {/* Archive button */}
            <button
              className="archive-card-button"
              onClick={() =>
                handleArchive && handleArchive(item._id, item.isArchived)
              }
            >
              {item.isArchived === 1 ? "Unarchive" : "Archive"}
            </button>

            {/* Edit/Delete buttons */}
            <div className="action-row">
              <Link to={`/edit_service/${item._id}`} className="cta-btn">
                Edit
              </Link>
              <button
                className="card-button"
                onClick={() =>
                  handleDelete && handleDelete(item._id, userId, "service")
                }
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </article>
  );
}

export default ServiceCard;
