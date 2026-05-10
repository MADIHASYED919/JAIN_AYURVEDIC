const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");

// REGISTER + AUTO LOGIN
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    // ✅ AUTO LOGIN AFTER REGISTER
    req.session.user = {
      id: user._id,
      name:user.name,
      email: user.email,
      isAdmin: user.isAdmin
    };

    res.json({ success: true, user: req.session.user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({ error: "Wrong password" });

  req.session.user = {
    id: user._id,
     name: user.name, // 🔥 ADD THIS
    email: user.email,
    isAdmin: user.isAdmin
  };

  res.json({ success: true, user: req.session.user });
});

// LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

module.exports = router;