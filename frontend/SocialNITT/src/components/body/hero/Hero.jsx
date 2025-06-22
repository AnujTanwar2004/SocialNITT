import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./hero.css";
import { getImageUrl } from "../../utils/axiosClient";

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
  // Card rendering helper
  const renderCards = (items, type) => (
    <div className="card-container">
      {items.map((item) =>
        !item.isArchived ? (
          <article className="card" key={item._id}>
            <Link to={`/view_${type}/${item._id}`}>
              {/* Image */}
              {item.image && (
                <img
                  src={getImageUrl(item.image)}
                  loading="lazy"
                  alt={item.title}
                  className="w-full h-48 rounded-tl-md rounded-tr-md"
                  onError={(e) => {
                    e.target.src =
                      "http://localhost:5000/uploads/default-avatar.png";
                  }}
                />
              )}
              <div className="service-card-header">
                <div className="service-info">
                  <span className="service-budget">₹ {item.budget}</span>
                  <span className="service-date">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="service-badges">
                  {item.urgency && (
                    <span
                      className="urgency-badge"
                      style={{
                        backgroundColor: getUrgencyColor
                          ? getUrgencyColor(item.urgency)
                          : "#FFA500",
                      }}
                    >
                      {item.urgency}
                    </span>
                  )}
                  {item.status && (
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: getStatusColor
                          ? getStatusColor(item.status)
                          : "#4CAF50",
                      }}
                    >
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
              <div className="service-content">
                <h3>{item.title}</h3>
                <p className="service-description">{item.description}</p>
                <div className="service-details">
                  <span className="service-category">📋 {item.category}</span>
                  <span className="service-location">📍 {item.location}</span>
                </div>
                <div className="service-contact">
                  <span>👤 {item.user?.name || "Anonymous"}</span>
                </div>
              </div>
            </Link>
          </article>
        ) : null
      )}
    </div>
  );
  // rendering products
  const renderProducts = (items, type) => (
    <div
      className="card-container"
      style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
    >
      {items.map((item) =>
        !item.isArchived ? (
          <article className="custom-card" key={item._id}>
            <Link to={`/view_product/${item._id}`} className="card-link">
              <div className="card-image-wrapper">
                <img
                  src={getImageUrl(item.image)}
                  loading="lazy"
                  alt={item.title}
                  className="card-image"
                  onError={(e) => {
                    e.target.src =
                      "http://localhost:5000/uploads/default-avatar.png";
                  }}
                />
                {item.isOnSale && <span className="badge">Sale</span>}
              </div>
              <div className="card-body">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>
                <div className="card-price-date">
                  <span className="card-price">₹ {item.price}</span>
                  <span className="card-date">
                    {item.updatedAt?.slice(0, 10)}
                  </span>
                </div>
                <button className="card-button">Contact</button>
              </div>
            </Link>
          </article>
        ) : null
      )}
    </div>
  );

  // Top users state
  const [topUsers, setTopUsers] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/user/top-users")
      .then((res) => res.json())
      .then(setTopUsers)
      .catch(() => setTopUsers([]));
  }, []);

  // Weekly top users state
  const [topUsersWeek, setTopUsersWeek] = useState([]);
  useEffect(() => {
    fetch("/user/top-users-week")
      .then((res) => res.json())
      .then(setTopUsersWeek)
      .catch(() => setTopUsersWeek([]));
  }, []);

  return (
    <section className="hero" style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>Welcome to SocialNITT</h1>

      {/* Products Row */}
      <div className="hero-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Products</h2>
          <Link to="/products" className="cta-btn">
            See More Products
          </Link>
        </div>
        {renderProducts(products, "product")}
      </div>
      <hr style={{ margin: "2rem 0" }} />

      {/* Services Row */}
      <div className="hero-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Services</h2>
          <Link to="/services" className="cta-ctn">
            See More Services
          </Link>
        </div>
        {renderCards(services, "service")}
      </div>
      <hr style={{ margin: "2rem 0" }} />

      {/* Foods Row */}
      <div className="hero-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Foods</h2>
          <Link to="/foods" className="cta-btn">
            See More Foods
          </Link>
        </div>
        {renderCards(foods, "food")}
      </div>

      {/* Top Users Leaderboard (All Time) */}
      <hr style={{ margin: "2rem 0" }} />
      <div className="hero-section">
        <h2>🏆 Top Contributors (All Time)</h2>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          {topUsers.map((user, idx) => (
            <div
              key={user._id}
              style={{
                border: "2px solid gold",
                borderRadius: "12px",
                padding: "1rem",
                minWidth: "180px",
                background: "#fffbe6",
                textAlign: "center",
              }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  marginBottom: 8,
                }}
              />
              <h3 style={{ margin: 0 }}>{user.name}</h3>
              <p style={{ margin: 0, color: "#850E35", fontWeight: "bold" }}>
                {user.points} points
              </p>
              <p style={{ margin: 0, color: "#888" }}>
                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Users Leaderboard (This Week) */}
      <hr style={{ margin: "2rem 0" }} />
      <div className="hero-section">
        <h2>🔥 Top Contributors (This Week)</h2>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          {topUsersWeek.map((user, idx) => (
            <div
              key={user._id}
              style={{
                border: "2px solid #ff9800",
                borderRadius: "12px",
                padding: "1rem",
                minWidth: "180px",
                background: "#fffbe6",
                textAlign: "center",
              }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  marginBottom: 8,
                }}
              />
              <h3 style={{ margin: 0 }}>{user.name}</h3>
              <p style={{ margin: 0, color: "#ff9800", fontWeight: "bold" }}>
                {user.weeklyPoints} points
              </p>
              <p style={{ margin: 0, color: "#888" }}>
                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
