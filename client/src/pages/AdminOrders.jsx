import { useEffect, useState } from "react";

import axios from "../axiosConfig";

import "./adminOrders.css";

const AdminOrders = () => {

  const [orders, setOrders] =
    useState([]);

  // ==========================
  // FETCH ORDERS
  // ==========================

  const fetchOrders = async () => {

    try {

      const res = await axios.get(
        "/api/orders/admin/all"
      );

      setOrders(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    fetchOrders();

  }, []);

  // ==========================
  // UPDATE STATUS
  // ==========================

  const updateStatus = async (
    orderId,
    status
  ) => {

    try {

      await axios.put(
        `/api/orders/admin/update-status/${orderId}`,
        { status }
      );

      fetchOrders();

    } catch (err) {

      console.log(err);

    }

  };

  return (
    <div className="admin-orders">

      <h2>
        Admin Orders Panel
      </h2>

      {orders.map((order) => (

        <div
          className="admin-order-card"
          key={order._id}
        >

          <div className="admin-top">

            <div>

              <h3>
                {order.address.fullName}
              </h3>

              <p>
                Tracking:
                {" "}
                {order.trackingId}
              </p>

              <p>
                Status:
                {" "}
                {order.status}
              </p>

            </div>

            <div>

              <h3>
                ₹{order.totalAmount}
              </h3>

            </div>

          </div>

          {/* STATUS DROPDOWN */}

          <select
            value={order.status}
            onChange={(e) =>
              updateStatus(
                order._id,
                e.target.value
              )
            }
          >

            <option>
              Placed
            </option>

            <option>
              Confirmed
            </option>

            <option>
              Packed
            </option>

            <option>
              Shipped
            </option>

            <option>
              Out For Delivery
            </option>

            <option>
              Delivered
            </option>

          </select>

        </div>
      ))}
    </div>
  );
};

export default AdminOrders;