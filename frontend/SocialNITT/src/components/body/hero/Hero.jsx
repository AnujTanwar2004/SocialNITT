import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./hero.css" 


  function Hero() {
  const products = useSelector((state) => state.products.items || []).slice(0, 3);
  const services = useSelector((state) => state.services.items || []).slice(0, 3);
  const foods = useSelector((state) => state.foods.items || []).slice(0, 3);
  

  // Card rendering helper
  const renderCards = (items, type) => (
    <div className="card-container" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {items.map((item) =>
        !item.isArchived ? (
          <article className="custom-card" key={item._id}>
            <Link to={`/view_${type}/${item._id}`} className="card-link">
              <div className="card-image-wrapper">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="card-image"
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
        ) : null
      )}
    </div>
  );
  

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