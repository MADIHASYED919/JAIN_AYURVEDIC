import { useState } from "react";

import axios from "../axiosConfig";

const AdminDashboard = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
    stock: ""
  });

  const addProduct = async () => {
    try {
    await axios.post("/api/products/add", product,);
      alert("✅ Product added!");
    } catch (err) {
      alert("❌ Only admin allowed");
    }
  };

  return (
    <div>
      <h2>🛠 Admin Panel</h2>

      <input placeholder="Name"
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
      />

      <input placeholder="Price"
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
      />

      <input placeholder="Image URL"
        onChange={(e) => setProduct({ ...product, image: e.target.value })}
      />

      <input placeholder="Category"
        onChange={(e) => setProduct({ ...product, category: e.target.value })}
      />

      <input placeholder="Stock"
        onChange={(e) => setProduct({ ...product, stock: e.target.value })}
      />

      <textarea placeholder="Description"
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
      />

      <button onClick={addProduct}>Add Product</button>
    </div>
  );
};

export default AdminDashboard;






