const PDFDocument = require("pdfkit");

const generateInvoice = (order, res) => {

  const doc = new PDFDocument({
    margin: 50
  });

  // =========================
  // RESPONSE HEADERS
  // =========================

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order.trackingId}.pdf`
  );

  doc.pipe(res);

  // =========================
  // HEADER
  // =========================

  doc
    .fontSize(26)
    .fillColor("#16a34a")
    .text(
      "Jain Ayurvedic Store",
      {
        align: "center"
      }
    );

  doc.moveDown();

  doc
    .fontSize(18)
    .fillColor("black")
    .text(
      "INVOICE",
      {
        align: "center"
      }
    );

  doc.moveDown(2);

  // =========================
  // ORDER DETAILS
  // =========================

  doc.fontSize(12);

  doc.text(
    `Invoice ID: INV-${order.trackingId}`
  );

  doc.text(
    `Tracking ID: ${order.trackingId}`
  );

  doc.text(
    `Order Date: ${new Date(
      order.createdAt
    ).toDateString()}`
  );

  doc.text(
    `Status: ${order.status}`
  );

  doc.moveDown();

  // =========================
  // CUSTOMER DETAILS
  // =========================

  doc
    .fontSize(15)
    .fillColor("#16a34a")
    .text("Customer Details");

  doc.moveDown(0.5);

  doc
    .fontSize(12)
    .fillColor("black");

  doc.text(
    `Name: ${order.address.fullName}`
  );

  doc.text(
    `Phone: ${order.address.phone}`
  );

  doc.text(
    `Address: ${order.address.doorNo}, ${order.address.street}`
  );

  doc.text(
    `${order.address.city}, ${order.address.state} - ${order.address.pincode}`
  );

  doc.moveDown(2);

  // =========================
  // PRODUCT TABLE
  // =========================

  doc
    .fontSize(15)
    .fillColor("#16a34a")
    .text("Products");

  doc.moveDown();

  let tableTop = doc.y;

  // TABLE HEADER

  doc
    .fontSize(12)
    .fillColor("white")
    .rect(50, tableTop, 500, 25)
    .fill("#16a34a");

  doc
    .fillColor("white")
    .text("Product", 60, tableTop + 7);

  doc.text("Qty", 300, tableTop + 7);

  doc.text("Price", 380, tableTop + 7);

  doc.text("Total", 470, tableTop + 7);

  let position = tableTop + 30;

  // PRODUCTS

  order.items.forEach((item) => {

    const itemTotal =
      item.price * item.quantity;

    doc
      .fillColor("black")
      .fontSize(11);

    doc.text(
      item.name,
      60,
      position
    );

    doc.text(
      item.quantity.toString(),
      300,
      position
    );

    doc.text(
      ` ₹ ${item.price}`,
      380,
      position
    );

    doc.text(
      ` ₹ ${itemTotal}`,
      470,
      position
    );

    position += 25;
  });

  doc.moveDown(4);

  // =========================
  // TOTAL
  // =========================

  doc
    .fontSize(18)
    .fillColor("#16a34a")
    .text(
      `Grand Total: ₹ ${order.totalAmount}`,
      {
        align: "right"
      }
    );

  doc.moveDown(2);

  // =========================
  // FOOTER
  // =========================

  doc
    .fontSize(12)
    .fillColor("gray")
    .text(
      "Thank you for shopping with Jain Ayurvedic Store ❤️",
      {
        align: "center"
      }
    );

  doc.end();
};

module.exports = generateInvoice;