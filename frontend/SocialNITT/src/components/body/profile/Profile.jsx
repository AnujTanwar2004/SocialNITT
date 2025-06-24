import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { isPassword, isMatch } from '../../utils/validation/Validation';
import { showSuccessMsg, showErrMsg } from '../../utils/notification/Notification';
import { fetchProducts } from "../../../redux/slices/productSlice";
import { fetchServices } from "../../../redux/slices/serviceSlice";
import { fetchFoods } from "../../../redux/slices/foodSlice";
import { getImageUrl } from '../../utils/axiosClient';
import ProductCard from "../../cards/ProductCard";
import ServiceCard from "../../cards/ServiceCard";
import FoodCard from '../../cards/FoodCard';



const initialState = {
  name: '',
  password: '',
  cf_password: '',
  err: '',
  success: '',
};

function Profile() {
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);
  const { items: products = [] } = useSelector(state => state.products || { items: [] });
  const { items: services = [] } = useSelector(state => state.services || { items: [] });
  const { items: foods = [] } = useSelector(state => state.foods || { items: [] });
  const getUrgencyColor = (urgency) => {
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
  };
  
  const getStatusColor = (status) => {
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
  };
  

  const { user, isLogged } = auth;
  const [data, setData] = useState(initialState);
  const { name, password, cf_password, err, success } = data;

  const [avatar, setAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [callback, setCallback] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isLogged) {
      dispatch(fetchProducts());
      dispatch(fetchServices());
      dispatch(fetchFoods());
    }
  }, [isLogged, dispatch, callback]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: '', success: '' });
  };

  const changeAvatar = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (!file) return setData({ ...data, err: 'No files uploaded.', success: '' });
      if (file.size > 1024 * 1024) return setData({ ...data, err: 'File too large.', success: '' });
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') return setData({ ...data, err: 'Invalid file type.', success: '' });

      const formData = new FormData();
      formData.append('file', file);

      setLoading(true);
      const res = await axios.post('/api/upload/avatar', formData, {
        headers: { 
          'content-type': 'multipart/form-data', 
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        },
      });
      setLoading(false);
      setAvatar(res.data.url);
    } catch (err) {
      setData({ ...data, err: err.response?.data?.msg || 'Upload failed', success: '' });
      setLoading(false);
    }
  };

  const updateInfor = async () => {
    try {
      await axios.patch('/user/update', {
        name: name || user.name,
        avatar: avatar || user.avatar,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setData({ ...data, err: '', success: 'Updated successfully!' });
    } catch (err) {
      setData({ ...data, err: err.response?.data?.msg || 'Update failed', success: '' });
    }
  };

  const updatePassword = async () => {
    if (!isPassword(password))
      return setData({ ...data, err: 'Password must be min 8 chars, 1 symbol, upper & lower case and a number.', success: '' });

    if (!isMatch(password, cf_password))
      return setData({ ...data, err: 'Passwords did not match.', success: '' });

    try {
      await axios.post('/user/reset', { password }, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } 
      });
      setData({ ...data, err: '', success: 'Password updated successfully!' });
    } catch (err) {
      setData({ ...data, err: err.response?.data?.msg || 'Password update failed', success: '' });
    }
  };

  const handleUpdate = () => {
    if (name || avatar) updateInfor();
    if (password) updatePassword();
  };

  const handleDelete = async (itemId, ownerId, type) => {
    try {
      if (user._id !== ownerId) {
        alert(`You are not authorized to delete this ${type}.`);
        return;
      }

      if (window.confirm(`Delete this ${type} permanently?`)) {
        setLoading(true);
        await axios.delete(`/api/${type}s/${itemId}`, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setLoading(false);
        setCallback(!callback);
      }
    } catch (err) {
      setData({ ...data, err: err.response?.data?.msg || 'Delete failed', success: "" });
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => dateStr ? dateStr.substring(0, 10) : '';

  // Helper function to get user ID from different field types
  const getUserId = (item) => {
    if (typeof item.user === 'string') return item.user;
    if (typeof item.user === 'object' && item.user._id) return item.user._id;
    return null;
  };

  const handleArchive = async (itemId, type) => {
    try {
      setLoading(true);
      await axios.patch(`/api/${type}s/archive/${itemId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setLoading(false);
      setCallback(!callback);
    } catch (err) {
      setData({ ...data, err: err.response?.data?.msg || 'Archive update failed', success: '' });
      setLoading(false);
    }
  };
  

  return (
    <>
      <div>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        {loading && <h3>Loading.....</h3>}
      </div>

      <div className="profile_page">
        <div className="col-left">
          <h2>User Profile</h2>
          <div className="avatar">
            <img 
              src={getImageUrl(avatar || user.avatar)} 
              alt="Profile Avatar" 
              onError={(e) => {
                e.target.src = 'http://localhost:5000/uploads/default-avatar.png'
              }}
            />
            <span>
              <i className="fas fa-camera"></i>
              <p>Change</p>
              <input type="file" name="file" id="file_up" onChange={changeAvatar} />
            </span>
          </div>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" defaultValue={user.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" defaultValue={user.email} disabled />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" name="password" value={password} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" name="cf_password" value={cf_password} onChange={handleChange} />
          </div>
          <button disabled={loading} onClick={handleUpdate}>Update</button>
        </div>

        <div className="col-right">
          {/* Products Section */}
          <div className="cards-primary">
            <div className="cards-header">
              <h2>MY PRODUCTS</h2>
            </div>
            <div className="  card-slider-container">
      <div className="  card-slider">
        {products.map((item) =>
          item.user === user._id ? (
            <ProductCard
              key={item._id}
              item={item}
              isProfileView={true}
              handleDelete={handleDelete}
              handleArchive={handleArchive}
            />
          ) : null
        )}
      </div>
    </div>
          </div>
          {/* Services Section */}
          <div className="cards-primary">
            <div className="cards-header">
              <h2>MY SERVICES</h2>
            </div>
          <div className="card-container">
  {services.map((item) => {
    const itemUserId = getUserId(item);
    return itemUserId === user._id ? (
      <ServiceCard
      key={item._id}
      item={item}
      isProfileView={true}
      handleDelete={handleDelete}
      handleArchive={handleArchive}
      getUrgencyColor={getUrgencyColor}
      getStatusColor={getStatusColor}
    />
    
    ) : null;
  })}
</div>
</div>

{/* Foods Section */}
<div className="cards-primary">
  <div className="cards-header">
    <h2>MY FOODS</h2>
  </div>
  <div className="card-container">
    {foods.map((item) => {
      const itemUserId = getUserId(item);
      return itemUserId === user._id ? (
        <FoodCard
          key={item._id}
          item={item}
          type="food"
          getUrgencyColor={getUrgencyColor}
          getStatusColor={getStatusColor}
          isProfileView={true}
          handleDelete={handleDelete}
          handleArchive={handleArchive}
        />
      ) : null;
    })}
  </div>
</div>

        </div>
      </div>
    </>
  );
}

export default Profile;