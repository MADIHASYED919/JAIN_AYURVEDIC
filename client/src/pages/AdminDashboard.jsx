import { useEffect, useState } from "react";

import axios from "../axiosConfig";

import "./adminDashboard.css";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [editingId, setEditingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

const [uploadProgress, setUploadProgress] = useState(0);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    images: [],
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
      console.log(err.response?.data || err);
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
      console.log(err.response?.data || err);
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
      name: item.name || "",
      price: item.price || "",
      images: item.images || [],
      description: item.description || "",
      category: item.category || "",
      stock: item.stock || "",
    });
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setProduct({
      name: "",
      price: "",
    images:[],
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
              {item.images?.[0] && (
  <img
  src={
    item.images?.[0]?.url ||
    item.image?.[0]
  }
  alt=""
  className="table-img"
/>
)}
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
  multiple

  onChange={async (e) => {

    const files = Array.from(e.target.files);

    console.log(files);
console.log(files.length);


    if (files.length === 0) return;

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    try {

     setUploading(true);

const res = await axios.post(
  "/api/products/upload",
  formData,
  {
    onUploadProgress: (progressEvent) => {

      const percent = Math.round(
        (progressEvent.loaded * 100) /
        progressEvent.total
      );

      setUploadProgress(percent);
    },
  }
);

setUploading(false);

      setProduct({
  ...product,
  images: [
    ...(product.images || []),
    ...res.data.images
  ]
});

      alert("✅ Images uploaded");

    } catch (err) {

      console.log(err.response?.data || err);

    }

  }}
/>

          {uploading && (
  <div className="upload-loader">

    <div className="spinner"></div>

    <p>Uploading {uploadProgress}%</p>

  </div>
)}  

<div className="preview-gallery">

  {product.images?.map((img, index) => (

    <div className="preview-item" key={index}>

      <img
        src={img.url}
        alt=""
        width="100"
        className="preview-img"
      />

      <button
        className="remove-btn"
       onClick={async () => {

  try {

    await axios.delete(
      "/api/products/delete-image",
      {
        data: {
          public_id: img.public_id
        }
      }
    );

    const updatedImages =
      product.images.filter(
        (_, i) => i !== index
      );

    setProduct({
      ...product,
      images: updatedImages,
    });

  } catch (err) {

    console.log(err);

  }

}}
      >
        ✕
      </button>

    </div>

  ))}

</div>





      



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
