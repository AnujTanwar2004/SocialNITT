import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { isPassword, isMatch } from '../../utils/validation/Validation';
import { showSuccessMsg, showErrMsg } from '../../utils/notification/Notification';
import { fetchProducts } from "../../../redux/slices/productSlice";

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
const { items: products } = useSelector(state => state.products)

  const { user, isLogged } = auth;
  const [data, setData] = useState(initialState);
  const { name, password, cf_password, err, success } = data;

  const [avatar, setAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [callback, setCallback] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
  if (isLogged) {
    dispatch(fetchProducts())
  }
}, [isLogged, dispatch, callback])

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
      const res = await axios.post('/api/upload_avatar', formData, {
        headers: { 'content-type': 'multipart/form-data', Authorization: token },
      });
      setLoading(false);
      setAvatar(res.data.url);
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' });
    }
  };

  const updateInfor = async () => {
    try {
      await axios.patch('/user/update', {
        name: name || user.name,
        avatar: avatar || user.avatar,
      }, {
        headers: { Authorization: token },
      });
      setData({ ...data, err: '', success: 'Updated successfully!' });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' });
    }
  };

  const updatePassword = async () => {
    if (!isPassword(password))
      return setData({ ...data, err: 'Password must be min 8 chars, 1 symbol, upper & lower case and a number.', success: '' });

    if (!isMatch(password, cf_password))
      return setData({ ...data, err: 'Passwords did not match.', success: '' });

    try {
      await axios.post('/user/reset', { password }, { headers: { Authorization: token } });
      setData({ ...data, err: '', success: 'Password updated successfully!' });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' });
    }
  };

  const handleUpdate = () => {
    if (name || avatar) updateInfor();
    if (password) updatePassword();
  };

  const handleDelete = async (id) => {
    try {
      if (user._id !== id && window.confirm('Delete this product permanently?')) {
        setLoading(true);
        await axios.delete(`/api/product/${id}`, {
          headers: { Authorization: token },
        });
        setLoading(false);
        setCallback(!callback);
      }
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' });
    }
  };

  const formatDate = (dateStr) => dateStr.substring(0, 10);

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
            <img src={avatar || user.avatar} alt="" />
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
          <div className="cards-primary">
            <div className="cards-header">
              <h2>MY PRODUCTS</h2>
            </div>
            <div className="card-container">
              {products.map((item) =>
                item.user === user._id ? (
                  <article className="card" key={item._id}>
                    <Link to={`/view_product/${item._id}`}>
                      <img src={item.image} loading="lazy" alt={item.title} className="w-full h-48 rounded-tl-md rounded-tr-md" />
                      <div className="card-header">
                        <div className="info">
                          <span className="cost">₹ {item.price}</span>
                          <span className="date">{formatDate(item.updatedAt)}</span>
                        </div>
                      </div>
                      <div className="card-footer">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </Link>
                    <div className="card-archive">
                      <p>ARCHIVED:&nbsp;
                        {item.isArchived === 1 ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i>}
                      </p>
                    </div>
                    <div className="card-actions">
                      <Link to={`/edit_product/${item._id}`}>
                        <i className="fas fa-edit"> Edit</i>
                      </Link>
                      <i className="fas fa-trash-alt" onClick={() => handleDelete(item._id)}> Delete</i>
                    </div>
                  </article>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
