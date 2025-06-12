import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: false
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')  // <-- fix here
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)


export default axiosClient
