import { useEffect, useState } from "react";
import axios from "../axiosConfig";

import TrackingTimeline from "../components/TrackingTimeline";

import {
  FaBox,
  FaTruck,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaFileInvoice,
  FaTimesCircle,
} from "react-icons/fa";

import "./orders.css";

import socket from "../socket";


const Orders = () => {
  const [orders, setOrders] = useState([]);
  // const [otp, setOtp] = useState("");
  const [otpData, setOtpData] = useState({});
const [loading, setLoading] = useState(true);
  // =========================
  // FETCH ORDERS
  // =========================
useEffect(() => {

  fetchOrders();

  // ======================
  // SOCKET CONNECTION
  // ======================

  socket.on(
    "orderUpdated",
    (updatedOrder) => {

      setOrders((prevOrders) =>

        prevOrders.map((order) =>

          order._id ===
          updatedOrder._id

            ? updatedOrder

            : order
        )
      );
    }
  );

  // CLEANUP

  return () => {

    socket.off("orderUpdated");

  };

}, []);

  const fetchOrders = async () => {

  try {

    setLoading(true);

    const res = await axios.get("/api/orders/my");

    setOrders(res.data);

  } catch (err) {

    console.log(err);

  } finally {

    setLoading(false);

  }
};



const downloadInvoice = async (id) => {

  try {

    const res = await axios.get(
      `/api/orders/invoice/${id}`,
      {
        responseType: "blob",
      }
    );

    const url =
      window.URL.createObjectURL(
        new Blob([res.data])
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      `invoice-${id}.pdf`
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

  } catch (err) {

    console.log(err);

  }
};

  // =========================
  // CANCEL ORDER
  // =========================

  const cancelOrder = async (orderId) => {
    try {
      await axios.put(`/api/orders/cancel/${orderId}`,);

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

if (loading) {
  return <h2>Loading orders...</h2>;
}

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <FaBox />

          <p>No orders found</p>
        </div>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            {/* HEADER */}

            <div className="order-top">
              <div>
                <h2>Order #{order.trackingId}</h2>

                <p>
                  Status:
                  <span className="status-text">{order.status}</span>
                </p>
              </div>

              <div className="order-price">₹{order.totalAmount}</div>
            </div>

            {/* TRACKING */}

            <TrackingTimeline currentStatus={order.status} />

            {/* DETAILS GRID */}

            <div className="details-grid">
              {/* DELIVERY */}

              <div className="detail-card">
                <h3>
                  <FaTruck />
                  Delivery Details
                </h3>

                <p>Estimated Delivery:</p>

                <strong>
                  {new Date(order.estimatedDelivery).toDateString()}
                </strong>

                <div className="otp-box">
                  OTP:
                  <span>{order.deliveryOTP}</span>
                </div>
              </div>

              {/* ADDRESS */}

              <div className="detail-card">
                <h3>
                  <FaMapMarkerAlt />
                  Address
                </h3>

                <p>{order.address.fullName}</p>

                <p>{order.address.phone}</p>

                <p>
                  {order.address.doorNo}, {order.address.street}
                </p>

                <p>
                  {order.address.city}, {order.address.state}
                </p>
              </div>

              {/* PARTNER */}

              <div className="detail-card">
                <h3>
                  <FaShieldAlt />
                  Delivery Partner
                </h3>

                <p>Jain Express Logistics</p>

                <p>Fast & Secure Delivery</p>

                <p>Tracking ID:</p>

                <strong>{order.trackingId}</strong>
              </div>
            </div>

            {/* ORDER ITEMS */}

            <div className="items-section">
              {order.items.map((item) => (
                <div className="item-row" key={item.productId}>
                  <img src={item.image} alt="" />

                  <div>
                    <h4>{item.name}</h4>

                    <p>
                      Qty:
                      {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* TIMELINE */}

            <div className="timeline-box">
              <h3>Live Activity</h3>

              {order.timeline?.map((t, index) => (
                <div className="timeline-item" key={index}>
                  <div className="timeline-dot" />

                  <div>
                    <h4>{t.status}</h4>

                    <p>{t.message}</p>

                    <span>{new Date(t.time).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ACTION BUTTONS */}

            <div className="action-buttons">
              <button
                className="invoice-btn"
                onClick={() =>
                 downloadInvoice(order._id)
                }
              >
                <FaFileInvoice />
                Download Invoice
              </button>

              {order.status !== "Delivered" && order.status !== "Cancelled" && (
                <button
                  className="cancel-btn"
                  onClick={() => cancelOrder(order._id)}
                >
                  <FaTimesCircle />
                  Cancel Order
                </button>
              )}
            </div>

            
            
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
