import { useEffect, useState } from "react";

import axios from "../axiosConfig";

import "./deliveryDashboard.css";

const DeliveryDashboard = () => {

  const [orders, setOrders] =
    useState([]);

  const [otpData, setOtpData] =
    useState({});

  // =========================
  // FETCH ORDERS
  // =========================

  const fetchOrders = async () => {

    try {

      const res = await axios.get(
        "/api/orders/admin/all",
      );

      // ONLY OUT FOR DELIVERY
      const filteredOrders =
        res.data.filter(
          order =>
            order.status ===
            "Out For Delivery"
        );

      setOrders(filteredOrders);

    } catch (err) {

      console.log(err);

    }
  };

  useEffect(() => {

    fetchOrders();

  }, []);

  // =========================
  // VERIFY OTP
  // =========================

  const verifyOTP = async (
    orderId
  ) => {

    try {

      const res = await axios.post(

        `/api/orders/verify-delivery-otp/${orderId}`,

        {
          otp: otpData[orderId]
        }

      );

      alert(res.data.message);

      // REFRESH ORDERS
      fetchOrders();

    } catch (err) {

      alert(
        err.response?.data?.error ||
        "OTP verification failed"
      );

    }

  };

  return (

    <div className="delivery-page">

      <h1>
        Delivery Dashboard
      </h1>

      {
        orders.length === 0 ? (

          <p>
            No Out For Delivery Orders
          </p>

        ) : (

          orders.map(order => (

            <div
              className="delivery-card"
              key={order._id}
            >

              <h2>
                {order.trackingId}
              </h2>

              <p>
                Customer:
                {" "}
                {
                  order.address.fullName
                }
              </p>

              <p>
                Phone:
                {" "}
                {
                  order.address.phone
                }
              </p>

              <p>
                Address:
                {" "}
                {
                  order.address.doorNo
                },
                {" "}
                {
                  order.address.street
                },
                {" "}
                {
                  order.address.city
                }
              </p>

              {/* OTP INPUT */}

              <input
                type="text"
                placeholder="Enter Customer OTP"
                value={
                  otpData[order._id] || ""
                }
                onChange={(e) =>
                  setOtpData({

                    ...otpData,

                    [order._id]:
                      e.target.value

                  })
                }
              />

              <button
                onClick={() =>
                  verifyOTP(order._id)
                }
              >
                Verify Delivery
              </button>

            </div>
          ))
        )
      }

    </div>
  );
};

export default DeliveryDashboard;