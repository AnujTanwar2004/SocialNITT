import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
  function Hero() {
  const products = useSelector((state) => state.products.items || []).slice(0, 3);
  const services = useSelector((state) => state.services.items || []).slice(0, 3);
  const foods = useSelector((state) => state.foods.items || []).slice(0, 3);

  // Card rendering helper
  const renderCards = (items, type) =>
    <div className="card-container" style={{ display: "flex", gap: "1rem" }}>
      {items.map((item) =>
        !item.isArchived ? (
          <article className="card" key={item._id} style={{ width: "250px" }}>
            <p className="card-details">
              <Link to={`/view_${type}/${item._id}`}>
                <img
                  src={item.image}
                  loading="lazy"
                  alt={item.title}
                  className="w-full h-48 rounded-tl-md rounded-tr-md"
                  style={{ width: "100%", height: "150px", objectFit: "cover" }}
                />
                <div className="card-header">
                  <div className="info">
                    {item.price && <span className="cost">₹ {item.price}</span>}
                    <span className="date">
                      {item.updatedAt ? item.updatedAt.slice(0, 10) : ""}
                    </span>
                  </div>
                </div>
                <div className="card-footer">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Link>
            </p>
          </article>
        ) : null
      )}
    </div>;

  return (
    <section className="hero" style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>Welcome to SocialNITT</h1>

      {/* Products Row */}
      <div className="hero-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Products</h2>
          <Link to="/products" className="cta-btn">See More Products</Link>
        </div>
        {renderCards(products, "product")}
      </div>
      <hr style={{ margin: "2rem 0" }} />

      {/* Services Row */}
      <div className="hero-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Services</h2>
          <Link to="/services" className="cta-ctn">See More Services</Link>
        </div>
        {renderCards(services, "service")}
      </div>
      <hr style={{ margin: "2rem 0" }} />

      {/* Foods Row */}
      <div className="hero-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Foods</h2>
          <Link to="/foods" className="cta-btn">See More Foods</Link>
        </div>
        {renderCards(foods, "food")}
      </div>
    </section>
  );
}

export default Hero;