import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { showSuccessMsg, showErrMsg } from '../../utils/notification/Notification'
import { isEmpty, priceValidate, validatePhone } from '../../utils/validation/Validation'
import { fetchServices } from '../../../redux/slices/serviceSlice'

const initialState = {
  title: '',
  description: '',
  budget: 0,
  location: '',
  category: '',
  serviceType: '',
  urgency: 'Medium',
  phone: '',
  status: 'Active',
  isArchived: 0,
  err: '',
  success: ''
}

function EditService() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const services = useSelector(state => state.services.items)
  const auth = useSelector(state => state.auth)
  const { token } = auth

  const [editService, setService] = useState(initialState)
  const { title, description, budget, location, category, serviceType, urgency, phone, status, isArchived, err, success } = editService

  const [oldService, setOldService] = useState(initialState)
  const [loading, setLoading] = useState(false)

  const categories = [
    'Construction & Renovation',
    'Plumbing & Water',
    'Electrical',
    'Cleaning & Maintenance',
    'Transportation & Logistics',
    'IT & Technical',
    'Professional Services',
    'Others'
  ]

  const serviceTypes = ['One-time', 'Recurring', 'Project-based']
  const urgencyLevels = ['Low', 'Medium', 'High', 'Urgent']
  const statusOptions = ['Active', 'In Progress', 'Completed', 'Cancelled']

  // Fetch services if not already loaded
  useEffect(() => {
    if (!services || services.length === 0) {
      dispatch(fetchServices())
    }
  }, [dispatch, services])

  useEffect(() => {
    if (services && services.length !== 0) {
      const foundService = services.find(service => service._id === id)
      if (foundService) {
        setOldService(foundService)
        setService(foundService)
      } else {
        console.log('Service not found, redirecting to services')
        navigate('/services')
      }
    }
  }, [services, id, navigate])

  const handleChangeInput = e => {
    const { name, value } = e.target
    setService({ ...editService, [name]: value, err: '', success: '' })
  }

  const handleUpdate = async () => {
    if (isEmpty(title) || isEmpty(description) || isEmpty(location) || isEmpty(category) || isEmpty(serviceType) || isEmpty(phone))
      return setService({ ...editService, err: "Please fill in all fields", success: '' })

    if (priceValidate(budget))
      return setService({ ...editService, err: "Budget must be greater than or equal to 0", success: '' })

    if (!validatePhone(phone))
      return setService({ ...editService, err: "Enter a valid phone number", success: '' })

    try {
      setLoading(true)

      const updateData = {
        title: title || oldService.title,
        description: description || oldService.description,
        budget: budget || oldService.budget,
        location: location || oldService.location,
        category: category || oldService.category,
        serviceType: serviceType || oldService.serviceType,
        urgency: urgency || oldService.urgency,
        phone: phone || oldService.phone,
        status,
        isArchived
      }

      await axios.patch(`/api/services/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setLoading(false)
      setService({ ...editService, err: '', success: 'Service updated successfully!' })
      
      // Refresh services list
      dispatch(fetchServices())
      
      // Navigate back to services after a delay
      setTimeout(() => {
        navigate('/services')
      }, 2000)

    } catch (err) {
      setLoading(false)
      setService({
        ...editService,
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

        <h2>Edit Service Request</h2>

        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="title">Service Title</label>
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
                width: '100%',
                margin: '5px 0',
                padding: '5px',
                background: '#ffffff',
                border: '2px solid #777',
                outline: 'none',
                resize: 'vertical'
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
                width: '100%',
                height: '40px',
                maArgin: '5px 0',
                background: '#ffffff',
                padding: '0 5px',
                border: '2px solid #777',
                outline: 'none'
              }}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="serviceType">Service Type</label>
            <select
              id="serviceType"
              value={serviceType}
              name="serviceType"
              onChange={handleChangeInput}
              style={{
                width: '100%',
                height: '40px',
                margin: '5px 0',
                background: '#ffffff',
                padding: '0 5px',
                border: '2px solid #777',
                outline: 'none'
              }}
            >
              <option value="">Select Type</option>
              {serviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
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
                width: '100%',
                height: '40px',
                margin: '5px 0',
                background: '#ffffff',
                padding: '0 5px',
                border: '2px solid #777',
                outline: 'none'
              }}
            >
              {urgencyLevels.map(level => (
                <option key={level} value={level}>{level}</option>
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
                width: '100%',
                height: '40px',
                margin: '5px 0',
                background: '#ffffff',
                padding: '0 5px',
                border: '2px solid #777',
                outline: 'none'
              }}
            >
              {statusOptions.map(stat => (
                <option key={stat} value={stat}>{stat}</option>
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
                width: '100%',
                height: '40px',
                margin: '5px 0',
                background: '#ffffff',
                padding: '0 5px',
                border: '2px solid #777',
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
            {loading ? 'Updating...' : 'Update Service'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditService
