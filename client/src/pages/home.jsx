import { useEffect, useState } from "react";
import ProductCard from "../components/productCard";
import axios from "../axiosConfig";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = ({ cartItems, fetchCart, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
const [cartLoadingId, setCartLoadingId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // ================= CART CHECK =================
  const isInCart = (productId) =>
    cartItems.some(
      (item) => String(item.productId) === String(productId)
    );

  // ================= FILTER + SEARCH =================
  const filteredProducts =
    searchQuery.trim()
      ? products.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : products;

  // ================= ADD / REMOVE CART =================
const addToCart = async (product) => {

  if (cartLoadingId === product._id) return;

  try {

    setCartLoadingId(product._id);

    const exists = isInCart(product._id);

    if (exists) {

      await axios.post("/api/cart/remove", {
        productId: product._id
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

      navigate("/login");

    }

  } finally {

    setCartLoadingId(null);

  }
};
  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const category = params.get("category") || "";
    const maxPrice = params.get("maxPrice") || "";
    const minPrice = params.get("minPrice") || "";

    setLoading(true);

    axios
      .get("/api/products", {
        params: {
          category,
          maxPrice,
          minPrice,
        },
      })
      .then((res) => setProducts(res.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [location.search]);
  // ================= FETCH WISHLIST IDS =================



  // ================= UI STATES =================
  const showNoResult =
    !loading && filteredProducts.length === 0;

  return (
    <div className="container">

      {/* LOADING STATE */}
      {loading && (
        <p style={{ textAlign: "center", margin: "20px" }}>
          Loading products...
        </p>
      )}

      {/* NO RESULT STATE */}
      {showNoResult && (
        <motion.div
          style={{
            background: "#1B5E20",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "15px",
            textAlign: "center",
            fontWeight: "600",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ❌ No matching products found
        </motion.div>
      )}

      <h2 className="section-title">Medicines</h2>

      {/* PRODUCT GRID */}
      <div className="product-grid">
        {!loading &&
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
              isInCart={isInCart(product._id)}
               
            />
          ))}
      </div>
    </div>
  );
};

export default Home;