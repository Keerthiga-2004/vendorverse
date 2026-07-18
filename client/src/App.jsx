import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Explore from "./pages/Explore/Explore";
import VendorDetail from "./pages/VendorDetail/VendorDetail";
import CategoriesPage from "./pages/CategoriesPage";
import Products from "./pages/Dashboard/Products";
import MyShop from "./pages/Dashboard/MyShop";
import Reviews from "./pages/Dashboard/Reviews";
import Analytics from "./pages/Dashboard/Analytics";

import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./pages/Dashboard/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/vendor/:id" element={<VendorDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/categories" element={<CategoriesPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          />
          <Route
  path="/dashboard/products"
  element={
    <ProtectedRoute>
      <Products />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard/shop"
  element={
    <ProtectedRoute>
      <MyShop />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard/reviews"
  element={
    <ProtectedRoute>
      <Reviews />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard/analytics"
  element={
    <ProtectedRoute>
      <Analytics />
    </ProtectedRoute>
  }
/>

      </Routes>
    </>
  );
}

export default App;