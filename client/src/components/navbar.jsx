import React from "react";
import {
  FaSearch,
  FaMicrophone,
  FaCamera,
  FaHome,
  FaTh,
  FaBox,
  FaHeart,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";
import {
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineBars3
} from "react-icons/hi2";
import { FaBagShopping } from "react-icons/fa6";
import { MdOutlineSearch } from "react-icons/md";

import { FaFilter, FaRupeeSign, FaTags } from "react-icons/fa";
import { motion } from "framer-motion";

import { useState, useEffect, useRef } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";


import "./navbar.css";

const Navbar = ({ cartCount, searchQuery, setSearchQuery }) => {
  const [listening, setListening] = useState(false);
  const [user, setUser] = useState(null);

  // const [open, setOpen] = useState(false);
  // const [showFilter, setShowFilter] = useState(false);

  const [desktopProfile, setDesktopProfile] = useState(false);
  const [mobileProfile, setMobileProfile] = useState(false);

  const [desktopFilter, setDesktopFilter] = useState(false);
  const [mobileFilter, setMobileFilter] = useState(false);

  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");

  const [showScanner, setShowScanner] = useState(false);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  const desktopFilterRef = useRef();
  const mobileFilterRef = useRef();

  const desktopUserRef = useRef();
  const mobileUserRef = useRef();
  const categories = [
    "Juice",
    "Tablet",
    "Herbal",
    "Food",
    "Ointment",
    "Powder",
    "Tonic",
  ];

  useEffect(() => {
    axios.get("/api/auth/me").then((res) => setUser(res.data.user));
  }, []);

  // ✅ close dropdown when clicking outside
  useEffect(() => {
    const closeMenus = (e) => {
      // DESKTOP PROFILE
      if (
        desktopUserRef.current &&
        !desktopUserRef.current.contains(e.target)
      ) {
        setDesktopProfile(false);
      }

      // MOBILE PROFILE
      if (mobileUserRef.current && !mobileUserRef.current.contains(e.target)) {
        setMobileProfile(false);
      }

      // DESKTOP FILTER
      if (
        desktopFilterRef.current &&
        !desktopFilterRef.current.contains(e.target)
      ) {
        setDesktopFilter(false);
      }

      // MOBILE FILTER
      if (
        mobileFilterRef.current &&
        !mobileFilterRef.current.contains(e.target)
      ) {
        setMobileFilter(false);
      }
    };

    document.addEventListener("mousedown", closeMenus);

    return () => {
      document.removeEventListener("mousedown", closeMenus);
    };
  }, []);

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript); // 🔥 auto search
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };
  };

  // ✅ APPLY FILTERS
  const applyFilters = () => {
  const params = new URLSearchParams();

  // CATEGORY
  if (category && category !== "All") {
    params.append("category", category);
  }

  // MIN PRICE
  if (minPrice) {
    params.append("minPrice", minPrice);
  }

  // MAX PRICE
  if (maxPrice) {
    params.append("maxPrice", maxPrice);
  }

  // ✅ NAVIGATE WITH QUERY PARAMS
  navigate(`/?${params.toString()}`);

  // CLOSE MENUS
  setDesktopFilter(false);
  setMobileFilter(false);
};

  const handleScan = async () => {
    if (!image) return alert("Upload image first");

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post("/api/scan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("SCAN RESPONSE:", res.data);
      setResult(res.data);
    } catch (err) {
      console.log(err);
      alert("Scan failed");
    }
  };

  return (
    <>
      <div className="navbar">
        <div className="logo">
          <img src={logo} alt="logo" className="logo" />
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search Ayurvedic products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MdOutlineSearch className="search-icon" />
        </div>

        <div className="nav-right">
          {/* MOBILE TOP ICONS */}
          <div className="mobile-top-icons">
           <div className="nav-icon">

             <FaMicrophone
              onClick={startVoiceSearch}
              style={{
                color: listening ? "red" : "white",
                cursor: "pointer",
              }}
            />
           </div>
          <div className="nav-icon">
              <FaCamera onClick={() => navigate("/live-scan")} />
          </div>
          </div>

          <div className="desktop-icons">
           <div className="nav-icon">
             <FaMicrophone
              onClick={startVoiceSearch}
              style={{
                color: listening ? "red" : "white",
                cursor: "pointer",
              }}
            />
           </div>

           <div className="nav-icon">
             <FaCamera onClick={() => navigate("/live-scan")} />
           </div>

      <div className="nav-icon">
              <FaHome onClick={() => navigate("/")} />

      </div>
            <div className="filter-wrapper" ref={desktopFilterRef}>
           <div className="nav-icon">
               <FaTh onClick={() => setDesktopFilter(!desktopFilter)} />
           </div>

              {desktopFilter && (
                <motion.div
                  className="filter-dropdown"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {/* CATEGORY */}
                  <h4>
                    <FaTags /> Categories
                  </h4>

                  {categories.map((cat) => (
                    <label key={cat} className="category-item">
                      <input
                        type="radio"
                        name="category"
                        onChange={() => setCategory(cat)}
                      />
                      {cat}
                    </label>
                  ))}

                  {/* PRICE RANGE */}
                  <h4>
                    <FaRupeeSign /> Price
                  </h4>

                  <label>
                    <input
                      type="radio"
                      name="price"
                      onChange={() => setMaxPrice(200)}
                    />
                    Under ₹200
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="price"
                      onChange={() => setMaxPrice(500)}
                    />
                    Under ₹500
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="price"
                      onChange={() => setMaxPrice(1000)}
                    />
                    Under ₹1000
                  </label>

                  {/* CUSTOM INPUT */}
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />

                  {/* APPLY */}
                  <button onClick={applyFilters}>Apply Filters</button>
                </motion.div>
              )}
            </div>

            {/* <FaBox /> */}
         <div className="nav-icon">
             <FaHeart onClick={() => navigate("/wishlist")} />
         </div>

<div className="nav-icon" onClick={() => navigate("/orders")}>
  <FaBagShopping />
</div>



            <div className="cart-wrapper" onClick={() => navigate("/cart")}>
              <div className="nav-icon">
                <FaShoppingCart />
              </div>
              <span className="cart-badge">{cartCount}</span>
            </div>

            {/* for user */}
            <div className="user-menu" ref={desktopUserRef}>
            <div className="nav-icon">
                <FaUser onClick={() => setDesktopProfile(!desktopProfile)} />
            </div>

              {desktopProfile && (
                <div className="menu-panel">
                  {!user ? (
                    <>
                      <button onClick={() => navigate("/login")}>
                        🔐 Login
                      </button>

                      <button onClick={() => navigate("/register")}>
                        ✨ Signup
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="user-info">👤 Welcome {user.name}</p>

                      <button onClick={() => navigate("/orders")}>
                        📦 Orders
                      </button>

                      <button onClick={logout}>🚪 Logout</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}

    <div className="mobile-bottom-nav">



  <div className="mobile-nav-item" onClick={() => navigate("/")}>
       <div className="nav-icon">
         < HiOutlineHome />
       </div>
        <span>Home</span>
      </div>

      <div className="mobile-filter-menu" ref={mobileFilterRef}>
        <div
          className="mobile-nav-item"
          onClick={() => setMobileFilter(!mobileFilter)}
        >
       <div className="nav-icon">
           <  HiOutlineSquares2X2 />
       </div>
          <span>Categories</span>
        </div>

        {mobileFilter && (
          <div className="mobile-filter-dropdown">
            <h4>
              <FaTags /> Categories
            </h4>

            {categories.map((cat) => (
              <label key={cat}>
                <input
                  type="radio"
                  name="mobile-category"
                  onChange={() => setCategory(cat)}
                />
                {cat}
              </label>
            ))}

            <h4>
              <FaRupeeSign /> Price
            </h4>

            <label>
              <input
                type="radio"
                name="mobile-price"
                onChange={() => setMaxPrice(200)}
              />
              Under ₹200
            </label>

            <label>
              <input
                type="radio"
                name="mobile-price"
                onChange={() => setMaxPrice(500)}
              />
              Under ₹500
            </label>

            <label>
              <input
                type="radio"
                name="mobile-price"
                onChange={() => setMaxPrice(1000)}
              />
              Under ₹1000
            </label>

            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />

            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />

            <button onClick={applyFilters}>Apply Filters</button>
          </div>
        )}
      </div>

      <div className="mobile-nav-item" onClick={() => navigate("/wishlist")}>
   <div className="nav-icon">
         <HiOutlineHeart />
   </div>
        <span>Wishlist</span>
      </div>


<div className="mobile-nav-item" onClick={() => navigate("/orders")}>
  <div className="nav-icon">
     <HiOutlineShoppingBag />
  </div>
   <span>Orders</span>

</div>


      <div
        className="mobile-nav-item mobile-cart"
        onClick={() => navigate("/cart")}
      >
        <div className="mobile-cart-wrapper">
        <div className="nav-icon">
            <HiOutlineShoppingCart />
        </div>

          {cartCount > 0 && (
            <span className="mobile-cart-badge">{cartCount}</span>
          )}
        </div>
        <span>Cart</span>
      </div>

      <div className="mobile-profile-menu" ref={mobileUserRef}>
        <div
          className="mobile-nav-item"
          onClick={() => setMobileProfile(!mobileProfile)}
        >
        <div className="nav-icon">
            < HiOutlineUser/>
        </div>
          <span>Profile</span>
        </div>

        {mobileProfile && (
          <div className="mobile-profile-dropdown">
            {!user ? (
              <>
                <button onClick={() => navigate("/login")}>🔐 Login</button>

                <button onClick={() => navigate("/register")}>✨ Signup</button>
              </>
            ) : (
              <>
                <p className="user-info">👤 Welcome {user.name}</p>

                <button onClick={() => navigate("/orders")}>📦 Orders</button>

                <button onClick={logout}>🚪 Logout</button>
              </>
            )}
          </div>
        )}
      </div>

    </div>
    </>
  );
};

export default Navbar;
