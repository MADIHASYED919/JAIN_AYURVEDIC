import { useEffect, useState } from "react";

import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";

import "./wishlist.css";

const Wishlist = ({
  cartItems,
  fetchCart,
}) => {

  const [wishlist, setWishlist] = useState({
    items: [],
  });

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();

  // =========================
  // FETCH WISHLIST
  // =========================

  const fetchWishlist = async () => {

    try {

      setLoading(true);

      const res =
        await axios.get(
          "/api/wishlist"
        );

      setWishlist(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchWishlist();

  }, []);

  // =========================
  // CHECK CART
  // =========================

  const isInCart = (productId) => {

    return cartItems.some(
      (item) =>
        String(item.productId) ===
        String(productId)
    );
  };

  // =========================
  // ADD / REMOVE CART
  // =========================

  const handleCart = async (item) => {

    try {

      if (isInCart(item.productId)) {

        await axios.post(
          "/api/cart/remove",
          {
            productId:
              item.productId,
          }
        );

      } else {

        await axios.post(
          "/api/cart/add",
          {
            productId:
              item.productId,

            name: item.name,

            price: item.price,

            image: item.image,

            qty: 1,
          }
        );
      }

      fetchCart();

    } catch (err) {

      console.log(err);

    }
  };

  // =========================
  // REMOVE WISHLIST
  // =========================

  const removeWishlist = async (
    productId
  ) => {

    try {

      await axios.post(
        "/api/wishlist/remove",
        {
          productId,
        }
      );

      // LOCAL UI UPDATE

      setWishlist((prev) => ({
        ...prev,

        items: prev.items.filter(
          (item) =>
            item.productId !==
            productId
        ),
      }));

    } catch (err) {

      console.log(err);

    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="wishlist-container">
        <h2>
          Loading wishlist...
        </h2>
      </div>
    );
  }

  return (
    <div className="wishlist-container">

      <h2>
        ❤️ My Wishlist
      </h2>

      {wishlist.items.length === 0 ? (

        <p>
          No items in wishlist
        </p>

      ) : (

        <div className="wishlist-grid">

          {wishlist.items.map(
            (item) => (

              <div
                className="wishlist-card"
                key={item.productId}
              >

                {/* IMAGE */}

                <img
                  src={item.image[0]}
                  alt={item.name}
                  onClick={() =>
                    navigate(
                      `/product/${item.productId}`
                    )
                  }
                />

                {/* DETAILS */}

                <h3>{item.name}</h3>

                <p>
                  ₹{item.price}
                </p>

                {/* ACTIONS */}

                <div className="wishlist-actions">

                  <button
                    className="wishlist-cart-btn"
                    onClick={() =>
                      handleCart(item)
                    }
                  >
                    {isInCart(
                      item.productId
                    )
                      ? "Remove Cart"
                      : "Add to Cart"}
                  </button>

                  <button
                    className="wishlist-remove-btn"
                    onClick={() =>
                      removeWishlist(
                        item.productId
                      )
                    }
                  >
                    Remove
                  </button>

                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Wishlist;