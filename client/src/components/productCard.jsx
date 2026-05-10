import { FaHeart } from "react-icons/fa";
import "./productCard.css";
import { useNavigate } from "react-router-dom";

import axios from "../axiosConfig";
import { useState,useEffect } from "react";


const ProductCard = ({ product, addToCart, isInCart }) => {

  const navigate = useNavigate();  // ✅ create navigate
    const [liked, setLiked] = useState(false);


// ✅ check if already in wishlist
useEffect(() => {
  axios.get("/api/wishlist", { withCredentials: true })
    .then(res => {
      const exists = res.data.items.find(
        item => item.productId === product._id
      );
      if (exists) setLiked(true);
    });
}, []);

 // ❤️ TOGGLE FUNCTION
  const handleWishlist = async (e) => {
    e.stopPropagation(); // ❌ STOP CARD CLICK

    try {
      if (liked) {
        await axios.post(
          "/api/wishlist/remove",
          { productId: product._id },
          { withCredentials: true }
        );
        setLiked(false);
      } else {
        await axios.post(
          "/api/wishlist/add",
          product,
          { withCredentials: true }
        );
        setLiked(true);
      }
    } catch (err) {
      console.log(err);
    }
  };




  return (
    <div 
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)}  // ✅ card click
    >

      
      {/* ❤️ Wishlist Icon */}
      <div className="wishlist-icon" onClick={handleWishlist}>
        <FaHeart className={liked ? "heart active" : "heart"} />
      </div>

     <img src={product.image?.[0]} alt={product.name} />

      <h4>{product.name}</h4>
      <p className="category">{product.category}</p>

      <div className="rating">⭐⭐⭐⭐☆ (4.4)</div>

      <div className="price">₹{product.price}</div>

    <button 
  onClick={(e) => {
    e.stopPropagation();
    addToCart(product);
  }}
>
  {isInCart ? "Remove" : "Add to Cart"}
</button>

    </div>
  );
};

export default ProductCard;