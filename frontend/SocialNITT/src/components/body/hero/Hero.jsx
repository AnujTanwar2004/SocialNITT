import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductCard from "../../cards/ProductCard";
import ServiceCard from "../../cards/ServiceCard";
import axiosClient from "../../utils/axiosClient"; // adjust path if needed

import "./hero.css";

function Hero() {
  const products = useSelector((state) => state.products.items || []);
  const services = useSelector((state) => state.services.items || []);
  const foods = useSelector((state) => state.foods.items || []);

  const [topUsers, setTopUsers] = useState([]);
  const [topUsersWeek, setTopUsersWeek] = useState([]);

  useEffect(() => {
    // Fetch all-time top users
    axiosClient
      .get("/user/top-users")
      .then((res) => setTopUsers(res.data))
      .catch(() => setTopUsers([]));

    // Fetch weekly top users
    axiosClient
      .get("/user/top-users-week")
      .then((res) => setTopUsersWeek(res.data))
      .catch(() => setTopUsersWeek([]));
  }, []);

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
    <div className="  card-slider-container">
    <div className="  card-slider">
      {items.map((item) =>
        !item.isArchived ? <ProductCard key={item._id} item={item} /> : null
      )}
    </div>
    </div>
  );

  const renderServices = (items, type) => (
    <div className="  card-slider-container">
    <div className="  card-slider">
      {items.map((item) =>
        !item.isArchived ? (
          <ServiceCard
            key={item._id}
            item={item}
            type={type}
            isProfileView={false}
            getUrgencyColor={getUrgencyColor}
            getStatusColor={getStatusColor}
          />
        ) : null
      )}
    </div>
    </div>
  );

  const renderFoods = (items, type) => (
    <div className="  card-slider-container">
    <div className="  card-slider">
      {items.map((item) =>
        !item.isArchived ? (
          <ServiceCard
            key={item._id}
            item={item}
            type={type}
            isProfileView={false}
            getUrgencyColor={getUrgencyColor}
            getStatusColor={getStatusColor}
          />
        ) : null
      )}
    </div>
    </div>
  );


  return (
    <section className="hero" style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>Welcome to SocialNITT</h1>

      {/* Products Section */}
      <div className="hero-section">
        <div className="hero-section-header">
          <h2>Products</h2>
          <Link to="/products" className="see">
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
          <Link to="/services" className="see">
            See More Services
          </Link>
        </div>
        {renderServices(services, "service")}
      </div>

      <hr style={{ margin: "2rem 0" }} />

      {/* Foods Section */}
      <div className="hero-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Foods</h2>
          <Link to="/foods" className="see">
            See More Foods
          </Link>
        </div>
        {renderFoods(foods, "food")}
      </div>

      {/* Top Users Leaderboard (All Time) */}
      <hr style={{ margin: "2rem 0" }} />
      <div className="hero-section  ">
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
      <div className="hero-section ">
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
