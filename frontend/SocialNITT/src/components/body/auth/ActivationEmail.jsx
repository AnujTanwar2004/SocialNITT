import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'

function ActivationEmail() {
    const { activation_token } = useParams()
    const [err, setErr] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (activation_token) {
            const activationEmail = async () => {
                try {
                    console.log("Starting activation process...")
                    setLoading(true)
                    
                    const res = await axios.post('/user/activation', { activation_token })
                    
                    setSuccess(res.data.msg)
                    setLoading(false)
                    
                    // Navigate to login after 3 seconds on success
                    setTimeout(() => {
                        navigate("/login")
                    }, 3000)
                    
                } catch (err) {
                    console.error("Activation error:", err)
                    setLoading(false)
                    
                    if (err.response && err.response.data && err.response.data.msg) {
                        setErr(err.response.data.msg)
                    } else {
                        setErr("Activation failed. Please try again.")
                    }
                    
                    // Navigate to register page after 5 seconds on error
                    setTimeout(() => {
                        navigate("/register")
                    }, 5000)
                }
            }
            activationEmail()
        } else {
            setErr("Invalid activation link.")
            setLoading(false)
        }
    }, [activation_token, navigate])

    return (
        <div className="login_page" style={{ textAlign: 'center', padding: '50px 20px' }}>
            <h2>Account Activation</h2>
            
            {loading && (
                <div>
                    <h3>Activating your account...</h3>
                    <p>Please wait while we verify your email address.</p>
                </div>
            )}
            
            {err && (
                <div>
                    {showErrMsg(err)}
                    <p style={{ marginTop: '20px' }}>
                        You will be redirected to the registration page in a few seconds.
                    </p>
                </div>
            )}
            
            {success && (
                <div>
                    {showSuccessMsg(success)}
                    <p style={{ marginTop: '20px', color: 'green' }}>
                        Account activated successfully! You will be redirected to the login page in 3 seconds.
                    </p>
                </div>
            )}
            
            {!loading && !err && !success && (
                <div>
                    <p>Invalid or missing activation token.</p>
                    <button onClick={() => navigate("/register")}>
                        Go to Registration
                    </button>
                </div>
            )}
        </div>
    )
}

export default ActivationEmail