import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import axiosClient from '../../utils/axiosClient'   
import { isEmpty, priceValidate, validatePhone } from '../../utils/validation/Validation'
import { showSuccessMsg, showErrMsg } from '../../utils/notification/Notification'
import { useNavigate } from 'react-router-dom'

const initialState = {
  title: '',
  price: 0,
  description: '',
  location: '',
  category: '',
  phone: '',
  image: '',
  err: '',
  success: ''
}
// create the product 
function CreateProduct() {
  const [product, setProduct] = useState(initialState)
  const { title, price, description, location, category, phone, image, err, success } = product

  const { user } = useSelector(state => state.auth)
  const userId = user._id

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChangeInput = e => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: value, err: '', success: '' })
  }
const changeAvatar = async e => {
  e.preventDefault()
  try {
    const file = e.target.files[0]
    if (!file)
      return setProduct({ ...product, err: "No files were uploaded.", success: '' })

    if (file.size > 1024 * 1024)
      return setProduct({ ...product, err: "Size too large. Max 1MB", success: '' })

    if (file.type !== 'image/jpeg' && file.type !== 'image/png')
      return setProduct({ ...product, err: "File format is incorrect. Use JPG/PNG", success: '' })

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)

    const token = localStorage.getItem('token')

    const res = await axiosClient.post('/api/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    })

    setLoading(false)
    console.log("Upload Response: ", res.data)

    setProduct({ ...product, image: res.data.url, err: '', success: 'Image uploaded successfully' })

  } catch (err) {
    console.error("Upload Error:", err)
    setProduct({
      ...product,
      err: err.response?.data?.msg || "Upload failed",
      success: ''
    })
    setLoading(false)
  }
}



  const handleSubmit = async e => {
  e.preventDefault()

  if (isEmpty(title) || isEmpty(price) || isEmpty(description) || isEmpty(location) || isEmpty(category) || isEmpty(phone))
    return setProduct({ ...product, err: "Please fill in all fields", success: '' })

  if (priceValidate(price))
    return setProduct({ ...product, err: "Price must be greater than or equal to 0", success: '' })

  if (!validatePhone(phone))
    return setProduct({ ...product, err: "Enter a valid phone number", success: '' })

  if (!image)
    return setProduct({ ...product, err: "Please upload an image", success: '' })

  try {
    console.log({ title, description, price, location, category, phone, image, userId })

    const token = localStorage.getItem('token')

    const res = await axiosClient.post('/api/products', {
  title,
  description,
  price: Number(price),
  location,
  category,
  phone: Number(phone),
  image
}, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})


    setProduct({ ...initialState, success: res.data.msg })

  } catch (err) {
    console.error("Create Product Error:", err)
    setProduct({ ...product, err: err.response?.data?.msg || "Submit failed", success: '' })
  }
}


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
          <div><label htmlFor="title">Title</label>
            <input type="text" name="title" value={title} onChange={handleChangeInput} required />
          </div>
          <div><label htmlFor="price">Price</label>
            <input type="number" name="price" value={price} onChange={handleChangeInput} required />
          </div>
          <div><label htmlFor="description">Description</label>
            <textarea name="description" value={description} onChange={handleChangeInput} required />
          </div>
          <div><label htmlFor="location">Location</label>
            <input type="text" name="location" value={location} onChange={handleChangeInput} required />
          </div>
          <div><label htmlFor="category">Category</label>
            <input type="text" name="category" value={category} onChange={handleChangeInput} required />
          </div>
          <div><label htmlFor="phone">Phone no.</label>
            <input type="text" name="phone" value={phone} onChange={handleChangeInput} required />
          </div>

          <div className="row file">
            <input type="file" name="file" onChange={changeAvatar} />
          </div>

          <div className="row">
            <button type="submit" disabled={loading || !image}>Create</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default CreateProduct
