import React from "react";
import { Link } from "react-router-dom";
import './FoodCard.css';

function FoodCard({
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
    <article className="food-card">
      <Link to={`/view_food/${item._id}`} className="food-card-link">
        <div className="food-title-header">
          <div className="food-card-header">
            <h3 className="food-card-title">{item.title}</h3>
            <span className="food-card-date">{new Date(item.updatedAt).toLocaleDateString()}</span>
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
           
           {/* User Info */}
        {!isProfileView && (
         <div className="service-card-user see-more-wrapper">
         <Link to={`/view_product/${item._id}`} className="see-more-button">
           See More
         </Link>
       </div>
       
        )}
        </div>
      </Link>

      {isProfileView && (
        <>
          <div className="card-archive">
            <p>
              {item.isArchived === 1 ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i>}
            </p>
          </div>
          <div className="food-card-actions">
            <div className="food-action-row">
              <Link to={`/edit_food/${item._id}`} className="card-button edit-button">
                Edit
              </Link>
              <button
                className="card-button delete-button"
                onClick={() => handleDelete(item._id, userId, "food")}
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

export default FoodCard;
