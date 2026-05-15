import { useEffect, useState } from "react";

import axios from "../axiosConfig";

import "./adminDashboard.css";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [editingId, setEditingId] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
    stock: "",
  });

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products/admin/all");

      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // ADD PRODUCT
  // =========================

  const addProduct = async () => {
    try {
      await axios.post("/api/products/add", product);

      alert("✅ Product Added");

      fetchProducts();

      resetForm();
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");

    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/products/delete/${id}`);

      fetchProducts();
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // UPDATE PRODUCT
  // =========================

  const updateProduct = async () => {
    try {
      await axios.put(`/api/products/update/${editingId}`, product);

      alert("✅ Product Updated");

      setEditingId(null);

      fetchProducts();

      resetForm();
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // EDIT PRODUCT
  // =========================

  const editProduct = (item) => {
    setEditingId(item._id);

    setShowModal(true);

    setProduct({
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description,
      category: item.category,
      stock: item.stock,
    });
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setProduct({
      name: "",
      price: "",
      image: "",
      description: "",
      category: "",
      stock: "",
    });

    setShowModal(false);

    setEditingId(null);
  };

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts = products.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "All" ? true : item.category === category;

    return matchSearch && matchCategory;
  });

  return (
    <div className="admin-dashboard">
      <h1>🛠 Admin Dashboard</h1>

      {/* ===================== */}
      {/* ANALYTICS */}
      {/* ===================== */}

      <div className="analytics">
        <div className="card">
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>

        <div className="card">
          <h3>Low Stock</h3>

          <p>{products.filter((p) => p.stock < 5).length}</p>
        </div>
      </div>

      {/* ===================== */}
      {/* SEARCH + FILTER */}
      {/* ===================== */}

      <div className="top-controls">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>

          <option>tablet</option>

          <option>syrup</option>

          <option>capsule</option>
        </select>

        <button onClick={() => setShowModal(true)}>+ Add Product</button>
      </div>

      {/* ===================== */}
      {/* PRODUCT TABLE */}
      {/* ===================== */}

      <table>
        <thead>
          <tr>
            <th>Image</th>

            <th>Name</th>

            <th>Category</th>

            <th>Price</th>

            <th>Stock</th>

            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((item) => (
            <tr key={item._id}>
              <td>
                <img src={item.image?.[0]} alt="" className="table-img" />
              </td>

              <td>{item.name}</td>

              <td>{item.category}</td>

              <td>₹{item.price}</td>

              <td>
                <span className={item.stock < 5 ? "low-stock" : "in-stock"}>
                  {item.stock}
                </span>
              </td>

              <td>
                <button onClick={() => editProduct(item)}>Edit</button>

                <button onClick={() => deleteProduct(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===================== */}
      {/* MODAL */}
      {/* ===================== */}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

            <input
              placeholder="Name"
              value={product.name}
              onChange={(e) =>
                setProduct({
                  ...product,
                  name: e.target.value,
                })
              }
            />

            <input
              placeholder="Price"
              value={product.price}
              onChange={(e) =>
                setProduct({
                  ...product,
                  price: e.target.value,
                })
              }
            />

            <input
              type="file"
              placeholder="Upload Image"
              onChange={async (e) => {
                const file = e.target.files[0];

                const formData = new FormData();

                formData.append("image", file);

                try {
                  const res = await axios.post(
                    "/api/products/upload",
                    formData,
                  );

                  setProduct({
                    ...product,

                    image: [res.data.imageUrl],
                  });

                  alert("✅ Image uploaded");
                } catch (err) {
                  console.log(err);
                }
              }}
            />
            {product.image && (
              <img
                src={product.image?.[0]}
                alt=""
                width="120"
                style={{
                  borderRadius: "10px",
                }}
              />
            )}

            <input
              placeholder="Category"
              value={product.category}
              onChange={(e) =>
                setProduct({
                  ...product,
                  category: e.target.value,
                })
              }
            />

            <input
              placeholder="Stock"
              value={product.stock}
              onChange={(e) =>
                setProduct({
                  ...product,
                  stock: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Description"
              value={product.description}
              onChange={(e) =>
                setProduct({
                  ...product,
                  description: e.target.value,
                })
              }
            />

            <div className="modal-buttons">
              <button
                type="button"
                onClick={editingId ? updateProduct : addProduct}
              >
                {editingId ? "Update" : "Add"}
              </button>
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
