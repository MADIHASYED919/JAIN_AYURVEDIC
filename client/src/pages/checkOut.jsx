import { useState } from "react";

import axios from "../axiosConfig";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

import toast from "react-hot-toast";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaMoneyBillWave,
  FaCreditCard,
  FaTruck,
  FaShieldAlt,
} from "react-icons/fa";

import "./checkout.css";

const Checkout = ({
  cartItems = [],
  fetchCart
}) => {


const [loading, setLoading] =useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  // ===============================
  // GET DATA
  // ===============================

  const buyNowItem =
    location.state?.buyNowItem;

  const fromCart =
    location.state?.fromCart;

  // ===============================
  // ITEMS
  // ===============================

  const itemsToOrder = buyNowItem
    ? [buyNowItem]
    : fromCart
    ? cartItems
    : [];

  // ===============================
  // ADDRESS
  // ===============================

  const [address, setAddress] =
    useState({
      fullName: "",
      phone: "",
      doorNo: "",
      street: "",
      city: "",
      state: "",
      pincode: ""
    });



  // =========================
  // TOTAL
  // =========================

  const subtotal = itemsToOrder.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  const deliveryFee = subtotal > 500 ? 0 : 40;

  const totalAmount =
    subtotal + deliveryFee;



  // ===============================
  // PLACE ORDER
  // ===============================

  const placeOrder = async () => {

  if (loading) return;

  if (itemsToOrder.length === 0) {
    return toast.error(
      "Cart is empty ❌"
    );
  }

  try {

    setLoading(true);

    const res = await axios.post(
      "/api/orders/place",{ withCredentials: true },
      {
        address,
        items: itemsToOrder.map(item => ({
          ...item,
          image: Array.isArray(item.image)
            ? item.image[0]
            : item.image
        }))
      }
    );

    toast.success(
      "Order placed successfully 🎉"
    );

    if (fetchCart) {
      await fetchCart();
    }

    navigate("/success");

  } catch (err) {

    console.log(err);

    toast.error(
      err.response?.data?.error ||
      "Order failed"
    );

  } finally {

    setLoading(false);

  }
};
  return (
     <div className="checkout-page">
      <div className="checkout-layout">
        {/* ================= LEFT ================= */}

        <div className="checkout-left">
          {/* DELIVERY ADDRESS */}

          <div className="checkout-card">
            <h2>
              <FaMapMarkerAlt />
              Delivery Address
            </h2>

            <div className="checkout-grid">
              <input
                type="text"
                placeholder="Full Name"
                onChange={(e) =>
                  setAddress({
                    ...address,
                    fullName:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Phone Number"
                onChange={(e) =>
                  setAddress({
                    ...address,
                    phone:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Door No"
                onChange={(e) =>
                  setAddress({
                    ...address,
                    doorNo:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Street"
                onChange={(e) =>
                  setAddress({
                    ...address,
                    street:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="City"
                onChange={(e) =>
                  setAddress({
                    ...address,
                    city:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="State"
                onChange={(e) =>
                  setAddress({
                    ...address,
                    state:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Pincode"
                onChange={(e) =>
                  setAddress({
                    ...address,
                    pincode:
                      e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* PAYMENT */}

          <div className="checkout-card">
            <h2>
              <FaCreditCard />
              Payment Method
            </h2>

            <div className="payment-method active-payment">
              <FaMoneyBillWave />

              <div>
                <h4>
                  Cash on Delivery
                </h4>

                <p>
                  Pay when your order
                  arrives
                </p>
              </div>
            </div>
          </div>

          {/* DELIVERY INFO */}

          <div className="checkout-card delivery-info">
            <div>
              <FaTruck />

              <span>
                Fast Delivery
              </span>
            </div>

            <div>
              <FaShieldAlt />

              <span>
                Secure Checkout
              </span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}

        <div className="checkout-right">
          <div className="summary-card">
            <h2>Order Summary</h2>

            {/* PRODUCTS */}

            <div className="summary-products">
              {itemsToOrder.map(
                (item, index) => (
                  <div
                    className="summary-product"
                    key={index}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div className="summary-info">
                      <h4>
                        {item.name}
                      </h4>

                      <p>
                        Qty:{" "}
                        {
                          item.quantity
                        }
                      </p>
                    </div>

                    <h3>
                      ₹
                      {item.price *
                        item.quantity}
                    </h3>
                  </div>
                )
              )}
            </div>

            {/* PRICE DETAILS */}

            <div className="price-details">
              <div>
                <span>
                  Subtotal
                </span>

                <span>
                  ₹{subtotal}
                </span>
              </div>

              <div>
                <span>
                  Delivery Fee
                </span>

                <span>
                  {deliveryFee === 0
                    ? "FREE"
                    : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="total-row">
                <span>Total</span>

                <span>
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            {/* BUTTON */}

            <button
  className="place-order-btn"
  onClick={placeOrder}
  disabled={loading}
>
  {
    loading
      ? "Placing Order..."
      : "Place Order"
  }
</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;