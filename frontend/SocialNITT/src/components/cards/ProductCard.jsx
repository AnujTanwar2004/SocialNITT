// src/components/cards/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/axiosClient";
import './ProductCard.css';


function ProductCard({ item }) {
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
              e.target.src = 'http://localhost:5000/uploads/default-avatar.png';
            }}
          />
          {item.isOnSale && <span className="badge">Sale</span>}
        </div>

        <div className="card-body">
          <h3 className="card-title">{item.title}</h3>
          <p className="card-description">{item.description}</p>
          <div className="card-price-date">
            <span className="card-price">₹ {item.price}</span>
            <span className="card-date">{item.updatedAt?.slice(0, 10)}</span>
          </div>
          <button className="card-button">Contact</button>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
