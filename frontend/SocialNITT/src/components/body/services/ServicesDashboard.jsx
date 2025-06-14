import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchServices } from "../../../redux/slices/serviceSlice";

function ServicesDashboard() {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { isLogged } = auth;

  const services = useSelector((state) => state.services.items);
  const status = useSelector((state) => state.services.status);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isLogged && status === "idle") {
      dispatch(fetchServices());
    }
  }, [isLogged, dispatch, status]);

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

  return (
    <>
      <section>
        <div className="cta-primary">
          <div className="cta-container">
            <div className="cta-btn">
              <p>
                <Link to="/create_service">Post Service Request</Link>
              </p>
              </div>
          </div>
        </div>
      </section>

      <section className="cards-primary">
        <div className="cards-header">
          <h1>Service Requests</h1>
          <p>
            Help others by providing services or find professionals for your
            needs.
          </p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="search-form-primary"
        >
          <div className="search-form-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="search-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search services..."
              className="search-input"
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </div>
        </form>

        <div className="card-container">
          {services &&
            services
              .filter((item) => {
                if (searchTerm === "") return true;
                return (
                  item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.category.toLowerCase().includes(searchTerm.toLowerCase())
                );
              })
              .map((item, key) =>
                !item.isArchived ? (
                  <article className="card" key={item._id}>
                    <Link to={`/view_service/${item._id}`}>
                      <div className="service-card-header">
                        <div className="service-info">
                          <span className="service-budget">
                            ₹ {item.budget}
                          </span>
                          <span className="service-date">
                            {new Date(item.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="service-badges">
                          <span
                            className="urgency-badge"
                            style={{
                              backgroundColor: getUrgencyColor(item.urgency),
                            }}
                          >
                            {item.urgency}
                          </span>
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusColor(item.status),
                            }}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <div className="service-content">
                        <h3>{item.title}</h3>
                        <p className="service-description">
                          {item.description}
                        </p>
                        <div className="service-details">
                          <span className="service-category">
                            📋 {item.category}
                          </span>
                          <span className="service-type">
                            🔄 {item.serviceType}
                          </span>
                          <span className="service-location">
                            📍 {item.location}
                          </span>
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
      </section>
    </>
  );
}

export default ServicesDashboard;
