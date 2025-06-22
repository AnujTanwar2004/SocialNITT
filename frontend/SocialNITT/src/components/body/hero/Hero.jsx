import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductCard from "../../cards/ProductCard";
import ServiceCard from "../../cards/ServiceCard";
 
import "./hero.css";

function Hero() {
  const products = useSelector((state) => state.products.items || []);
  const services = useSelector((state) => state.services.items || []);
  const foods = useSelector((state) => state.foods.items || []);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Urgent":
        return "#FF4444";
      case "High":
        return "#FF8800";
      case "Medium":
        return "#FFA500";
      case "Low":
        return "#4CAF50";
      default:
        return "#666";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#4CAF50";
      case "In Progress":
        return "#2196F3";
      case "Completed":
        return "#9C27B0";
      case "Cancelled":
        return "#F44336";
      default:
        return "#666";
    }
  };

  const renderProducts = (items) => (
    <div className="card-container">
      {items.map((item) =>
        !item.isArchived ? (
          <ProductCard key={item._id} item={item} />
        ) : null
      )}
    </div>
  );

  const renderServicesOrFoods = (items, type) => (
    <div className="service-card-container">
      {items.map((item) =>
        !item.isArchived ? (
          <ServiceCard
            key={item._id}
            item={item}
            type={type}
            getUrgencyColor={getUrgencyColor}
            getStatusColor={getStatusColor}
          />
        ) : null
      )}
    </div>
  );

  return (
    <section className="hero" style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>Welcome to SocialNITT</h1>

      {/* Products Section */}
      <div className="hero-section">
        <div className="hero-section-header">
          <h2>Products</h2>
          <Link to="/products" className="cta-btn">
            See More Products
          </Link>
        </div>
        {renderProducts(products)}
      </div>

      <hr style={{ margin: "2rem 0" }} />

      {/* Services Section */}
      <div className="hero-section">
        <div className="hero-section-header">
          <h2>Services</h2>
          <Link to="/services" className="cta-btn">See More Services</Link>
        </div>
        {renderServicesOrFoods(services, "service")}
      </div>

      <hr style={{ margin: "2rem 0" }} />

      {/* Foods Section */}
      <div className="hero-section">
        <div className="hero-section-header">
          <h2>Foods</h2>
          <Link to="/foods" className="cta-btn">See More Foods</Link>
        </div>
        {renderServicesOrFoods(foods, "food")}
      </div>
    </section>
  );
}

export default Hero;
