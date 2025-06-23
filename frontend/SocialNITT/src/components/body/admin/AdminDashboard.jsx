import React, { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import ProductCard from "../../cards/ProductCard";
import ServiceCard from "../../cards/ServiceCard";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get("/api/products/admin/all").then(res => setProducts(res.data));
    axiosClient.get("/api/services").then(res => setServices(res.data)); // If you have admin endpoint, use it
    axiosClient.get("/api/foods/admin/all").then(res => setFoods(res.data));
  }, []);

  // Product Delete
  const handleDeleteProduct = (id) => {
    if (window.confirm("Delete this product?")) {
      axiosClient.delete(`/api/products/admin/${id}`).then(() => {
        setProducts(products.filter(p => p._id !== id));
      });
    }
  };

  // Service Delete
  const handleDeleteService = (id) => {
    if (window.confirm("Delete this service?")) {
      axiosClient.delete(`api/services/admin/${id}`).then(() => {
        setServices(services.filter(s => s._id !== id));
      });
    }
  };

  // Food Delete
  const handleDeleteFood = (id) => {
    if (window.confirm("Delete this food?")) {
      axiosClient.delete(`/api/foods/admin/${id}`).then(() => {
        setFoods(foods.filter(f => f._id !== id));
      });
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Dashboard</h2>

      {/* Products */}
      <section>
        <h3>All Products</h3>
        <div className="card-container">
          {products.length === 0 && <p>No products found.</p>}
          {products.map(item => (
            <ProductCard
              key={item._id}
              item={item}
              isProfileView={true}
              handleDelete={() => handleDeleteProduct(item._id)}
              handleArchive={() => {}} // Optional: implement archive if needed
            >
              <Link to={`/edit_product/${item._id}`}>Edit</Link>
            </ProductCard>
          ))}
        </div>
      </section>

      {/* Services */}
      <section>
        <h3>All Services</h3>
        <div className="card-container">
          {services.length === 0 && <p>No services found.</p>}
          {services.map(item => (
            <ServiceCard
              key={item._id}
              item={item}
              isProfileView={true}
              handleDelete={() => handleDeleteService(item._id)}
              handleArchive={() => {}} // Optional: implement archive if needed
              getUrgencyColor={() => "#850E35"}
              getStatusColor={() => "#850E35"}
            >
             </ServiceCard>
          ))}
        </div>
      </section>

      {/* Foods */}
      <section>
        <h3>All Foods</h3>
        <div className="card-container">
          {foods.length === 0 && <p>No foods found.</p>}
          {foods.map(item => (
            <article className="custom-card" key={item._id}>
              <div className="card-body">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>
                <div className="card-price-date">
                  <span className="card-price">₹ {item.budget}</span>
                  <span className="card-date">{item.updatedAt?.slice(0, 10)}</span>
                </div>
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <Link to={`/edit_food/${item._id}`} className="card-edit">Edit</Link>
                  <button className="card-delete" onClick={() => handleDeleteFood(item._id)}>Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;