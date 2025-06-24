import React, { useEffect, useState, useMemo, useCallback } from "react";
import axiosClient from "../../utils/axiosClient";
import ProductCard from "../../cards/ProductCard";
import ServiceCard from "../../cards/ServiceCard";
import { Link, useNavigate } from "react-router-dom";
import "./adminDashboard.css";

// Move SearchBar component outside to prevent re-creation - FIXED VERSION
const SearchBar = React.memo(({ searchTerm, setSearchTerm, placeholder, resultCount }) => {
  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          autoComplete="off"
        />
        {searchTerm && (
          <button 
            className="clear-search-btn"
            onClick={() => setSearchTerm('')}
            title="Clear search"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
      {searchTerm && (
        <div className="search-info">
          <span className="search-results">
            Found {resultCount} result{resultCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
});

// Move Pagination component outside to prevent re-creation - FIXED VERSION
const Pagination = React.memo(({ totalItems, currentPage, setCurrentPage, itemsPerPage = 5 }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <button 
        className="pagination-btn prev-btn"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      
      {pageNumbers.map((page, index) => (
        page === '...' ? (
          <span key={index} className="pagination-ellipsis">...</span>
        ) : (
          <button
            key={index}
            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        )
      ))}
      
      <button 
        className="pagination-btn next-btn"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
});

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [foods, setFoods] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Search states for each section
  const [userSearch, setUserSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [foodSearch, setFoodSearch] = useState('');

  // Pagination states for each section
  const [userPage, setUserPage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);
  const [foodPage, setFoodPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    axiosClient.get("/api/products/admin/all").then(res => setProducts(res.data));
    axiosClient.get("/api/services").then(res => setServices(res.data));
    axiosClient.get("/api/foods/admin/all").then(res => setFoods(res.data));
    axiosClient.get("/user/infor", { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })
      .then(res => {
        if (res.data.role === 1) {
          axiosClient.get("/user/admin/all", { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })
            .then(res2 => setUsers(res2.data));
        }
      });
  }, []);

  // Filter functions with proper string handling
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const searchLower = userSearch.toLowerCase().trim();
    return users.filter(user => 
      (user.name && user.name.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower))
    );
  }, [users, userSearch]);

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    const searchLower = productSearch.toLowerCase().trim();
    return products.filter(product => 
      (product.title && product.title.toLowerCase().includes(searchLower)) ||
      (product.description && product.description.toLowerCase().includes(searchLower))
    );
  }, [products, productSearch]);

  const filteredServices = useMemo(() => {
    if (!serviceSearch.trim()) return services;
    const searchLower = serviceSearch.toLowerCase().trim();
    return services.filter(service => 
      (service.title && service.title.toLowerCase().includes(searchLower)) ||
      (service.description && service.description.toLowerCase().includes(searchLower))
    );
  }, [services, serviceSearch]);

  const filteredFoods = useMemo(() => {
    if (!foodSearch.trim()) return foods;
    const searchLower = foodSearch.toLowerCase().trim();
    return foods.filter(food => 
      (food.title && food.title.toLowerCase().includes(searchLower)) ||
      (food.description && food.description.toLowerCase().includes(searchLower))
    );
  }, [foods, foodSearch]);

  // Pagination helper function
  const getPaginatedData = (data, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Search handlers to prevent state issues - STABLE REFERENCES
  const handleUserSearch = useCallback((value) => {
    setUserSearch(value);
  }, []);

  const handleProductSearch = useCallback((value) => {
    setProductSearch(value);
  }, []);

  const handleServiceSearch = useCallback((value) => {
    setServiceSearch(value);
  }, []);

  const handleFoodSearch = useCallback((value) => {
    setFoodSearch(value);
  }, []);

  // Delete handlers
  const handleDeleteProduct = (id) => {
    if (window.confirm("Delete this product?")) {
      axiosClient.delete(`/api/products/admin/${id}`).then(() => {
        setProducts(products.filter(p => p._id !== id));
      });
    }
  };

  const handleDeleteService = (id) => {
    if (window.confirm("Delete this service?")) {
      axiosClient.delete(`api/services/admin/${id}`).then(() => {
        setServices(services.filter(s => s._id !== id));
      });
    }
  };

  const handleDeleteFood = (id) => {
    if (window.confirm("Delete this food?")) {
      axiosClient.delete(`/api/foods/admin/${id}`).then(() => {
        setFoods(foods.filter(f => f._id !== id));
      });
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Delete this user? This action cannot be undone.")) {
      axiosClient.delete(`/user/admin/${id}`).then(() => {
        setUsers(users.filter(u => u._id !== id));
      });
    }
  };

  // Reset page when search changes
  useEffect(() => { setUserPage(1); }, [userSearch]);
  useEffect(() => { setProductPage(1); }, [productSearch]);
  useEffect(() => { setServicePage(1); }, [serviceSearch]);
  useEffect(() => { setFoodPage(1); }, [foodSearch]);

  return (
    <div className="admin-dashboard">
      <h2 className="admin-title">Admin Dashboard</h2>

      {/* Users Section */}
      <section className="admin-section">
        <h3 className="adminHead">All Users ({users.length})</h3>
        
        <SearchBar 
          searchTerm={userSearch}
          setSearchTerm={handleUserSearch}
          placeholder="Search users by name or email..."
          resultCount={filteredUsers.length}
        />

        <div className="users-table-container">
          {filteredUsers.length === 0 ? (
            <p className="no-results">
              {userSearch ? `No users found matching "${userSearch}"` : "No users found."}
            </p>
          ) : (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedData(filteredUsers, userPage).map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role === 1 ? 'admin' : 'user'}`}>
                          {user.role === 1 ? "Admin" : "User"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={user.role === 1}
                          title={user.role === 1 ? "Cannot delete admin users" : "Delete user"}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <Pagination 
                totalItems={filteredUsers.length}
                currentPage={userPage}
                setCurrentPage={setUserPage}
                itemsPerPage={itemsPerPage}
              />
            </>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="admin-section">
        <h3 className="adminHead">All Products ({products.length})</h3>
        
        <SearchBar 
          searchTerm={productSearch}
          setSearchTerm={handleProductSearch}
          placeholder="Search products by title or description..."
          resultCount={filteredProducts.length}
        />

        <div className="card-container-wrapper">
          {filteredProducts.length === 0 ? (
            <p className="no-results">
              {productSearch ? `No products found matching "${productSearch}"` : "No products found."}
            </p>
          ) : (
            <>
              <div className="card-container">
                {getPaginatedData(filteredProducts, productPage).map(item => (
                  <ProductCard
                    key={item._id}
                    item={item}
                    isProfileView={true}
                    handleDelete={() => handleDeleteProduct(item._id)}
                    handleArchive={() => {}}
                  >
                    <Link to={`/edit_product/${item._id}`} className="edit-link">Edit</Link>
                  </ProductCard>
                ))}
              </div>
              
              <Pagination 
                totalItems={filteredProducts.length}
                currentPage={productPage}
                setCurrentPage={setProductPage}
                itemsPerPage={itemsPerPage}
              />
            </>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="admin-section">
        <h3 className="adminHead">All Services ({services.length})</h3>
        
        <SearchBar 
          searchTerm={serviceSearch}
          setSearchTerm={handleServiceSearch}
          placeholder="Search services by title or description..."
          resultCount={filteredServices.length}
        />

        <div className="card-container-wrapper">
          {filteredServices.length === 0 ? (
            <p className="no-results">
              {serviceSearch ? `No services found matching "${serviceSearch}"` : "No services found."}
            </p>
          ) : (
            <>
              <div className="card-container">
                {getPaginatedData(filteredServices, servicePage).map(item => (
                  <ServiceCard
                    key={item._id}
                    item={item}
                    isProfileView={true}
                    handleDelete={() => handleDeleteService(item._id)}
                    handleArchive={() => {}}
                    getUrgencyColor={() => "#850E35"}
                    getStatusColor={() => "#850E35"}
                  />
                ))}
              </div>
              
              <Pagination 
                totalItems={filteredServices.length}
                currentPage={servicePage}
                setCurrentPage={setServicePage}
                itemsPerPage={itemsPerPage}
              />
            </>
          )}
        </div>
      </section>

      {/* Foods Section */}
      <section className="admin-section">
        <h3 className="adminHead">All Foods ({foods.length})</h3>
        
        <SearchBar 
          searchTerm={foodSearch}
          setSearchTerm={handleFoodSearch}
          placeholder="Search foods by title or description..."
          resultCount={filteredFoods.length}
        />

        <div className="card-container-wrapper">
          {filteredFoods.length === 0 ? (
            <p className="no-results">
              {foodSearch ? `No foods found matching "${foodSearch}"` : "No foods found."}
            </p>
          ) : (
            <>
              <div className="card-container">
                {getPaginatedData(filteredFoods, foodPage).map(item => (
                  <article className="custom-card" key={item._id}>
                    <div className="card-body">
                      <h3 className="card-title">{item.title}</h3>
                      <p className="card-description">{item.description}</p>
                      <div className="card-price-date">
                        <span className="card-price">₹ {item.budget}</span>
                        <span className="card-date">{item.updatedAt?.slice(0, 10)}</span>
                      </div>
                      <div className="card-actions">
                        <Link to={`/edit_food/${item._id}`} className="card-edit">Edit</Link>
                        <button className="card-delete" onClick={() => handleDeleteFood(item._id)}>Delete</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              
              <Pagination 
                totalItems={filteredFoods.length}
                currentPage={foodPage}
                setCurrentPage={setFoodPage}
                itemsPerPage={itemsPerPage}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;