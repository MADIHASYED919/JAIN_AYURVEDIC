import { useEffect, useState } from "react";

import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import "./wishlist.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState({ items: [] });

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("/api/wishlist", {
        withCredentials: true
      });
      setWishlist(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="wishlist-container">
      <h2>❤️ My Wishlist</h2>

      {wishlist.items.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.items.map((item) => (
            <div
              className="wishlist-card"
              key={item.productId}
              onClick={() => navigate(`/product/${item.productId}`)}
            >
              <img src={item.image[0]} alt={item.name} />

              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;