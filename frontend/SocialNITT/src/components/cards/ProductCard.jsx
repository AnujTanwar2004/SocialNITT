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
}) {
  const { user } = useSelector((state) => state.auth);

  // ✅ Define userId properly
  const userId = typeof item.user === "string" ? item.user : item.user?._id;

  return (
    <article className="custom-card">
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
            {/* Archive button पहले */}
            <button
              className="card-button"
              onClick={() =>
                handleArchive && handleArchive(item._id, item.isArchived)
              }
            >
              {item.isArchived === 1 ? "Unarchive" : "Archive"}
            </button>

            {/* Edit/Delete अगली line में */}
            <div className="action-row">
              {/* ✅ Fixed: Link to edit_product instead of edit_service */}
              <Link to={`/edit_product/${item._id}`} className="cta-btn">
                Edit
              </Link>
              {/* ✅ Fixed: Pass "product" instead of "service" */}
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
