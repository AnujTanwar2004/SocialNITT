import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  isEmpty,
  priceValidate,
  validatePhone,
} from "../../utils/validation/Validation";
import {
  showSuccessMsg,
  showErrMsg,
} from "../../utils/notification/Notification";

const initialState = {
  title: "",
  description: "",
  budget: 0,
  location: "",
  category: "",
  urgency: "Medium",
  phone: "",
  err: "",
  success: "",
};

function CreateFood() {
  const [food, setFood] = useState(initialState);
  const {
    title,
    description,
    budget,
    location,
    category,
    urgency,
    phone,
    err,
    success,
  } = food;

  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const navigate = useNavigate();

  const categories = [
    "Wafours",
    "Dry-Fruits",
    "South-Indian Cousine",
    "North-Indian Cousine",
    "Breakfast",
    "Snacks",
    "Extra Food",
    "dariy product",
    "extra food",
    "Others",
  ];

  const urgencyLevels = ["Low", "Medium", "High", "Urgent"];

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFood({ ...food, [name]: value, err: "", success: "" });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      isEmpty(title) ||
      isEmpty(description) ||
      isEmpty(location) ||
      isEmpty(category) ||
      isEmpty(phone)
    )
      return setFood({
        ...food,
        err: "Please fill in all fields",
        success: "",
      });

    if (priceValidate(budget))
      return setFood({
        ...food,
        err: "Budget must be greater than or equal to 0",
        success: "",
      });

    if (!validatePhone(phone))
      return setFood({
        ...food,
        err: "Enter a valid phone number",
        success: "",
      });

    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("budget", budget);
      formData.append("location", location);
      formData.append("category", category);
      formData.append("urgency", urgency);
      formData.append("phone", phone);
     // if (image) formData.append("image", image);

      await axios.post("/api/foods", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setFood({
        ...food,
        err: "",
        success: "Food request created successfully!",
      });
      setLoading(false);

      setTimeout(() => {
        navigate("/foods");
      }, 2000);
    } catch (err) {
      setLoading(false);
      setFood({
        ...food,
        err: err.response?.data?.msg || "Food creation failed",
        success: "",
      });
    }
  };

  // Helper function to get urgency color
  const getUrgencyColor = (urgencyLevel) => {
    switch (urgencyLevel) {
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
    <div className="create_product">
      <h2>Post Food Request</h2>

      {showPreview && (
        <div
          className="preview-card custom-card"
          style={{ 
            marginBottom: "2rem",
            border: "2px solid #850E35",
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "white",
            boxShadow: "0 4px 8px rgba(133, 14, 53, 0.1)"
          }}
        >
          {/* Preview Header */}
          <div style={{
            background: "linear-gradient(135deg, #850E35, #EE6983)",
            color: "white",
            padding: "10px 15px",
            fontSize: "14px",
            fontWeight: "600",
            textAlign: "center"
          }}>
            📋 PREVIEW - How your food request will appear
          </div>

          {/* Image Preview (if image is selected) */}
          {imagePreviewUrl && (
            <div className="card-image-wrapper">
              <img
                src={imagePreviewUrl}
                alt="Preview"
                className="card-image"
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          <div className="card-body" style={{ padding: "1.5rem" }}>
            {/* Title */}
            <h3 className="card-title" style={{ 
              color: "#850E35", 
              marginBottom: "0.75rem",
              fontSize: "1.2rem",
              fontWeight: "600"
            }}>
              {title || "Food Title"}
            </h3>

            {/* Description */}
            <p className="card-description" style={{ 
              color: "#6c757d",
              marginBottom: "1rem",
              lineHeight: "1.5"
            }}>
              {description || "Food description will appear here..."}
            </p>

            {/* Price and Location Row */}
            <div className="card-price-date" style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              padding: "0.75rem",
              background: "#FFF5E4",
              borderRadius: "8px"
            }}>
              <span className="card-price" style={{
                fontWeight: "700",
                color: "#28a745",
                fontSize: "1.1rem"
              }}>
                ₹ {budget || "0"}
              </span>
              <span className="card-date" style={{
                color: "#6c757d",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                📍 {location || "Location"}
              </span>
            </div>

            {/* Category, Phone, and Urgency Info */}
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: "8px",
              alignItems: "center",
              fontSize: "13px"
            }}>
              <span style={{
                background: "rgba(133, 14, 53, 0.1)",
                color: "#850E35",
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                🍽️ {category || "Category"}
              </span>
              
              <span style={{
                background: "rgba(108, 117, 125, 0.1)",
                color: "#6c757d",
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                📞 {phone || "Phone"}
              </span>
              
              <span style={{
                background: getUrgencyColor(urgency) + "20",
                color: getUrgencyColor(urgency),
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                ⚡ {urgency}
              </span>
            </div>

            {/* User Info (if available) */}
            {user && (
              <div style={{
                marginTop: "1rem",
                padding: "0.75rem",
                background: "#f8f9fa",
                borderRadius: "8px",
                borderLeft: "3px solid #850E35"
              }}>
                <div style={{ fontSize: "12px", color: "#6c757d" }}>
                  Posted by: <strong>{user.name}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label htmlFor="title">Food Title*</label>
          <input
            type="text"
            placeholder="e.g., Need plumber for kitchen sink repair"
            id="title"
            value={title}
            name="title"
            onChange={handleChangeInput}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description*</label>
          <textarea
            placeholder="Describe your service requirement in detail..."
            id="description"
            value={description}
            name="description"
            onChange={handleChangeInput}
            rows="4"
            required
          />
        </div>

        <div>
          <label htmlFor="category">Food Category*</label>
          <select
            id="category"
            value={category}
            name="category"
            onChange={handleChangeInput}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="budget">Budget (₹)*</label>
          <input
            type="number"
            placeholder="Food Price"
            id="budget"
            value={budget}
            name="budget"
            onChange={handleChangeInput}
            min="0"
            required
          />
        </div>

        <div>
          <label htmlFor="urgency">Urgency Level</label>
          <select
            id="urgency"
            value={urgency}
            name="urgency"
            onChange={handleChangeInput}
          >
            {urgencyLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location">Location*</label>
          <input
            type="text"
            placeholder="Service location"
            id="location"
            value={location}
            name="location"
            onChange={handleChangeInput}
            required
          />
        </div>

        <div>
          <label htmlFor="phone">Contact Phone*</label>
          <input
            type="tel"
            placeholder="Your contact number"
            id="phone"
            value={phone}
            name="phone"
            onChange={handleChangeInput}
            required
          />
        </div>

     {/*    <div>
          <label htmlFor="image">Image (optional)</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div> */}

        <div className="row" style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          <button
            type="button"
            className="card-button"
            onClick={() => setShowPreview((prev) => !prev)}
            style={{
              background: showPreview ? "#6c757d" : "linear-gradient(135deg, #17a2b8, #138496)",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              transition: "all 0.3s ease"
            }}
          >
            {showPreview ? "Hide Preview" : "Preview"}
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Post Service Request"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateFood;