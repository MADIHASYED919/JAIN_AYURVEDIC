import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import axios from "../axiosConfig";
import "./productDetails.css";
import ImageZoom from "../components/imageZoom";
import toast from "react-hot-toast";
import ProductCard from "../components/productCard";

const ProductDetails = ({
  setCartCount,
  fetchCartCount,
  isInCart,
  fetchCart,
}) => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ FIX

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [qty, setQty] = useState(1);

  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/products/${id}`,)
      .then((res) => {
        const data = res.data;

        // ✅ normalize images
        const imagesArray =
          data.images && data.images.length > 0 ? data.images : [data.image];

        setProduct({ ...data, images: imagesArray });
        setSelectedImage(imagesArray[0]);
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/api/products/related/${id}`,)
      .then((res) => setRelatedProducts(res.data))
      .catch(console.log);
  }, [id]);

  if (!product || !product._id) return <h2>Loading...</h2>;

  const toggleCart = async () => {
    try {
      if (isInCart(product._id)) {
        await axios.post("/api/cart/remove", {
          productId: product._id,
        });

        toast.success("Removed from cart ❌");
      } else {
        await axios.post("/api/cart/add",{
          productId: product._id,
          name: product.name,
          price: product.price,
          image: selectedImage,
          qty: qty,
        });

        toast.success("Added to cart 🛒");
      }

      fetchCart();
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Login required 🔐");

        navigate("/login", {
          state: { from: `/product/${product._id}` },
        });
      } else {
        toast.error("Something went wrong ❌");
      }
    }
  };

  return (
    <>
    <div className="details-container">
      {/* LEFT SIDE */}
      <div className="details-left">
        {/* THUMBNAILS COLUMN */}
        <div className="thumb-column">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              className={selectedImage === img ? "active-thumb" : ""}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>

        {/* MAIN IMAGE + ZOOM */}
        <div className="main-image-area">
          <ImageZoom src={selectedImage} />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="details-right">
        <h2>{product.name}</h2>

        <div className="rating">⭐⭐⭐⭐☆ (4.4)</div>
        <p className="product-description">
  Premium Ayurvedic product made with natural herbal ingredients.
  Helps improve immunity, digestion, and overall wellness.
  Safe for daily use and recommended by Ayurvedic experts.
</p>
        <div className="price-box">
          <p className="mrp">
            M.R.P: <span>₹{product.price + 100}</span>
          </p>
          <p className="deal-price">Deal Price: ₹{product.price}</p>
          <p className="tax">Inclusive of all taxes</p>
        </div>

        {/* DELIVERY */}
        <p className="delivery">
          🚚 FREE Delivery by <b>Tomorrow</b>
        </p>

        {/* STOCK */}
        <p className={`stock ${product.stock < 5 ? "low" : ""}`}>
          {product.stock > 0
            ? `Only ${product.stock} left in stock`
            : "Out of stock"}
        </p>

        {/* QUANTITY */}

        <div className="qty-box">
          <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
          <span>{qty}</span>
          <button onClick={() => setQty(qty + 1)}>+</button>
        </div>
        {/* BUTTONS */}
        <div className="btn-group">
          <button className="btn-primary" onClick={toggleCart}>
            {isInCart(product._id) ? "Remove from Cart" : "Add to Cart"}
          </button>

<button
  className="btn-secondary"
  onClick={() => {

    const token = localStorage.getItem("token");

    // ✅ LOGIN CHECK
    if (!token) {

      toast.error("Please login first 🔐");

      navigate("/login");

      return;
    }

    navigate("/checkout", {
      state: {
        buyNowItem: {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: Array.isArray(selectedImage)
            ? selectedImage[0]
            : selectedImage,
          quantity: qty
        }
      }
    });

  }}
>
  Buy Now ⚡
</button>


        </div>
      </div>
    </div>


          {/* 🔥 RELATED PRODUCTS */}
<div className="related-section">
  <h3>🛍️ Related Products</h3>

  <div className="related-grid">
    {relatedProducts.length === 0 ? (
      <p>No similar products found</p>
    ) : (
      relatedProducts.map(item => (
        <ProductCard
          key={item._id}
          product={item}
          addToCart={toggleCart} // reuse logic
          isInCart={isInCart(item._id)}
        />
      ))
    )}
  </div>
</div>
    </>
    
  );
};

export default ProductDetails;
