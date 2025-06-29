import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from "../../../redux/slices/productSlice";
import ProductCard from '../../cards/ProductCard';

function Dashboard() {
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const { isLogged } = auth;

  const products = useSelector(state => state.products.items);
  const status = useSelector(state => state.products.status);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isLogged && status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [isLogged, dispatch, status]);

  // Sort products to show latest first
  const sortedProducts = products ? [...products].sort((a, b) => {
    // Sort by updatedAt (most recent first), fallback to createdAt if updatedAt doesn't exist
    const dateA = new Date(a.updatedAt || a.createdAt);
    const dateB = new Date(b.updatedAt || b.createdAt);
    return dateB - dateA; // Descending order (latest first)
  }) : [];

  return (
    <>
      <section>
        <div className="cta-primary">
          <div className="cta-container">
            <div className="cta-btn">
              <p><Link to="/create_product">List Product</Link></p>
            </div>
          </div>

          {/* Search bar */}
          <form onSubmit={(e) => e.preventDefault()} className="search-form-primary">
            <div className="search-form-container">
              <svg xmlns="http://www.w3.org/2000/svg" className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                className="search-input"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
              />
            </div>
          </form>
        </div>
      </section>

      <section className="cards-primary">
        <div className="cards-header">
          <h1>Products</h1>
          <p>A place where NITT Exchanges</p>
        </div>

        {/* Card container using ProductCard */}
        <div className="card-container">
          {sortedProducts
            .filter((item) => {
              if (searchTerm === "") return true;
              return (
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
              );
            })
            .map((item) =>
              !item.isArchived ? (
                <ProductCard key={item._id} item={item} />
              ) : null
            )}
        </div>

        {/* Show message when no products found */}
        {sortedProducts
          .filter((item) => {
            if (searchTerm === "") return true;
            return (
              item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
          })
          .filter(item => !item.isArchived).length === 0 && (
          <div className="empty-state">
            {searchTerm ? (
              <p>No products found matching "{searchTerm}"</p>
            ) : (
              <p>No products available at the moment.</p>
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default Dashboard;