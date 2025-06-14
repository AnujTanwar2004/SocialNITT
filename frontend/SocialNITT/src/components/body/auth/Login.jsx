import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'
import { useDispatch } from 'react-redux'
import { login } from '../../../redux/slices/authSlice'

const initialState = {
  email: '',
  password: '',
  err: '',
  success: ''
}

function Login() {
  const [user, setUser] = useState(initialState)
  const dispatch = useDispatch()
  const history = useNavigate()

  const { email, password, err, success } = user

  const handleChangeInput = e => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value, err: '', success: '' })
  }

 const handleSubmit = async e => {
  e.preventDefault()
  try {
    const res = await axios.post('http://localhost:5000/user/login', { email, password }, { withCredentials: true })

     localStorage.setItem('accessToken', res.data.access_token)
    localStorage.setItem('firstLogin', true)

    setUser({ ...user, err: '', success: res.data.msg })

    dispatch(login())
    history("/")

  } catch (err) {
    err.response.data.msg &&
      setUser({ ...user, err: err.response.data.msg, success: '' })
  }
}

  return (
    <div className="login_page">
      <h2>Login</h2>
      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email Address</label>
          <input type="text" placeholder="Enter email address" id="email"
            value={email} name="email" onChange={handleChangeInput} />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Enter password" id="password"
            value={password} name="password" onChange={handleChangeInput} />
        </div>

        <div className="row">
          <button type="submit">Login</button>
          <Link to="/forgot_password">Forgot your password?</Link>
        </div>
      </form>

      <p>New Customer? <Link to="/register">Register</Link></p>
    </div>
  )
}
 
export default Login
