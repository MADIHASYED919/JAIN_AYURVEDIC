# API Documentation

Base URL:

```bash
Base URL:

https://jain-ayurvedic.onrender.com
```

---

# AUTH APIs

## Register User

POST `/api/auth/register`

### Body

```json
{
  "name": "Madiha",
  "email": "test@gmail.com",
  "password": "123456"
}
```

---

## Login User

POST `/api/auth/login`

---

## Logout User

POST `/api/auth/logout`

---

# PRODUCT APIs

## Get All Products

GET `/api/products`

---

## Search Products

GET `/api/products/search?q=ashwagandha`

---

## Get Single Product

GET `/api/products/:id`

---

# CART APIs

## Get Cart

GET `/api/cart`

---

## Add To Cart

POST `/api/cart/add`

---

## Remove From Cart

POST `/api/cart/remove`

---

## Save For Later

POST `/api/cart/save-for-later`

---

# ORDER APIs

## Place Order

POST `/api/orders/place`

---

## My Orders

GET `/api/orders/my`

---

## Cancel Order

PUT `/api/orders/cancel/:id`

---

# AI APIs

## Medicine Scanner

POST `/api/scan`

---

# UPCOMING APIs

- Razorpay Payment
- Admin Dashboard
- Stock Management
- Invoice Download