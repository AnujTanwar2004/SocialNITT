import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: false
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Function to get full image URL for local storage
export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'http://localhost:5000/uploads/default-avatar.png'
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath
  
  // If it's a local path, prepend the base URL
  if (imagePath.startsWith('/uploads/')) {
    return `http://localhost:5000${imagePath}`
  }
  
  // If it's just a filename, add the uploads path
  return `http://localhost:5000/uploads/${imagePath}`
}

export default axiosClient