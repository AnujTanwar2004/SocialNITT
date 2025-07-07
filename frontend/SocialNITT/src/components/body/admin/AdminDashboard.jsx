import React, { useEffect, useState, useMemo, useCallback } from "react";
import axiosClient from "../../utils/axiosClient";
import ProductCard from "../../cards/ProductCard";
import ServiceCard from "../../cards/ServiceCard";
import FoodCard from "../../cards/FoodCard";
import { Link, useNavigate } from "react-router-dom";
import "./adminDashboard.css";

// Move SearchBar component outside to prevent re-creation - FIXED VERSION
const SearchBar = React.memo(
  ({ searchTerm, setSearchTerm, placeholder, resultCount }) => {
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
              onClick={() => setSearchTerm("")}
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
              Found {resultCount} result{resultCount !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    );
  }
);

// Move Pagination component outside to prevent re-creation - FIXED VERSION
const Pagination = React.memo(
  ({ totalItems, currentPage, setCurrentPage, itemsPerPage = 5 }) => {
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
          pages.push("...");
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push("...");
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push("...");
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push("...");
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

        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={index} className="pagination-ellipsis">
              ...
            </span>
          ) : (
            <button
              key={index}
              className={`pagination-btn ${
                currentPage === page ? "active" : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          )
        )}

        <button
          className="pagination-btn next-btn"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  }
);

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [foods, setFoods] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false); //  Added missing loading state
  const navigate = useNavigate();

  // Search states
  const [userSearch, setUserSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [foodSearch, setFoodSearch] = useState("");
  const [contactSearch, setContactSearch] = useState("");

  // Pagination states
  const [userPage, setUserPage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);
  const [foodPage, setFoodPage] = useState(1);
  const [contactPage, setContactPage] = useState(1);

  // Reply modal state
  const [replyModal, setReplyModal] = useState({ open: false, contact: null });
  const [replyText, setReplyText] = useState("");

  //  Fixed itemsPerPage - moved to top and set to 5
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, servicesRes, foodsRes, usersRes, contactsRes] =
          await Promise.all([
            axiosClient.get("/api/products/admin/all"),
            axiosClient.get("/api/services/admin/all"), 
            axiosClient.get("/api/foods/admin/all"), //  Fixed to use admin endpoint
            axiosClient.get("/user/admin/all"),
            axiosClient.get("/api/contact/admin/all"),
          ]);

        setProducts(productsRes.data);
        setServices(servicesRes.data);
        setFoods(foodsRes.data);
        setUsers(usersRes.data);
        setContacts(contactsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter functions with proper string handling
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const searchLower = userSearch.toLowerCase().trim();
    return users.filter(
      (user) =>
        (user.name && user.name.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower))
    );
  }, [users, userSearch]);

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    const searchLower = productSearch.toLowerCase().trim();
    return products.filter(
      (product) =>
        (product.title && product.title.toLowerCase().includes(searchLower)) ||
        (product.description &&
          product.description.toLowerCase().includes(searchLower))
    );
  }, [products, productSearch]);

  const filteredServices = useMemo(() => {
    if (!serviceSearch.trim()) return services;
    const searchLower = serviceSearch.toLowerCase().trim();
    return services.filter(
      (service) =>
        (service.title && service.title.toLowerCase().includes(searchLower)) ||
        (service.description &&
          service.description.toLowerCase().includes(searchLower))
    );
  }, [services, serviceSearch]);

  const filteredFoods = useMemo(() => {
    if (!foodSearch.trim()) return foods;
    const searchLower = foodSearch.toLowerCase().trim();
    return foods.filter(
      (food) =>
        (food.title && food.title.toLowerCase().includes(searchLower)) ||
        (food.description &&
          food.description.toLowerCase().includes(searchLower))
    );
  }, [foods, foodSearch]);

  const filteredContacts = useMemo(() => {
    if (!contactSearch.trim()) return contacts;
    const searchLower = contactSearch.toLowerCase().trim();
    return contacts.filter(
      (contact) =>
        (contact.name && contact.name.toLowerCase().includes(searchLower)) ||
        (contact.email && contact.email.toLowerCase().includes(searchLower)) ||
        (contact.message && contact.message.toLowerCase().includes(searchLower))
    );
  }, [contacts, contactSearch]);

  //   Fixed pagination helper function
  const getPaginatedData = useCallback(
    (data, currentPage) => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const result = data.slice(startIndex, endIndex);

      // Debug pagination
      console.log(`Pagination Debug:`, {
        totalItems: data.length,
        currentPage,
        itemsPerPage,
        startIndex,
        endIndex,
        resultLength: result.length,
      });

      return result;
    },
    [itemsPerPage]
  );

  // Search handlers to prevent state issues - STABLE REFERENCES
  const handleUserSearch = useCallback((value) => {
    setUserSearch(value);
    setUserPage(1); //  Reset page when searching
  }, []);

  const handleProductSearch = useCallback((value) => {
    setProductSearch(value);
    setProductPage(1); //  Reset page when searching
  }, []);

  const handleServiceSearch = useCallback((value) => {
    setServiceSearch(value);
    setServicePage(1); //  Reset page when searching
  }, []);

  const handleFoodSearch = useCallback((value) => {
    setFoodSearch(value);
    setFoodPage(1); //  Reset page when searching
  }, []);

  const handleContactSearch = useCallback((value) => {
    setContactSearch(value);
    setContactPage(1); // Reset page when searching
  }, []);

  //  Fixed Archive function - use admin endpoints
  const handleArchive = useCallback(
    async (itemId, currentArchiveStatus, type) => {
      try {
        setLoading(true);

        const newArchiveStatus = currentArchiveStatus === 1 ? 0 : 1;

        // Use admin endpoints for admin operations
        let endpoint;
        if (type === "product") {
          endpoint = `/api/products/${itemId}`; // Products can use regular endpoint
        } else {
          endpoint = `/api/${type}s/admin/${itemId}`; // Services and Foods need admin endpoint
        }

        await axiosClient.patch(endpoint, {
          isArchived: newArchiveStatus,
        });

        // Update the local state based on type using functional updates
        if (type === "product") {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product._id === itemId
                ? { ...product, isArchived: newArchiveStatus }
                : product
            )
          );
        } else if (type === "service") {
          setServices((prevServices) =>
            prevServices.map((service) =>
              service._id === itemId
                ? { ...service, isArchived: newArchiveStatus }
                : service
            )
          );
        } else if (type === "food") {
          setFoods((prevFoods) =>
            prevFoods.map((food) =>
              food._id === itemId
                ? { ...food, isArchived: newArchiveStatus }
                : food
            )
          );
        }

        setLoading(false);

        alert(
          newArchiveStatus === 1
            ? `${type} archived successfully!`
            : `${type} unarchived successfully!`
        );
      } catch (err) {
        setLoading(false);
        console.error("Archive error:", err);
        alert(err.response?.data?.msg || "Archive update failed");
      }
    },
    []
  );

  // Delete handlers
  const handleDeleteProduct = useCallback((id) => {
    if (window.confirm("Delete this product?")) {
      setLoading(true);
      axiosClient
        .delete(`/api/products/admin/${id}`)
        .then(() => {
          setProducts((prev) => prev.filter((p) => p._id !== id));
          setLoading(false);
        })
        .catch((err) => {
          console.error("Delete error:", err);
          setLoading(false);
        });
    }
  }, []);

  const handleDeleteService = useCallback((id) => {
    if (window.confirm("Delete this service?")) {
      setLoading(true);
      axiosClient
        .delete(`/api/services/admin/${id}`) // Fixed missing slash
        .then(() => {
          setServices((prev) => prev.filter((s) => s._id !== id));
          setLoading(false);
        })
        .catch((err) => {
          console.error("Delete error:", err);
          setLoading(false);
        });
    }
  }, []);

  const handleDeleteFood = useCallback((id) => {
    if (window.confirm("Delete this food?")) {
      setLoading(true);
      axiosClient
        .delete(`/api/foods/admin/${id}`)
        .then(() => {
          setFoods((prev) => prev.filter((f) => f._id !== id));
          setLoading(false);
        })
        .catch((err) => {
          console.error("Delete error:", err);
          setLoading(false);
        });
    }
  }, []);

  const handleDeleteUser = useCallback((id) => {
    if (window.confirm("Delete this user? This action cannot be undone.")) {
      setLoading(true);
      axiosClient
        .delete(`/user/admin/${id}`)
        .then(() => {
          setUsers((prev) => prev.filter((u) => u._id !== id));
          setLoading(false);
        })
        .catch((err) => {
          console.error("Delete error:", err);
          setLoading(false);
        });
    }
  }, []);

  const handleDeleteContact = useCallback((id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      setLoading(true);
      axiosClient
        .delete(`/api/contact/admin/${id}`)
        .then(() => {
          setContacts((prev) => prev.filter((contact) => contact._id !== id));
          setLoading(false);
          alert("Contact deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting contact:", error);
          setLoading(false);
          alert("Failed to delete contact");
        });
    }
  }, []);

   
  const handleMarkAsRead = useCallback((id) => {
    axiosClient
      .patch(`/api/contact/admin/${id}/read`)
      .then(() => {
        setContacts((prev) =>
          prev.map((contact) =>
            contact._id === id ? { ...contact, status: "read" } : contact
          )
        );
      })
      .catch((error) => console.error("Error marking as read:", error));
  }, []);

  // Reply handler
  const handleReply = useCallback((contact) => {
    setReplyModal({ open: true, contact });
    setReplyText("");
  }, []);

  const sendReply = useCallback(() => {
    if (!replyText.trim()) {
      alert("Please enter a reply message");
      return;
    }

    axiosClient
      .post(`/api/contact/admin/${replyModal.contact._id}/reply`, {
        reply: replyText,
      })
      .then(() => {
        setContacts((prev) =>
          prev.map((contact) =>
            contact._id === replyModal.contact._id
              ? { ...contact, status: "replied", adminReply: replyText }
              : contact
          )
        );
        setReplyModal({ open: false, contact: null });
        setReplyText("");
        alert("Reply sent successfully!");
      })
      .catch((error) => {
        console.error("Error sending reply:", error);
        alert("Failed to send reply");
      });
  }, [replyText, replyModal.contact]);

  const getUrgencyColor = useCallback((urgency) => {
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
  }, []);

  const getStatusColor = useCallback((status) => {
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
  }, []);

  //  approval handler
  const handleApproval = useCallback(
    async (itemId, currentApprovalStatus, type) => {
      try {
        setLoading(true);

        const newApprovalStatus = !currentApprovalStatus;

        await axiosClient.patch(`/api/${type}s/admin/${itemId}/approve`, {
          isApproved: newApprovalStatus,
        });

        // Update local state
        if (type === "product") {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product._id === itemId
                ? { ...product, isApproved: newApprovalStatus }
                : product
            )
          );
        } else if (type === "service") {
          setServices((prevServices) =>
            prevServices.map((service) =>
              service._id === itemId
                ? { ...service, isApproved: newApprovalStatus }
                : service
            )
          );
        } else if (type === "food") {
          setFoods((prevFoods) =>
            prevFoods.map((food) =>
              food._id === itemId
                ? { ...food, isApproved: newApprovalStatus }
                : food
            )
          );
        }

        setLoading(false);
        alert(
          newApprovalStatus
            ? `${type} approved successfully!`
            : `${type} approval revoked!`
        );
      } catch (err) {
        setLoading(false);
        console.error("Approval error:", err);
        alert(err.response?.data?.msg || "Approval update failed");
      }
    },
    []
  );

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">🛡️ Admin Dashboard</h1>

      {/*  loading indicator */}
      {loading && (
        <div
          className="loading-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div style={{ color: "white", fontSize: "18px" }}>Processing...</div>
        </div>
      )}

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
              {userSearch
                ? `No users found matching "${userSearch}"`
                : "No users found."}
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
                  {getPaginatedData(filteredUsers, userPage).map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`role-badge ${
                            user.role === 1 ? "admin" : "user"
                          }`}
                        >
                          {user.role === 1 ? "Admin" : "User"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={user.role === 1}
                          title={
                            user.role === 1
                              ? "Cannot delete admin users"
                              : "Delete user"
                          }
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
              {productSearch
                ? `No products found matching "${productSearch}"`
                : "No products found."}
            </p>
          ) : (
            <>
              <div className="card-container">
                {getPaginatedData(filteredProducts, productPage).map((item) => (
                  <ProductCard
                    key={item._id}
                    item={item}
                    isProfileView={true}
                    handleDelete={() => handleDeleteProduct(item._id)}
                    handleArchive={(itemId, currentStatus) =>
                      handleArchive(itemId, currentStatus, "product")
                    }
                    handleApproval={(itemId, currentStatus) =>
                      handleApproval(itemId, currentStatus, "product")
                    } //   Add this
                  />
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
              {serviceSearch
                ? `No services found matching "${serviceSearch}"`
                : "No services found."}
            </p>
          ) : (
            <>
              <div className="card-container">
                {getPaginatedData(filteredServices, servicePage).map((item) => (
                  <ServiceCard
                    key={item._id}
                    item={item}
                    isProfileView={true}
                    handleDelete={() => handleDeleteService(item._id)}
                    handleArchive={(itemId, currentStatus) =>
                      handleArchive(itemId, currentStatus, "service")
                    }
                    handleApproval={(itemId, currentStatus) =>  
                    handleApproval(itemId, currentStatus, "service")
                    }
                    getUrgencyColor={getUrgencyColor}
                    getStatusColor={getStatusColor}
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
              {foodSearch
                ? `No foods found matching "${foodSearch}"`
                : "No foods found."}
            </p>
          ) : (
            <>
              <div className="card-container">
                {getPaginatedData(filteredFoods, foodPage).map((item) => (
                  <FoodCard
                    key={item._id}
                    item={item}
                    isProfileView={true}
                    handleDelete={() => handleDeleteFood(item._id)}
                    handleArchive={(itemId, currentStatus) =>
                      handleArchive(itemId, currentStatus, "food")
                    }
                    handleApproval={(
                      itemId,
                      currentStatus //   Add this
                    ) => handleApproval(itemId, currentStatus, "food")}
                    getUrgencyColor={getUrgencyColor}
                    getStatusColor={getStatusColor}
                  />
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

      {/* Contact Messages Section */}
      <section className="admin-section">
        <h3 className="adminHead">📧 Contact Messages ({contacts.length})</h3>

        <SearchBar
          searchTerm={contactSearch}
          setSearchTerm={handleContactSearch}
          placeholder="Search contacts by name, email, or message..."
          resultCount={filteredContacts.length}
        />

        <div className="users-table-container">
          {filteredContacts.length === 0 ? (
            <p className="no-results">
              {contactSearch
                ? `No contacts found matching "${contactSearch}"`
                : "No contact messages found."}
            </p>
          ) : (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedData(filteredContacts, contactPage).map(
                    (contact) => (
                      <tr key={contact._id}>
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td
                          style={{ maxWidth: "300px", wordWrap: "break-word" }}
                        >
                          {contact.message.length > 100
                            ? `${contact.message.substring(0, 100)}...`
                            : contact.message}
                        </td>
                        <td>
                          <span className={`role-badge ${contact.status}`}>
                            {contact.status}
                          </span>
                        </td>
                        <td>
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              gap: "5px",
                              flexWrap: "wrap",
                            }}
                          >
                            {contact.status === "unread" && (
                              <button
                                className="edit-btn"
                                onClick={() => handleMarkAsRead(contact._id)}
                              >
                                Mark Read
                              </button>
                            )}
                            <button
                              className="edit-btn"
                              onClick={() => handleReply(contact)}
                            >
                              Reply
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteContact(contact._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              <Pagination
                totalItems={filteredContacts.length}
                currentPage={contactPage}
                setCurrentPage={setContactPage}
                itemsPerPage={itemsPerPage}
              />
            </>
          )}
        </div>
      </section>

      {/* Reply Modal */}
      {replyModal.open && (
        <div
          className="modal-overlay"
          onClick={() => setReplyModal({ open: false, contact: null })}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Reply to {replyModal.contact.name}</h3>
            <div style={{ marginBottom: "15px" }}>
              <strong>Original Message:</strong>
              <p
                style={{
                  background: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "5px",
                  marginTop: "5px",
                }}
              >
                {replyModal.contact.message}
              </p>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              rows="5"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            />
            <div
              style={{
                marginTop: "15px",
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="delete-btn"
                onClick={() => setReplyModal({ open: false, contact: null })}
              >
                Cancel
              </button>
              <button className="edit-btn" onClick={sendReply}>
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
