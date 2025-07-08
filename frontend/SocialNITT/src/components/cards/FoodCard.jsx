import React from "react";
import { Link } from "react-router-dom";
import "./FoodCard.css";

function FoodCard({
  item,
  type,
  getUrgencyColor,
  getStatusColor,
  isProfileView = false,
  handleDelete,
  handleArchive,
  handleApproval, //   Add this prop
}) {
  const userId = typeof item.user === "string" ? item.user : item.user?._id;

  return (
    <Link to={`/view_food/${item._id}`} className="food-card-link">
      <article className="food-card">
        {/*   Add approval status indicator */}
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
            }}
          >
            {item.isApproved ? "  Approved" : "⏳ Pending"}
          </div>
        )}

        <div className="food-title-header">
          <div className="food-card-header">
            <h3 className="food-card-title">{item.title}</h3>
            <span className="food-card-date">
              {new Date(item.updatedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Optional Badges */}
          <div className="food-card-badges">
            {item.urgency && (
              <span
                className="food-card-badge urgency"
                style={{ backgroundColor: getUrgencyColor(item.urgency) }}
              >
                {item.urgency}
              </span>
            )}
            {item.status && (
              <span
                className="food-card-badge status"
                style={{ backgroundColor: getStatusColor(item.status) }}
              >
                {item.status}
              </span>
            )}
          </div>
        </div>

        <div className="food-card-body">
          <span className="food-card-price">₹ {item.budget}</span>
          <p className="food-card-description">{item.description}</p>

          <div className="food-card-info">
            <div className="food-card-category">🍱 {item.category}</div>
            <div className="food-card-location">📍 {item.location}</div>
          </div>
        </div>

        {/* User Info */}
        {!isProfileView && (
          <div className="service-card-user see-more-wrapper">
            <span className="see-more-button">
              See More
            </span>
          </div>
        )}

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
            <div className="food-card-actions">
              <div className="food-action-row">
                <Link
                  to={`/edit_food/${item._id}`}
                  className="card-button edit-button"
                  onClick={(e) => e.stopPropagation()} // Prevent card click
                >
                  Edit
                </Link>
                <button
                  className="card-button delete-button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(item._id, userId, "food");
                  }}
                >
                  Delete
                </button>
              </div>

              {/*   Add approval button for admin */}
              {handleApproval && (
                <button
                  className="card-button"
                  style={{
                    background: item.isApproved ? "#dc3545" : "#28a745",
                    color: "white",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleApproval(item._id, item.isApproved);
                  }}
                >
                  {item.isApproved ? "Revoke Approval" : "Approve"}
                </button>
              )}

              <button
                className="card-button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleArchive(item._id, item.isArchived);
                }}
              >
                {item.isArchived === 1 ? "Unarchive" : "Archive"}
              </button>
            </div>
          </>
        )}
      </article>
    </Link>
  );
}

export default FoodCard;