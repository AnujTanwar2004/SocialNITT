import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser, setToken } from './redux/slices/authSlice'
import { fetchProducts } from './redux/slices/productSlice'

import Header from './components/header/Header'
import Body from './components/body/Body'
import axios from 'axios'

function App() {
  const dispatch = useDispatch()

  const { token, user } = useSelector((state) => state.auth)

  // Refresh Token on App Load
  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin')
    if (firstLogin) {
      const getToken = async () => {
        const res = await axios.post('/user/refresh_token', null)
         console.log("✅ Got token:", res.data.access_token)

        dispatch(setToken(res.data.access_token))
      }
      getToken()
    }
  }, [dispatch])
 
  // Fetch User Info when token available
  useEffect(() => {
    if (token) {
      dispatch(fetchUser(token))
    }
  }, [token, dispatch])

  // Fetch Products when logged in
  useEffect(() => {
    if (token && user) {
      dispatch(fetchProducts())   // ✅ no token needed here
    }
  }, [token, user, dispatch])

  return (
    <Router>
      <div className="App">
        <Header />
        <Body />
      </div>
    </Router>
  )
}

export default App
