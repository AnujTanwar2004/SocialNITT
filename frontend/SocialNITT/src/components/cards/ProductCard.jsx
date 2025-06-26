// src/components/cards/ProductCard.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/axiosClient";
import "./ProductCard.css";

function ProductCard({ item, isProfileView = false, handleDelete, handleArchive }) {
  // Move useSelector inside the component body
  const { user } = useSelector((state) => state.auth);

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
          {/* Archive/Unarchive button */}
          <div className="card-action">
            <button
              className="archive-card-button"
              onClick={() => handleArchive(item._id, item.isArchived)}
            >
              {item.isArchived === 1 ? "Unarchive" : "Archive"}
            </button>
          </div>

          {/* Edit and Delete */}
          <div className="edit-delete-card-action">
            <Link
              to={`/edit_product/${item._id}`}
              className="card-edit"
              style={{ textAlign: "center" }}
            >
              <i className="card-edit"></i> Edit
            </Link>
            <button
              className="card-delete"
              onClick={() => handleDelete(item._id, item.user, "product")}
            >
              <i className="fas fa-trash"></i> Delete
            </button>
          </div>
        </>
      ) : (
        <div className="service-card-user">
          {user && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem",
                background: "#f8f9fa",
                borderRadius: "8px",
                borderLeft: "3px solid #850E35",
              }}
            >
              <p style={{ margin: 0, color: "#333" }}>{user.name}</p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default ProductCard;
