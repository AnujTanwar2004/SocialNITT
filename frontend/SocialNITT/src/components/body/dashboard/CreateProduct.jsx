import React, { useState } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../../utils/axiosClient";
import {
  isEmpty,
  priceValidate,
  validatePhone,
} from "../../utils/validation/Validation";
import {
  showSuccessMsg,
  showErrMsg,
} from "../../utils/notification/Notification";
import { useNavigate } from "react-router-dom";

const initialState = {
  title: "",
  price: 0,
  description: "",
  location: "",
  category: "",
  phone: "",
  image: "",
  err: "",
  success: "",
};
const categories = [
  "Sports",
  "Fashion",
  "Electronics",
  "Utility",
  "Instruments",
  "IT & Technical",
  "Stationary",
  "Others(Contact admin to add category)",
];

function CreateProduct() {
  const [product, setProduct] = useState(initialState);
  const {
    title,
    price,
    description,
    location,
    category,
    phone,
    image,
    err,
    success,
  } = product;

  const { user } = useSelector((state) => state.auth);
  const userId = user._id;

  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value, err: "", success: "" });
  };

  // ✅ FIXED: Remove manual token handling - let axiosClient handle it
  const changeAvatar = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (!file)
        return setProduct({
          ...product,
          err: "No files were uploaded.",
          success: "",
        });

      if (file.size > 1024 * 1024)
        return setProduct({
          ...product,
          err: "Size too large. Max 1MB",
          success: "",
        });

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return setProduct({
          ...product,
          err: "File format is incorrect. Use JPG/PNG",
          success: "",
        });

      const formData = new FormData();
      formData.append("file", file);

      setLoading(true);

      // ✅ FIXED: Remove manual token - axiosClient handles it automatically
      const res = await axiosClient.post("/api/upload/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // No manual Authorization header needed
        },
      });

      setLoading(false);
      console.log("Upload Response: ", res.data);

      setProduct({
        ...product,
        image: res.data.url,
        err: "",
        success: "Image uploaded successfully",
      });
    } catch (err) {
      console.error("Upload Error:", err);
      setProduct({
        ...product,
        err: err.response?.data?.msg || "Upload failed",
        success: "",
      });
      setLoading(false);
    }
  };

  // ✅ FIXED: Remove manual token handling - let axiosClient handle it
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      isEmpty(title) ||
      isEmpty(price) ||
      isEmpty(description) ||
      isEmpty(location) ||
      isEmpty(category) ||
      isEmpty(phone)
    )
      return setProduct({
        ...product,
        err: "Please fill in all fields",
        success: "",
      });

    if (priceValidate(price))
      return setProduct({
        ...product,
        err: "Price must be greater than or equal to 0",
        success: "",
      });

    if (!validatePhone(phone))
      return setProduct({
        ...product,
        err: "Enter a valid phone number",
        success: "",
      });

    if (!image)
      return setProduct({
        ...product,
        err: "Please upload an image",
        success: "",
      });

    try {
      console.log({
        title,
        description,
        price,
        location,
        category,
        phone,
        image,
        userId,
      });

      // ✅ FIXED: Remove manual token - axiosClient handles it automatically
      const res = await axiosClient.post("/api/products", {
        title,
        description,
        price: Number(price),
        location,
        category,
        phone: Number(phone),
        image,
      });
      // No manual headers needed - axiosClient handles token automatically

      setProduct({ ...initialState, success: res.data.msg });
    } catch (err) {
      console.error("Create Product Error:", err);
      setProduct({
        ...product,
        err: err.response?.data?.msg || "Submit failed",
        success: "",
      });
    }
  };

  return (
    <>
      <div>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        {loading && <h3>Loading.....</h3>}
      </div>

      <div className="back">
        <button onClick={() => navigate(-1)} className="go_back">
          <i className="fas fa-long-arrow-alt-left"></i> Go Back
        </button>
      </div>

      <div className="create_product">
        <h2>Create Product</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChangeInput}
              required
            />
          </div>
          <div>
            <label htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              value={price}
              onChange={handleChangeInput}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              value={description}
              onChange={handleChangeInput}
              required
            />
          </div>
          <div>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              name="location"
              value={location}
              onChange={handleChangeInput}
              required
            />
          </div>
          <div>
            <label htmlFor="category">Product Category*</label>
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
            <label htmlFor="phone">Phone no.</label>
            <input
              type="text"
              name="phone"
              value={phone}
              onChange={handleChangeInput}
              required
            />
          </div>

          <div className="row file">
            <input type="file" name="file" onChange={changeAvatar} />
          </div>

          <div className="row">
            <button type="submit" disabled={loading || !image}>
              Create
            </button>
          </div>
        </form>

        {/* Preview Section */}
        <button
          type="button"
          className="card-button"
          onClick={() => setShowPreview((prev) => !prev)}
        >
          {showPreview ? "Hide Preview" : "Preview"}
        </button>
        {showPreview && (
          <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
            <div
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                textAlign: "center",
                fontWeight: "bold",
                borderRadius: "8px 8px 0 0",
              }}
            >
              📋 PREVIEW - How your product will look
            </div>

            {/* Use exact ProductCard structure */}
            <article
              className="custom-card"
              style={{ border: "2px solid #007bff", borderTop: "none" }}
            >
              <div className="card-image-wrapper">
                {image && (
                  <img
                    src={image}
                    alt={title || "Product Preview"}
                    className="card-image"
                    loading="lazy"
                    onError={(e) => {
                      console.error("Preview image failed to load:", image);
                      e.target.src =
                        "http://localhost:5000/uploads/default-avatar.png";
                    }}
                  />
                )}
                {/* You can add sale badge if needed */}
                {/* <span className="badge">Sale</span> */}
              </div>

              <div className="card-body">
                <h3 className="card-title">{title || "Product Title"}</h3>
                <div className="card-description">
                  <p>
                    {description || "Product description will appear here..."}
                  </p>
                </div>
                <div className="card-price-date">
                  <span className="card-price">₹ {price || "0"}</span>
                  <span className="card-date">
                    {new Date().toISOString().slice(0, 10)}
                  </span>
                </div>

                {/* Additional info like in your other cards */}
                <div
                  style={{
                    fontSize: "13px",
                    color: "#888",
                    marginTop: "0.5rem",
                  }}
                >
                  {category && <span>🏷️ {category}</span>}
                  {category && location && " | "}
                  {location && <span>📍 {location}</span>}
                  {(category || location) && phone && " | "}
                  {phone && <span>📞 {phone}</span>}
                </div>

                {/* User info */}
                {user && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "0.5rem",
                      background: "#f8f9fa",
                      borderRadius: "4px",
                      fontSize: "12px",
                      color: "#6c757d",
                    }}
                  >
                    Posted by: <strong>{user.name}</strong>
                  </div>
                )}
              </div>

              {/* See More button like in ProductCard */}
              <div className="service-card-user see-more-wrapper">
                <span
                  className="see-more-button"
                  style={{
                    cursor: "default",
                    opacity: "0.7",
                  }}
                >
                  See More
                </span>
              </div>
            </article>
          </div>
        )}
      </div>
    </>
  );
}

export default CreateProduct;
