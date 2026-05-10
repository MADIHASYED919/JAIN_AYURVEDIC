  import { useState, useEffect } from "react";
  import axios from "../axiosConfig";
  
  import "./cart.css";
  import { useNavigate } from "react-router-dom";

 const Cart = ({ cartItems, fetchCart }) => {
    const navigate = useNavigate();

    // const [items, setItems] = useState([]);

    const [items, setItems] = useState([]);
const [savedItems, setSavedItems] = useState([]);

    const [loading, setLoading] = useState(true);

    // ================= FETCH CART =================

  useEffect(() => {

  const loadCart = async () => {

    try {

      const res = await axios.get("/api/cart",);

      setItems(res.data.items || []);
      setSavedItems(res.data.savedItems || []);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  loadCart();

}, []);

  

    // ================= TOTAL =================

    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // ================= REMOVE =================
const removeItem = async (productId) => {

  try {

    await axios.post("/api/cart/remove",{
      productId,
    });

    // LOCAL UI UPDATE
    setItems((prev) =>
      prev.filter(
        (item) => item.productId !== productId
      )
    );

    // GLOBAL NAVBAR UPDATE
    fetchCart();

  } catch (err) {

    console.log(err);

  }
};


// SAVE FOR LATER
const saveForLater = async (productId) => {

  try {

    const res = await axios.post(
      "/api/cart/save-for-later",
      {
        productId,
      }
    );

  setItems(res.data.cart.items);

setSavedItems(
  res.data.cart.savedItems
);

fetchCart();

  } catch (err) {

    console.log(err);

  }
};


// MOVE BACK TO CART
const moveToCart = async (productId) => {

  try {

    const res = await axios.post(
      "/api/cart/move-to-cart",
      {
        productId,
      }
    );

    setItems(res.data.cart.items);

    setSavedItems(
      res.data.cart.savedItems
    );

    fetchCart();

  } catch (err) {

    console.log(err);

  }
};

    // ================= QTY INCREASE =================

    const increaseQty = (productId) => {

      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
    };

    // ================= QTY DECREASE =================

    const decreaseQty = (productId) => {

      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity:
                  item.quantity > 1
                    ? item.quantity - 1
                    : 1,
              }
            : item
        )
      );
    };

    // ================= LOADING =================

    if (loading) {

      return (
        <div className="cart-page">
          <h2>Loading cart...</h2>
        </div>
      )
    }

    return (
      <div className="cart-page">

        {/* LEFT SIDE */}

        <div className="cart-left">

          <div className="cart-header">

            <h2>Shopping Cart</h2>

            <p>{items.length} Items</p>

          </div>

          {items.length === 0 ? (

            <div className="empty-cart">

              <img
                src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                alt="emptyCart-icon"
              />

              <h2>Your Cart is Empty</h2>

              <p>
                Add Ayurvedic products to continue shopping
              </p>

              <button onClick={() => navigate("/")}>
                Continue Shopping
              </button>

            </div>

          ) : (

            items.map((item, index) => (

              <div className="cart-card" key={index}>

                {/* IMAGE */}

                <div className="cart-image-section">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-image"
                    onClick={() =>
                      navigate(`/product/${item.productId}`)
                    }
                  />

                  <div className="qty-controller">

                    <button
                      onClick={() =>
                        decreaseQty(item.productId)
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        increaseQty(item.productId)
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

                {/* DETAILS */}

                <div className="cart-details">

                  <h3
                    className="cart-title"
                    onClick={() =>
                      navigate(`/product/${item.productId}`)
                    }
                  >
                    {item.name}
                  </h3>

                  <p className="cart-stock">
                    In Stock
                  </p>

                  <p className="cart-delivery">
                    FREE Delivery Tomorrow
                  </p>

                  <div className="price-row">

                    <span className="cart-price">
                      ₹{item.price}
                    </span>

                    <span className="cart-old-price">
                      ₹{item.price + 120}
                    </span>

                    <span className="cart-discount">
                      20% OFF
                    </span>

                  </div>

                  {/* ACTIONS */}

                  <div className="cart-actions">

                  <button
  onClick={() =>
    saveForLater(item.productId)
  }
>
  Save for Later
</button>
                    <button
                      onClick={() =>
                        removeItem(item.productId)
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            ))
          )}
        </div>

        {/* RIGHT SIDE */}



{/* ================= SAVED ITEMS ================= */}

{savedItems.length > 0 && (

  <div className="saved-section">

    <h2>
      Saved For Later
    </h2>

    <div className="saved-grid">

      {savedItems.map((item, index) => (

        <div
          className="saved-card"
          key={index}
        >

          <img
            src={item.image}
            alt={item.name}
            onClick={() =>
              navigate(
                `/product/${item.productId}`
              )
            }
          />

          <h3>
            {item.name}
          </h3>

          <p>
            ₹{item.price}
          </p>

          <button
            onClick={() =>
              moveToCart(
                item.productId
              )
            }
          >
            Move to Cart
          </button>

        </div>
      ))}
    </div>
  </div>
)}


        {/* ========= */}

        {items.length > 0 && (

          <div className="cart-right">

            <h2>Price Details</h2>

            <div className="summary-row">

              <span>
                Price ({items.length} items)
              </span>

              <span>₹{total}</span>

            </div>

            <div className="summary-row">

              <span>Delivery Charges</span>

              <span className="free-text">
                FREE
              </span>

            </div>

            <div className="summary-row total-row">

              <span>Total Amount</span>

              <span>₹{total}</span>

            </div>

            <button
              className="checkout-btn"
              onClick={() =>
                navigate("/checkout", {
                  state: {
                    fromCart: true,
                  },
                })
              }
            >
              Proceed to Buy
            </button>

          </div>
        )}
      </div>
    );
  };

  export default Cart;