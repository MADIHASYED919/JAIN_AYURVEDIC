import './App.css'
import Navbar from './components/navbar.jsx'
import Home from './pages/home.jsx'

import { useEffect, useState } from 'react';
import axios from "./axiosConfig.js"

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ProductDetails from './pages/productDetails.jsx'
import Cart from './pages/cart.jsx';
import Login from "./pages/login";
import Register from './pages/register.jsx';
import Checkout from './pages/checkOut.jsx'
import Orders from './pages/orders.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import OrderSuccess from './pages/orderSuccess.jsx'
import Wishlist from './pages/wishlist.jsx';
import MedicineScanner from './pages/medicineScanner.jsx'
import CameraScanner from './components/CameraScanner.jsx'
import Loader from './components/Loader/Loader.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import DeliveryDashboard from './pages/DeliveryDashboard.jsx';

function App() {

  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);



//  const [loading, setLoading] = useState(true);

//   useEffect(() => {

//     setTimeout(() => {
//       setLoading(false);
//     }, 5000);

//   }, []);
const [showLoader, setShowLoader] = useState(false);

useEffect(() => {

  const alreadyVisited = sessionStorage.getItem("jain-loader");

  if (!alreadyVisited) {

    setShowLoader(true);

    sessionStorage.setItem("jain-loader", "true");

    setTimeout(() => {
      setShowLoader(false);
    }, 7000);

  }

}, []);




  // ✅ FETCH CART
  const fetchCart = async () => {
    try {

      const res = await axios.get("/api/cart",);

      const items = res.data.items || [];

      setCartItems(items);

      // ✅ FIXED
      const totalQty = items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCartCount(totalQty);

    } catch (err) {

      console.log(err);

      setCartItems([]);
      setCartCount(0);
    }
  };

  // ✅ CHECK PRODUCT IN CART
  const isInCart = (productId) => {
    return cartItems.some(
      item => String(item.productId) === String(productId)
    );
  };

  // ✅ LOAD ON START
  useEffect(() => {
    fetchCart();
  }, []);
  if (showLoader) {
  return <Loader />;
}

  return (
    
    <>
   

      <Router>
        

        <Navbar
          cartCount={cartCount}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <Routes>

          <Route
            path="/"
            element={
              <Home
                cartItems={cartItems}
                fetchCart={fetchCart}
                searchQuery={searchQuery}
              />
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProductDetails
                fetchCart={fetchCart}
                isInCart={isInCart}
              />
            }
          />

          <Route
            path="/cart"
            element={ <Cart
      cartItems={cartItems}
      fetchCart={fetchCart}
    />}
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/checkout"
            element={
              <Checkout
                cartItems={cartItems}
                fetchCart={fetchCart}
              />
            }
          />

          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/scanner" element={<MedicineScanner />} />
          <Route path="/live-scan" element={<CameraScanner />} />

<Route
  path="/admin/orders"
  element={<AdminOrders />}
/>


<Route
  path="/delivery"
  element={<DeliveryDashboard />}
/>





        </Routes>

      </Router>

     
  

  </>
    
  );
};

export default App;