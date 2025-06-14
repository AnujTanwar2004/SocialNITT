import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchFoods } from "../../../redux/slices/foodSlice";

function ViewFood() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const foods = useSelector((state) => state.foods.items);
  const status = useSelector((state) => state.foods.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFoods());
    }
  }, [dispatch, status]);

  const food = foodss.find((s) => s._id === id);

  if (!food)
    return (
      <h2 style={{ textAlign: "center", margin: "50px 0" }}>
        Food not found.
      </h2>
    );

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

  return (
    <section className="cta-secondary">
      <div className="cta-cover"></div>
      <div className="cta-container">
        <div className="cta-details">
          <h3>{food.title}</h3>

          <div className="service-view-info">
            <div className="info-row">
              <span className="service-budget">
                💰 Budget: ₹ {food.budget}
              </span>
              <span
                className="service-urgency"
                style={{ color: getUrgencyColor(food.urgency) }}
              >
                🚨 {food.urgency} Priority
              </span>
            </div>

             

            <div className="info-row">
              <span>📍 Location: {food.location}</span>
              <span>
                📅 Posted: {new Date(food.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="info-row">
              <span>👤 Posted by: {service.user?.name || "Anonymous"}</span>
              <span
                className="service-status"
                style={{
                  color: food.status === "Active" ? "#4CAF50" : "#666",
                  fontWeight: "bold",
                }}
              >
                📊 Status: {food.status}
              </span>
            </div>
          </div>

          <div className="service-description">
            <h4>Description:</h4>
            <p>{food.description}</p>
          </div>

          <a
            className="cta-btn"
            href={`https://wa.me/${food.phone}`}
            target="_blank"
            rel="noreferrer"
          >
            Contact for Food
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default ViewFood;
