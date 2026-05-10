const orderPlacedTemplate = (order) => {

  return `

  <div style="
    font-family: Arial;
    max-width: 700px;
    margin: auto;
    background: #f8f8f8;
    padding: 30px;
  ">

    <div style="
      background: #16a34a;
      color: white;
      padding: 20px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    ">
      <h1>Jain Ayurvedic Store</h1>
      <p>Your order has been placed successfully 🎉</p>
    </div>

    <div style="
      background: white;
      padding: 25px;
      border-radius: 0 0 10px 10px;
    ">

      <h2>Hello ${order.address.fullName},</h2>

      <p>
        Thank you for shopping with us.
        Your order is now confirmed.
      </p>

      <hr />

      <h3>Order Details</h3>

      <p>
        <strong>Tracking ID:</strong>
        ${order.trackingId}
      </p>

      <p>
        <strong>Status:</strong>
        ${order.status}
      </p>

      <p>
        <strong>Estimated Delivery:</strong>
        ${new Date(order.estimatedDelivery).toDateString()}
      </p>

      <hr />

      <h3>Items</h3>

      ${order.items.map(item => `
        <div style="
          display:flex;
          align-items:center;
          margin-bottom:15px;
        ">

          <img
            src="${item.image}"
            width="70"
            height="70"
            style="
              border-radius:10px;
              object-fit:cover;
              margin-right:15px;
            "
          />

          <div>
            <h4 style="margin:0;">
              ${item.name}
            </h4>

            <p style="margin:0;">
              Qty: ${item.quantity}
            </p>

            <p style="margin:0;">
              ₹${item.price}
            </p>
          </div>

        </div>
      `).join("")}

      <hr />

      <h3>Delivery Address</h3>

      <p>
        ${order.address.doorNo},
        ${order.address.street},
        ${order.address.city},
        ${order.address.state}
        - ${order.address.pincode}
      </p>

      <hr />

      <h2 style="color:#16a34a;">
        Total: ₹${order.totalAmount}
      </h2>

      <p>
        Thank you for choosing
        Jain Ayurvedic Store ❤️
      </p>

    </div>

  </div>

  `;
};







const shippedTemplate = (order) => {

  return `

  <div style="font-family:Arial;padding:20px">

    <h2 style="color:#16a34a">
      Your Order Has Been Shipped 🚚
    </h2>

    <p>
      Tracking ID:
      <b>${order.trackingId}</b>
    </p>

    <p>
      Your package is now on the way.
    </p>

    <p>
      Estimated Delivery:
      <b>
        ${new Date(
          order.estimatedDelivery
        ).toDateString()}
      </b>
    </p>

  </div>

  `;
};



const outForDeliveryTemplate = (order) => {

  return `

  <div style="font-family:Arial;padding:20px">

    <h2 style="color:#f59e0b">
      Out For Delivery 🚛
    </h2>

    <p>
      Your order will arrive today.
    </p>

    <h3>
      Delivery OTP:
      ${order.deliveryOTP}
    </h3>

    <p>
      Share OTP only after receiving order.
    </p>

  </div>

  `;
};




const deliveredTemplate = (order) => {

  return `

  <div style="font-family:Arial;padding:20px">

    <h2 style="color:#16a34a">
      Order Delivered ✅
    </h2>

    <p>
      Your order has been delivered successfully.
    </p>

    <p>
      Tracking ID:
      <b>${order.trackingId}</b>
    </p>

    <h3>
      Thank you for shopping with us ❤️
    </h3>

  </div>

  `;
};

const adminOrderTemplate = (order) => {

  return `

  <div style="font-family:Arial;padding:20px">

    <h2>
      New Order Received 🛒
    </h2>

    <p>
      Customer:
      ${order.address.fullName}
    </p>

    <p>
      Phone:
      ${order.address.phone}
    </p>

    <p>
      Total:
      ₹${order.totalAmount}
    </p>

    <p>
      Tracking ID:
      ${order.trackingId}
    </p>

  </div>

  `;
};





module.exports = {

  orderPlacedTemplate,

  shippedTemplate,

  outForDeliveryTemplate,

  deliveredTemplate,

  adminOrderTemplate

};