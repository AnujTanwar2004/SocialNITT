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

  const FoodTypes = ["One-time", "Recurring", "Project-based"];
  const urgencyLevels = ["Low", "Medium", "High", "Urgent"];

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFood({ ...food, [name]: value, err: "", success: "" });
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
      await axios.post(
        "/api/foods",
        {
          title,
          description,
          budget,
          location,
          category,
          urgency,
          phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  return (
    <div className="create_product">
      <h2>Post Food Request</h2>

      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}

      <form onSubmit={handleSubmit}>
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

        <div className="row">
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Post Service Request"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateFood;
