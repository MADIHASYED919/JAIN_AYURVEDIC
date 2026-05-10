# API ROUTES DOCUMENTATION

# AUTH ROUTES

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

---

# PRODUCT ROUTES

GET /api/products
GET /api/products/:id
GET /api/products/search
GET /api/products/related/:id

---

# CART ROUTES

GET /api/cart
POST /api/cart/add
POST /api/cart/remove
POST /api/cart/save-for-later
POST /api/cart/move-to-cart

---

# WISHLIST ROUTES

GET /api/wishlist
POST /api/wishlist/add
POST /api/wishlist/remove

---

# ORDER ROUTES

POST /api/orders/place
GET /api/orders/my
PUT /api/orders/cancel/:id
GET /api/orders/:id

---

# ADMIN ROUTES

PUT /api/orders/admin/update-status/:id
GET /api/orders/admin/all