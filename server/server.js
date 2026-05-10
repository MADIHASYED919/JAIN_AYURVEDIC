require("dotenv").config();
const connectDB =
require("./config/db");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const http = require("http");
const { Server } = require("socket.io");

const app = express();
connectDB();

const server = http.createServer(app);

// =======================================
// SOCKET.IO
// =======================================

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://jain-ayurvedic.vercel.app"
    ],
    credentials: true
  }
});
// MAKE IO GLOBAL

app.set("io", io);

// =======================================
// SOCKET CONNECTION
// =======================================

io.on("connection", (socket) => {

  console.log("User Connected:", socket.id);

  // // JOIN ORDER ROOM

  // socket.on("joinOrderRoom", (orderId) => {

  //   socket.join(orderId);

  //   console.log(
  //     `User joined room: ${orderId}`
  //   );

  // });

  socket.on("disconnect", () => {

    console.log(
      "User Disconnected:",
      socket.id
    );

  });

});

// =======================================
// MAKE IO GLOBAL
// =======================================

app.set("io", io);

// =======================================
// MIDDLEWARE
// =======================================

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://jain-ayurvedic.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// =======================================
// DATABASE
// =======================================

// mongoose.connect(
//   "mongodb://127.0.0.1:27017/jain-store"
// )
// .then(() => console.log("DB Connected"))
// .catch(err => console.log(err));

// =======================================
// SESSION
// =======================================

app.use(session({

  store: MongoStore.create({
    mongoUrl:
      process.env.MONGO_URI,
  }),

  secret: "mysupersecretkey",

  resave: false,

  saveUninitialized: false,

  cookie: {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000
}

}));

// =======================================
// ROUTES
// =======================================

const authRoutes =
  require("./routes/authRoutes");

const cartRoutes =
  require("./routes/cartRoutes");

const productRoutes =
  require("./routes/productRoutes");

const orderRoutes =
  require("./routes/orderRoutes");

const wishlistRoutes =
  require("./routes/wishlistRoutes");

const testMailRoutes =
  require("./routes/testMailRoutes");

const scanRoutes =
  require("./routes/scanRoutes");

// =======================================
// API ROUTES
// =======================================

app.use("/api/auth", authRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/scan", scanRoutes);

app.use("/api/test-mail", testMailRoutes);

// =======================================
// CHECK USER
// =======================================

app.get("/api/auth/me", (req, res) => {

  res.json({
    user: req.session.user || null
  });

});

// =======================================
// START SERVER
// =======================================

server.listen(5000, () => {

  console.log(
    "Server running on port 5000"
  );

});