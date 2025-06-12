import React from 'react';
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Login from './auth/Login'
import Register from './auth/Register'
import ActivationEmail from './auth/ActivationEmail'
import ForgotPass from './auth/ForgotPassword'
import ResetPass from './auth/ResetPassword'

import Profile from './profile/Profile'

import Home from './home/Home'
import Dashboard from './dashboard/Dashboard'
import CreateProduct from './dashboard/CreateProduct'
import ViewProduct from './dashboard/ViewProduct'
import EditProduct from './dashboard/EditProduct'

import NotFound from '../utils/NotFound/NotFound'

function Body() {
    const auth = useSelector(state => state.auth)
    const { isLogged } = auth

    return (
        <section>
            <Routes>
                <Route path="/" element={isLogged ? <Dashboard /> : <Home />} />
                <Route path="/login" element={isLogged ? <NotFound /> : <Login />} />
                <Route path="/register" element={isLogged ? <NotFound /> : <Register />} />
                <Route path="/user/activate/:activation_token" element={<ActivationEmail />} />
                <Route path="/forgot_password" element={isLogged ? <NotFound /> : <ForgotPass />} />
                <Route path="/user/reset/:token" element={isLogged ? <NotFound /> : <ResetPass />} />
                <Route path="/profile" element={isLogged ? <Profile /> : <NotFound />} />
                <Route path="/create_product" element={isLogged ? <CreateProduct /> : <NotFound />} />
                <Route path="/view_product/:id" element={isLogged ? <ViewProduct /> : <NotFound />} />
                <Route path="/edit_product/:id" element={isLogged ? <EditProduct /> : <NotFound />} />
            </Routes>
        </section>
    )
}

export default Body
