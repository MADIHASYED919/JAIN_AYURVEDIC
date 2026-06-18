import { FaHeart } from "react-icons/fa";
import "./productCard.css";
import { useNavigate } from "react-router-dom";

import axios from "../axiosConfig";
import { useState,useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";

const ProductCard = ({ product, addToCart, isInCart,
 }) => {

  const navigate = useNavigate();  // ✅ create navigate
 
const {
  wishlistIds,
  toggleWishlist,
  loading
} = useWishlist();

  const liked =
    wishlistIds.includes(
      String(product._id)
    );
// ✅ check if already in wishlist
// useEffect(() => {
//   axios.get("/api/wishlist",)
//     .then(res => {
//       const exists = res.data.items.find(
//         item => item.productId === product._id
//       );
//       if (exists) setLiked(true);
//     });
// }, []);

 // ❤️ TOGGLE FUNCTION
//  const handleWishlist = async (e) => {

//   e.stopPropagation();

//   const oldLiked = liked;

//   setLiked(!liked);

//   try {

//     if (oldLiked) {

//       await axios.post(
//         "/api/wishlist/remove",
//         {
//           productId: product._id
//         }
//       );

//     } else {

//       await axios.post(
//         "/api/wishlist/add",
//         product
//       );

//     }

//   } catch (err) {

//     setLiked(oldLiked);

//     console.log(err);

//   }
// };




  return (
    <div 
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)}  // ✅ card click
    >

      
      {/* ❤️ Wishlist Icon */}
  <div
        className="wishlist-icon"
        onClick={(e) => {

  e.stopPropagation();

  const token = localStorage.getItem("token");

  // ✅ LOGIN CHECK
  if (!token) {

    toast.error("Please login first 🔐");

    navigate("/login");

    return;
  }

  toggleWishlist(product);

}}
      >


        <FaHeart className={liked ? "heart active" : "heart"} />
      </div>

   

{product.images?.[0] && (
 <img
  src={
    product.images?.[0]?.url ||
    product.image?.[0]
  }
  alt={product.name}
/>
)}




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