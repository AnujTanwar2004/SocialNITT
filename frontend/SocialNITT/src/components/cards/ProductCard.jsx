// src/components/cards/ProductCard.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/axiosClient";
import "./ProductCard.css";

function ProductCard({
  item,
  isProfileView = false,
  handleDelete,
  handleArchive,
  handleApproval, // ✅ Add this prop for admin approval
}) {
  const { user } = useSelector((state) => state.auth);

  // ✅ Define userId properly
  const userId = typeof item.user === "string" ? item.user : item.user?._id;

  return (
    <article className="custom-card">
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

      <Link to={`/view_product/${item._id}`} className="card-link">
        <div className="card-image-wrapper">
          <img
            src={getImageUrl(item.image)}
            alt={item.title}
            className="card-image"
            loading="lazy"
            onError={(e) => {
              e.target.src = "http://localhost:5000/uploads/default-avatar.png";
            }}
          />
          {item.isOnSale && <span className="badge">Sale</span>}
        </div>

        <div className="card-body">
          <h3 className="card-title">{item.title}</h3>
          <div className="card-description">
            <p>{item.description}</p>
          </div>
          <div className="card-price-date">
            <span className="card-price">₹ {item.price}</span>
            <span className="card-date">{item.updatedAt?.slice(0, 10)}</span>
          </div>
        </div>
      </Link>

      {/* ACTIONS: Edit / Delete / Archive for Profile */}
      {isProfileView ? (
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
              className="card-button"
              onClick={() =>
                handleArchive && handleArchive(item._id, item.isArchived)
              }
            >
              {item.isArchived === 1 ? "Unarchive" : "Archive"}
            </button>

            {/* Edit/Delete buttons */}
            <div className="action-row">
              <Link to={`/edit_product/${item._id}`} className="cta-btn">
                Edit
              </Link>
              <button
                className="card-button"
                onClick={() =>
                  handleDelete && handleDelete(item._id, userId, "product")
                }
              >
                Delete
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="service-card-user see-more-wrapper">
          <Link to={`/view_product/${item._id}`} className="see-more-button">
            See More
          </Link>
        </div>
      )}
    </article>
  );
}

export default ProductCard;
