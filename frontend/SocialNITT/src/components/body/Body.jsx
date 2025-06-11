import React from 'react';
import { Routes, Route} from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import ActivationEmail from './auth/ActivationEmail'
import NotFound from '../utils/NotFound/NotFound'

import ForgotPass from './auth/ForgotPassword'
import ResetPass from './auth/ResetPassword'

import Profile from './profile/Profile'

import Home from './home/Home'

import Dashboard from './dashboard/Dashboard'
import CreateProduct from './dashboard/CreateProduct'
import ViewProduct from './dashboard/ViewProduct'
import EditProduct from './dashboard/EditProduct'

import {useSelector} from 'react-redux'


function Body() {
    const auth = useSelector(state => state.auth)
    const { isLogged } = auth

    return (
        <section>
            <Routes>
                <Route path="/" element={isLogged ? <Dashboard/> : <Home/>} exact />
                <Route path="/login" element={isLogged ? <NotFound/> : <Login/>} exact />
                <Route path="/register" element={isLogged ? <NotFound/> : <Register/>} exact />
                <Route path="/user/activate/:activation_token" element={<ActivationEmail/>} exact />

                <Route path="/forgot_password" element={isLogged ? <NotFound/> : <ForgotPass />} exact />
                <Route path="/user/reset/:token" element={isLogged ? <NotFound/> : <ResetPass/>} exact />
            
                <Route path="/profile" element={isLogged ? <Profile/> : <NotFound/>} exact />
                <Route path="/create_product" element={isLogged ? <CreateProduct/> : <NotFound/>} exact />
                <Route path="/view_product/:id" element={isLogged ? <ViewProduct/> : <NotFound/>} exact />
                <Route path="/edit_product/:id" element={isLogged ? <EditProduct/> : <NotFound/>} exact />                
            </Routes>
        </section>
    )
}

export default Body