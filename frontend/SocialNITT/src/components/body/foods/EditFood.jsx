import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  showSuccessMsg,
  showErrMsg,
} from "../../utils/notification/Notification";
import {
  isEmpty,
  priceValidate,
  validatePhone,
} from "../../utils/validation/Validation";
import { fetchFoods } from "../../../redux/slices/foodSlice";

const initialState = {
  title: "",
  description: "",
  budget: 0,
  location: "",
  category: "",
  urgency: "Medium",
  phone: "",
  status: "Active",
  isArchived: 0,
  err: "",
  success: "",
};

function EditFood() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const foods = useSelector((state) => state.foods.items);
  const auth = useSelector((state) => state.auth);
  const { token } = auth;

  // ✅ Fix variable naming
  const [editFood, setFood] = useState(initialState);
  const {
    title,
    description,
    budget,
    location,
    category,
    urgency,
    phone,
    status,
    isArchived,
    err,
    success,
  } = editFood; // ✅ Fixed variable name

  const [oldFood, setOldFood] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const categories = [
    "North Indian",
    "South Indian",
    "Chinese",
    "Italian",
    "Fast Food",
    "Beverages",
    "Desserts",
    "Others",
  ];

  const urgencyLevels = ["Low", "Medium", "High", "Urgent"];
  const statusOptions = ["Active", "In Progress", "Completed", "Cancelled"];

  // Fetch services if not already loaded
  useEffect(() => {
    if (!foods || foods.length === 0) {
      dispatch(fetchFoods());
    }
  }, [dispatch, foods]);

  useEffect(() => {
    if (foods && foods.length !== 0) {
      const foundFood = foods.find((food) => food._id === id);
      if (foundFood) {
        setOldFood(foundFood);
        setFood(foundFood);
      } else {
        console.log("Food not found, redirecting to foods page");
        navigate("/foods");
      }
    }
  }, [foods, id, navigate]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFood({ ...editFood, [name]: value, err: "", success: "" }); // ✅ Fixed variable name
  };

  const handleUpdate = async () => {
    if (
      isEmpty(title) ||
      isEmpty(description) ||
      isEmpty(location) ||
      isEmpty(category) ||
      isEmpty(phone)
    )
      return setFood({
        // ✅ Fixed variable name
        ...editFood,
        err: "Please fill in all fields",
        success: "",
      });

    if (priceValidate(budget))
      return setFood({
        // ✅ Fixed variable name
        ...editFood,
        err: "Budget must be greater than or equal to 0",
        success: "",
      });

    if (!validatePhone(phone))
      return setFood({
        // ✅ Fixed variable name
        ...editFood,
        err: "Enter a valid phone number",
        success: "",
      });

    try {
      setLoading(true);

      const updateData = {
        title: title || oldFood.title,
        description: description || oldFood.description,
        budget: budget || oldFood.budget,
        location: location || oldFood.location,
        category: category || oldFood.category,
        urgency: urgency || oldFood.urgency,
        phone: phone || oldFood.phone,
        status,
        isArchived,
      };

      await axios.patch(`/api/foods/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setLoading(false);
      setFood({
        // ✅ Fixed variable name
        ...editFood,
        err: "",
        success: "Food updated successfully!",
      });

      dispatch(fetchFoods());

      setTimeout(() => {
        navigate("/foods");
      }, 2000);
    } catch (err) {
      setLoading(false);
      setFood({
        // ✅ Fixed variable name
        ...editFood,
        err: err.response?.data?.msg || "Update failed",
        success: "",
      });
    }
  };

  return (
    <div className="profile_page">
      <div className="col-left">
        <div>
          {err && showErrMsg(err)}
          {success && showSuccessMsg(success)}
          {loading && <h3>Loading.....</h3>}
        </div>

        <h2>Edit Food Request</h2>

        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="title">Food Title</label>
            <input
              type="text"
              placeholder="Service title"
              id="title"
              value={title}
              name="title"
              onChange={handleChangeInput}
            />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea
              placeholder="Service description"
              id="description"
              value={description}
              name="description"
              onChange={handleChangeInput}
              rows="4"
              style={{
                width: "100%",
                margin: "5px 0",
                padding: "5px",
                background: "#ffffff",
                border: "2px solid #777",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>

          <div>
            <label htmlFor="budget">Budget (₹)</label>
            <input
              type="number"
              placeholder="Budget"
              id="budget"
              value={budget}
              name="budget"
              onChange={handleChangeInput}
              min="0"
            />
          </div>

          <div>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              name="category"
              onChange={handleChangeInput}
              style={{
                width: "100%",
                height: "40px",
                maArgin: "5px 0",
                background: "#ffffff",
                padding: "0 5px",
                border: "2px solid #777",
                outline: "none",
              }}
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
            <label htmlFor="urgency">Urgency Level</label>
            <select
              id="urgency"
              value={urgency}
              name="urgency"
              onChange={handleChangeInput}
              style={{
                width: "100%",
                height: "40px",
                margin: "5px 0",
                background: "#ffffff",
                padding: "0 5px",
                border: "2px solid #777",
                outline: "none",
              }}
            >
              {urgencyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              name="status"
              onChange={handleChangeInput}
              style={{
                width: "100%",
                height: "40px",
                margin: "5px 0",
                background: "#ffffff",
                padding: "0 5px",
                border: "2px solid #777",
                outline: "none",
              }}
            >
              {statusOptions.map((stat) => (
                <option key={stat} value={stat}>
                  {stat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              placeholder="Service location"
              id="location"
              value={location}
              name="location"
              onChange={handleChangeInput}
            />
          </div>

          <div>
            <label htmlFor="phone">Contact Phone</label>
            <input
              type="tel"
              placeholder="Contact number"
              id="phone"
              value={phone}
              name="phone"
              onChange={handleChangeInput}
            />
          </div>

          <div>
            <label htmlFor="isArchived">Archive Status</label>
            <select
              id="isArchived"
              value={isArchived}
              name="isArchived"
              onChange={handleChangeInput}
              style={{
                width: "100%",
                height: "40px",
                margin: "5px 0",
                background: "#ffffff",
                padding: "0 5px",
                border: "2px solid #777",
                outline: "none",
              }}
            >
              <option value={0}>Active</option>
              <option value={1}>Archived</option>
            </select>
          </div>

          <button type="button" onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Food"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditFood;
