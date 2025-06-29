import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../utils/axiosClient"; // ✅ Changed: Use axiosClient instead of axios
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

function CreateService() {
  const [service, setService] = useState(initialState);
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
  } = service;

  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const navigate = useNavigate();

  const categories = [
    "Construction & Renovation",
    "Plumbing & Water",
    "Electrical",
    "Cleaning & Maintenance",
    "Transportation & Logistics",
    "IT & Technical",
    "Professional Services",
    "Others",
  ];

  const urgencyLevels = ["Low", "Medium", "High", "Urgent"];

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value, err: "", success: "" });
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
      return setService({
        ...service,
        err: "Please fill in all fields",
        success: "",
      });

    if (priceValidate(budget))
      return setService({
        ...service,
        err: "Budget must be greater than or equal to 0",
        success: "",
      });

    if (!validatePhone(phone))
      return setService({
        ...service,
        err: "Enter a valid phone number",
        success: "",
      });

    try {
      setLoading(true);

      // ✅ ONLY CHANGE: Remove manual token handling
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("budget", budget);
      formData.append("location", location);
      formData.append("category", category);
      formData.append("serviceType", "One-time"); // Changed to match your model's enum
      formData.append("urgency", urgency);
      formData.append("phone", phone);

      await axiosClient.post("/api/services", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // ✅ REMOVED: No manual Authorization header
        },
      });

      setService({
        ...service,
        err: "",
        success: "Service request created successfully!",
      });
      setLoading(false);

      setTimeout(() => {
        navigate("/services");
      }, 2000);
    } catch (err) {
      setLoading(false);
      setService({
        ...service,
        err: err.response?.data?.msg || "Service creation failed",
        success: "",
      });
    }
  };

  return (
    <div className="create_product">
      <h2>Post Service Request</h2>

      {showPreview && (
        <div className="preview-card custom-card" style={{ marginBottom: "2rem" }}>
          <div className="card-body">
            <h3 className="card-title">{title}</h3>
            <p className="card-description">{description}</p>
            <div className="card-price-date">
              <span className="card-price">₹ {budget}</span>
              <span className="card-date">{location}</span>
            </div>
            <div style={{ fontSize: "13px", color: "#888" }}>
              <span>{category}</span> | <span>{phone}</span> | <span>{urgency}</span>
            </div>
          </div>
        </div>
      )}

      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label htmlFor="title">Service Title*</label>
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
          <label htmlFor="category">Service Category*</label>
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
            placeholder="Your budget for this service"
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



        <div className="row" style={{ display: "flex", gap: "1rem" }}>
          <button
            type="button"
            className="card-button"
            onClick={() => setShowPreview((prev) => !prev)}
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

export default CreateService;