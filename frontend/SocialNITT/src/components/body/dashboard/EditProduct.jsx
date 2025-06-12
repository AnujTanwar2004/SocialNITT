import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { showSuccessMsg, showErrMsg } from '../../utils/notification/Notification'
import { isEmpty, priceValidate } from '../../utils/validation/Validation'
import { fetchProducts } from '../../../redux/slices/productSlice'

const initialState = {
  title: '',
  price: 0,
  description: '',
  location: '',
  category: '',
  phone: '',
  isArchived: 0,
  err: '',
  success: ''
}

function EditProduct() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Fixed selectors
  const products = useSelector(state => state.products.items) // Changed from state.products.products
  const auth = useSelector(state => state.auth)
  const { token } = auth // Get token from auth state

  const [editProduct, setProduct] = useState(initialState)
  const { title, price, description, location, category, phone, isArchived, image, err, success } = editProduct

  const [oldProduct, setOldProduct] = useState(initialState)
  const [avatar, setAvatar] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch products if not already loaded
  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchProducts())
    }
  }, [dispatch, products])

  useEffect(() => {
    if (products && products.length !== 0) {
      const foundProduct = products.find(product => product._id === id)
      if (foundProduct) {
        setOldProduct(foundProduct)
        setProduct(foundProduct)
        console.log({ foundProduct })
      } else {
        console.log('Product not found, redirecting to profile')
        navigate('/profile')
      }
    }
  }, [products, id, navigate])

  const handleChangeInput = e => {
    const { name, value } = e.target
    setProduct({ ...editProduct, [name]: value, err: '', success: '' })
  }

  const changeAvatar = async e => {
    e.preventDefault()
    try {
      const file = e.target.files[0]
      if (!file)
        return setProduct({ ...editProduct, err: "No files were uploaded.", success: '' })

      if (file.size > 1024 * 1024)
        return setProduct({ ...editProduct, err: "Size too large. Max 1MB", success: '' })

      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return setProduct({ ...editProduct, err: "File format is incorrect. Use JPG/PNG", success: '' })

      const formData = new FormData()
      formData.append('file', file)

      setLoading(true)

      const res = await axios.post('/api/upload/upload_avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Added Bearer prefix
        }
      })

      setLoading(false)
      console.log("Upload Response: ", res.data)

      setAvatar(res.data.url)
      setProduct({ ...editProduct, image: res.data.url, err: '', success: 'Image uploaded successfully' })

    } catch (err) {
      console.error("Upload Error:", err)
      setProduct({
        ...editProduct,
        err: err.response?.data?.msg || "Upload failed",
        success: ''
      })
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (isEmpty(title) || isEmpty(price) || isEmpty(description) || isEmpty(location) || isEmpty(category) || isEmpty(phone))
      return setProduct({ ...editProduct, err: "Please fill in all fields", success: '' })

    if (priceValidate(price))
      return setProduct({ ...editProduct, err: "Price must be greater than or equal to 0", success: '' })

    try {
      setLoading(true)

      const updateData = {
        title: title || oldProduct.title,
        description: description || oldProduct.description,
        price: price || oldProduct.price,
        location: location || oldProduct.location, // Fixed: was using oldProduct.price
        category: category || oldProduct.category,
        phone: phone || oldProduct.phone,
        isArchived,
        image: avatar || image || oldProduct.image
      }

      console.log('Updating product with data:', updateData)

      await axios.patch(`/api/products/${id}`, updateData, { // Fixed: changed to /api/products/
        headers: { 
          Authorization: `Bearer ${token}` // Added Bearer prefix
        }
      })

      setLoading(false)
      setProduct({ ...editProduct, err: '', success: 'Product updated successfully!' })
      
      // Refresh products list
      dispatch(fetchProducts())
      
      // Navigate back to profile after a delay
      setTimeout(() => {
        navigate('/profile')
      }, 2000)

    } catch (err) {
      console.error("Update Error:", err)
      setLoading(false)
      setProduct({
        ...editProduct,
        err: err.response?.data?.msg || "Update failed",
        success: ''
      })
    }
  }

  return (
    <div className="profile_page">
      <div className="col-left">
        <div>
          {err && showErrMsg(err)}
          {success && showSuccessMsg(success)}
          {loading && <h3>Loading.....</h3>}
        </div>

        <h2>Edit Product</h2>

        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              placeholder="Title"
              id="title"
              value={title}
              name="title"
              onChange={handleChangeInput}
            />
          </div>

          <div>
            <label htmlFor="price">Price</label>
            <input
              type="number"
              placeholder="Price"
              id="price"
              value={price}
              name="price"
              onChange={handleChangeInput}
            />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea
              placeholder="Description"
              id="description"
              value={description}
              name="description"
              onChange={handleChangeInput}
              rows="5"
              style={{
                width: '100%',
                margin: '5px 0',
                padding: '5px',
                background: '#ffffff',
                border: 'none',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              placeholder="Location"
              id="location"
              value={location}
              name="location"
              onChange={handleChangeInput}
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
                width: '100%',
                height: '40px',
                margin: '5px 0',
                background: '#ffffff',
                padding: '0 5px',
                border: 'none',
                outline: 'none'
              }}
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              placeholder="Phone"
              id="phone"
              value={phone}
              name="phone"
              onChange={handleChangeInput}
            />
          </div>

          <div>
            <label htmlFor="image">Product Image</label>
            <input
              type="file"
              id="image"
              name="file"
              onChange={changeAvatar}
              accept="image/*"
              style={{
                width: '100%',
                height: '40px',
                margin: '5px 0',
                background: '#ffffff',
                padding: '5px',
                border: 'none',
                outline: 'none'
              }}
            />
            {(avatar || image) && (
              <div style={{ textAlign: 'center', margin: '10px 0' }}>
                <img 
                  src={avatar || image} 
                  alt="Product preview" 
                  style={{ 
                    width: '200px', 
                    height: '150px', 
                    objectFit: 'cover', 
                    borderRadius: '5px',
                    border: '1px solid #FFC4C4'
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="isArchived">Archive Status</label>
            <select
              id="isArchived"
              value={isArchived}
              name="isArchived"
              onChange={handleChangeInput}
              style={{
                width: '100%',
                height: '40px',
                margin: '5px 0',
                background: '#ffffff',
                padding: '0 5px',
                border: 'none',
                outline: 'none'
              }}
            >
              <option value={0}>Active</option>
              <option value={1}>Archived</option>
            </select>
          </div>

          <button 
            type="button" 
            onClick={handleUpdate} 
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProduct