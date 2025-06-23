import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser, setToken } from './redux/slices/authSlice'
import { fetchProducts } from './redux/slices/productSlice'
import { fetchServices } from './redux/slices/serviceSlice'
import { fetchFoods } from './redux/slices/foodSlice'
import Header from './components/header/Header'
import Body from './components/body/Body'
import axios from 'axios'
import Chatbot from './components/ai/Chatbot'
import AdminDashboard from './components/body/admin/AdminDashboard' // Import your admin dashboard

function App() {
  const dispatch = useDispatch()
  const { token, user } = useSelector((state) => state.auth)

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin')
    if (firstLogin) {
      const getToken = async () => {
        const res = await axios.post('/user/refresh_token', null)
        dispatch(setToken(res.data.access_token))
      }
      getToken()
    }
  }, [dispatch])

  useEffect(() => {
    if (token) {
      dispatch(fetchUser(token))
    }
  }, [token, dispatch])

  useEffect(() => {
    if (token && user) {
      dispatch(fetchProducts())
      dispatch(fetchServices())
      dispatch(fetchFoods())
    }
  }, [token, user, dispatch])

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/*" element={<Body />} />
          {user?.role === 1 && (
            <Route path="/admin" element={<AdminDashboard />} />
          )}
          {/* Optionally, redirect non-admins from /admin */}
          <Route
            path="/admin"
            element={
              user?.role === 1 ? <AdminDashboard /> : <Navigate to="/" />
            }
          />
        </Routes>
        <Chatbot />
      </div>
    </Router>
  ) 
}

export default App;