import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from "../../../redux/slices/productSlice";
import ProductCard from '../../cards/ProductCard'; // ✅ Ensure correct relative path
 

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
                placeholder="Search"
                className="search-input"
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
          {products && products
            .filter((item) => {
              if (searchTerm === "") return true;
              return item.title.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .map((item) =>
              !item.isArchived ? (
                <ProductCard key={item._id} item={item} />
              ) : null
            )}
        </div>
      </section>
    </>
  );
}

export default Dashboard;
