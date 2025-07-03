import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductCard from "../../cards/ProductCard";
import ServiceCard from "../../cards/ServiceCard";
import axiosClient from "../../utils/axiosClient"; // adjust path if needed

import FoodCard from "../../cards/FoodCard";

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
    <div className="card-slider-container">
      <div className="card-slider">
        {items.map((item) =>
          !item.isArchived ? (
            <FoodCard
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
    <section className="hero modern-hero">
      {/* Modern Hero Header */}
      <div className="hero-header">
        <h1 className="main-title">
          Welcome to <span className="brand-highlight">CommuNITT</span>
        </h1>
        <p className="hero-subtitle">Discover amazing products, services, and connect with our community</p>
      </div>

      {/* Products Section */}
      <div className="hero-section">
        <div className="modern-section-header">
          <div className="section-title-wrapper">
            <h2 className="section-title">🛍️ Products</h2>
            <div className="title-underline"></div>
          </div>
          <Link to="/products" className="modern-see-more">
            <span>Explore All</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        {renderProducts(products)}
      </div>

      <div className="modern-divider"></div>

      {/* Services Section */}
      <div className="hero-section">
        <div className="modern-section-header">
          <div className="section-title-wrapper">
            <h2 className="section-title">⚡ Services</h2>
            <div className="title-underline"></div>
          </div>
          <Link to="/services" className="modern-see-more">
            <span>Explore All</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        {renderServices(services, "service")}
      </div>

      <div className="modern-divider"></div>

      {/* Foods Section */}
      <div className="hero-section">
        <div className="modern-section-header">
          <div className="section-title-wrapper">
            <h2 className="section-title">🍕 Foods</h2>
            <div className="title-underline"></div>
          </div>
          <Link to="/foods" className="modern-see-more">
            <span>Explore All</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        {renderFoods(foods, "food")}
      </div>

      {/* Modern Top Users Leaderboard (All Time) */}
      <div className="modern-divider"></div>
      <div className="hero-section leaderboard-section">
        <div className="leaderboard-header">
          <h2 className="leaderboard-title">
            <span className="trophy-icon">🏆</span>
            Top Contributors
            <span className="period-badge all-time">All Time</span>
          </h2>
        </div>
        <div className="modern-leaderboard">
          {topUsers.map((user, idx) => (
            <div
              key={user._id}
              className={`leaderboard-card ${idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : 'rank-3'}`}
            >
              <div className="rank-badge">
                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
              </div>
              <div className="user-avatar-wrapper">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar"
                />
                <div className="avatar-ring"></div>
              </div>
              <h3 className="user-name">{user.name}</h3>
              <div className="points-display">
                <span className="points-number">{user.points}</span>
                <span className="points-label">points</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Top Users Leaderboard (This Week) */}
      <div className="modern-divider"></div>
      <div className="hero-section leaderboard-section">
        <div className="leaderboard-header">
          <h2 className="leaderboard-title">
            <span className="fire-icon">🔥</span>
            Top Contributors
            <span className="period-badge weekly">This Week</span>
          </h2>
        </div>
        <div className="modern-leaderboard weekly">
          {topUsersWeek.map((user, idx) => (
            <div
              key={user._id}
              className={`leaderboard-card weekly ${idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : 'rank-3'}`}
            >
              <div className="rank-badge">
                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
              </div>
              <div className="user-avatar-wrapper">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar"
                />
                <div className="avatar-ring weekly"></div>
              </div>
              <h3 className="user-name">{user.name}</h3>
              <div className="points-display weekly">
                <span className="points-number">{user.weeklyPoints}</span>
                <span className="points-label">points</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;