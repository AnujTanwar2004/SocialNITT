import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./auth/Login";
 

import Profile from "./profile/Profile";

import Home from "./home/Home";
import Dashboard from "./dashboard/Dashboard";
import CreateProduct from "./dashboard/CreateProduct";
import ViewProduct from "./dashboard/ViewProduct";
import EditProduct from "./dashboard/EditProduct";

// New Services Components
import ServicesDashboard from "./services/ServicesDashboard";
import CreateService from "./services/CreateService";
import ViewService from "./services/ViewService";
import EditService from "./services/EditService";

import FoodDashboard from "./foods/FoodDashboard";
import CreateFood from "./foods/CreateFood";
import ViewFood from "./foods/ViewFood";
import EditFood from "./foods/EditFood";

import NotFound from "../utils/NotFound/NotFound";
import Hero from "./hero/Hero";

function Body() {
  const auth = useSelector((state) => state.auth);
  const { isLogged } = auth;
 

  return (
    <section>
      <Routes>
        {/* Home Route - Products by default */}
        <Route path="/" element={isLogged ? <Hero /> : <Home />} />

        {/* Authentication Routes - FIXED: Allow access to login page */}
        <Route path="/login" element={<Login />} />
         
 
        {/* Profile Route */}
        <Route
          path="/profile"
          element={isLogged ? <Profile /> : <NotFound />}
        />

        {/* Product Routes */}
        <Route
          path="/products"
          element={isLogged ? <Dashboard /> : <NotFound />}
        />
        <Route
          path="/create_product"
          element={isLogged ? <CreateProduct /> : <NotFound />}
        />
        <Route
          path="/view_product/:id"
          element={isLogged ? <ViewProduct /> : <NotFound />}
        />
        <Route
          path="/edit_product/:id"
          element={isLogged ? <EditProduct /> : <NotFound />}
        />

        {/* Services Routes */}
        <Route
          path="/services"
          element={isLogged ? <ServicesDashboard /> : <NotFound />}
        />
        <Route
          path="/create_service"
          element={isLogged ? <CreateService /> : <NotFound />}
        />
        <Route
          path="/view_service/:id"
          element={isLogged ? <ViewService /> : <NotFound />}
        />
        <Route
          path="/edit_service/:id"
          element={isLogged ? <EditService /> : <NotFound />}
        />

        {/* Food Routes */}
        <Route
          path="/foods"
          element={isLogged ? <FoodDashboard /> : <NotFound />}
        />
        <Route
          path="/create_food"
          element={isLogged ? <CreateFood /> : <NotFound />}
        />
        <Route
          path="/view_food/:id"
          element={isLogged ? <ViewFood /> : <NotFound />}
        />
        <Route
          path="/edit_food/:id"
          element={isLogged ? <EditFood /> : <NotFound />}
        />
      </Routes>
    </section>
  );
}

export default Body;