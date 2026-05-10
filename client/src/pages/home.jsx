import { useEffect, useState } from "react";
import ProductCard from "../components/productCard";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";



const Home = ({ cartItems, fetchCart, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const location = useLocation();

// const filters = location.state || {};


const navigate = useNavigate();
const [showNoResult, setShowNoResult] = useState(false);

  const isInCart = (productId) => {
    return cartItems.some(
      (item) => String(item.productId) === String(productId),
    );
  };
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const addToCart = async (product) => {
   
    try {
      const exists = isInCart(product._id);

      if (exists) {
        await axios.post("/api/cart/remove", {
          productId: product._id,
        });
        toast.success("Removed from cart 🛒");
      } else {
        await axios.post("/api/cart/add", {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: 1,
        });
        toast.success("Added to cart 🛒");
      }

      fetchCart();
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Please login first 🔐");
        window.location.href = "/login"; // 🔥 redirect if not logged in
      }
    }
  };

useEffect(() => {
  const params = new URLSearchParams(location.search);

  const category = params.get("category") || "";
  const maxPrice = params.get("maxPrice") || "";
  const minPrice = params.get("minPrice") || "";


  axios
    .get("http://localhost:5000/api/products", {
      params: {
        category,
        maxPrice,
        minPrice
      }
    })
    .then((res) => setProducts(res.data))
    .catch(console.log);
}, [location.search]);




useEffect(() => {
  const params = new URLSearchParams(location.search);

  const hasFilter =
    params.get("category") ||
    params.get("maxPrice") ||
    params.get("minPrice");

  if (hasFilter && products.length === 0) {
    setShowNoResult(true);

    setTimeout(() => {
      setShowNoResult(false);
      navigate("/"); // reset filters
    }, 4000);
  }

}, [products, location.search]);



  return (
    <div className="container">



{filteredProducts.length === 0 && (
  <motion.div
    style={{
      background: "#1B5E20",
      color: "white",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "15px",
      textAlign: "center",
      fontWeight: "600"
    }}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    ❌ No matching products found
  </motion.div>
)}

      <h2 className="section-title">Medicines</h2>

     <div className="product-grid">
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product) => (
      <ProductCard
        key={product._id}
        product={product}
        addToCart={addToCart}
        isInCart={isInCart(product._id)}
      />
    ))
  ) : null}
</div>
    </div>
  );
};

export default Home;
