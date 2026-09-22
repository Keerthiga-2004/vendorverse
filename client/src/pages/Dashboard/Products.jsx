// src/pages/Dashboard/Products.jsx

import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./Products.css";

// ============================================================
// SIDEBAR (unchanged)
// ============================================================

function SidebarLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="plg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#F72585" />
        </linearGradient>
        <linearGradient id="plg2" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFAB00" />
          <stop offset="100%" stopColor="#00C9B1" />
        </linearGradient>
      </defs>
      <path d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z" fill="rgba(124,58,237,.1)" stroke="url(#plg1)" strokeWidth="1.8" />
      <path d="M13 13 L19.5 26 L20 24.5 L20.5 26 L27 13" stroke="url(#plg2)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="2.8" fill="url(#plg1)" />
    </svg>
  );
}

function Sidebar({ active }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className="sb">
      <div className="sb-logo">
        <div className="logo-link" onClick={() => navigate("/")}>
          <SidebarLogo />
          <span className="sb-logo-txt">Vendor<b>Verse</b></span>
        </div>
      </div>

      <div className="sb-sec">
        <span className="sb-lbl">Main</span>
        <button className={`sb-a${active === "overview" ? " on" : ""}`} onClick={() => navigate("/dashboard")}>
          <span className="sb-ic">📊</span>Overview
        </button>
        <button className={`sb-a${active === "products" ? " on" : ""}`} onClick={() => navigate("/dashboard/products")}>
          <span className="sb-ic">📦</span>Products
        </button>
        <button className={`sb-a${active === "shop" ? " on" : ""}`} onClick={() => navigate("/dashboard/shop")}>
          <span className="sb-ic">🏪</span>My Shop
        </button>
        <button className={`sb-a${active === "reviews" ? " on" : ""}`} onClick={() => navigate("/dashboard/reviews")}>
          <span className="sb-ic">⭐</span>Reviews
        </button>
        <button className={`sb-a${active === "analytics" ? " on" : ""}`} onClick={() => navigate("/dashboard/analytics")}>
          <span className="sb-ic">📈</span>Analytics
        </button>
        
      </div>

      <div className="sb-sec" style={{ marginTop: 8 }}>
        <span className="sb-lbl">Other</span>
        <button className="sb-a" onClick={() => navigate("/explore")}>
          <span className="sb-ic">🔍</span>Explore
        </button>
        <button className="sb-a logout" onClick={logout}>
          <span className="sb-ic">🚪</span>Logout
        </button>
      </div>
    </aside>
  );
}

// ============================================================
// CONSTANTS (unchanged)
// ============================================================

const CATEGORIES = [
  "All", "Food", "Beverage", "Snacks", "Bakery",
  "Clothing", "Beauty", "Grocery", "Electronics", "Other",
];

const CATEGORY_BG = {
  Food: "#FFF4EE", Beverage: "#EFF6FF", Snacks: "#FFF8E1",
  Bakery: "#FFF3E0", Clothing: "#F5F0FF", Beauty: "#FFF0F6",
  Grocery: "#E6FAF8", Electronics: "#EEF2FF", Other: "#F5F0FF",
};

const BLANK_FORM = {
  name: "", price: "", category: "Food",
  description: "", unit: "per item", available: true,
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.38, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ============================================================
// PRODUCTS PAGE
// ============================================================

export default function Products() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [catFilter,   setCatFilter]   = useState("All");
  const [availFilter, setAvailFilter] = useState("All");
  const [showModal,   setShowModal]   = useState(false);
  const [editTarget,  setEditTarget]  = useState(null);
  const [form,        setForm]        = useState(BLANK_FORM);
  const [deleteTarget,setDeleteTarget]= useState(null);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(false);

  // ✅ ADDED: image upload state
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  // ============================================================
  // FETCH VENDOR PRODUCTS (unchanged)
  // ============================================================

  const fetchProducts = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const { data } = await api.get("/products/vendor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchProducts();
  }, [token]);

  // ============================================================
  // FILTER (unchanged)
  // ============================================================

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      const matchCat    = catFilter === "All" || p.category === catFilter;
      const matchAvail  =
        availFilter === "All" ||
        (availFilter === "Available" ? p.available : !p.available);
      return matchSearch && matchCat && matchAvail;
    });
  }, [products, search, catFilter, availFilter]);

  // ============================================================
  // MODAL OPEN / CLOSE
  // ============================================================

  const openAdd = () => {
    setEditTarget(null);
    setForm(BLANK_FORM);
    // ✅ ADDED: reset image state
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditTarget(product._id);
    setForm({
      name:        product.name        || "",
      price:       product.price !== undefined ? String(product.price) : "",
      category:    product.category    || "Food",
      description: product.description || "",
      unit:        product.unit        || "per item",
      available:   product.available   !== false,
    });
    // ✅ ADDED: show existing image as preview
    setImageFile(null);
    setImagePreview(product.image || "");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setEditTarget(null);
    setForm(BLANK_FORM);
    // ✅ ADDED: reset image state
    setImageFile(null);
    setImagePreview("");
  };

  // ✅ ADDED: handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic client-side validation
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG or WebP images are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ============================================================
  // ADD / UPDATE PRODUCT
  // ============================================================

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (form.price === "" || Number(form.price) < 0) {
      toast.error("Enter a valid price");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Product description is required");
      return;
    }

    try {
      setSaving(true);

      // ✅ CHANGED: build FormData so multer can receive the image file
      const formData = new FormData();
      formData.append("name",        form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("price",       Number(form.price));
      formData.append("category",    form.category);
      formData.append("unit",        form.unit.trim() || "per item");
      formData.append("available",   form.available);

      // Only append image if a new file was selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editTarget) {
        // EDIT
        const { data } = await api.put(
          `/products/${editTarget}`,
          formData,
          // ✅ Let browser set Content-Type with boundary automatically
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setProducts((current) =>
          current.map((p) => (p._id === editTarget ? data.product : p))
        );
        toast.success("Product updated successfully");
      } else {
        // ADD
        const { data } = await api.post(
          "/products",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setProducts((current) => [data.product, ...current]);
        toast.success("Product added successfully");
      }

      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE PRODUCT (unchanged)
  // ============================================================

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.delete(`/products/${deleteTarget._id}`);
      setProducts((current) =>
        current.filter((p) => p._id !== deleteTarget._id)
      );
      toast.success("Product deleted successfully");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================
  // TOGGLE AVAILABILITY (unchanged)
  // ============================================================

  const toggleAvail = async (product) => {
    try {
      const formData = new FormData();
      formData.append("available", !product.available);
      const { data } = await api.put(
        `/products/${product._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProducts((current) =>
        current.map((p) => (p._id === product._id ? data.product : p))
      );
      toast.success(
        !product.available ? "Product marked available" : "Product marked unavailable"
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update availability");
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="prod-wrap">
      <Sidebar active="products" />

      <main className="prod-main">

        {/* HEADER */}
        <motion.div className="prod-hd" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <div>
            <div className="prod-title">Products</div>
            <div className="prod-sub">Manage your product listings</div>
          </div>
          <button className="btn bp bsm" onClick={openAdd}>+ Add product</button>
        </motion.div>

        {/* CONTROLS */}
        <motion.div className="prod-controls" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <div className="prod-search">
            <span>🔍</span>
            <input
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="prod-select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="prod-select" value={availFilter} onChange={(e) => setAvailFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </motion.div>

        {/* COUNT */}
        <div className="prod-count">
          Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </div>

        {/* PRODUCT TABLE */}
        <motion.div className="prod-card" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          {loading ? (
            <div className="prod-empty">
              <div style={{ width: 36, height: 36, border: "3px solid #E5DFF5", borderTopColor: "#7C3AED", borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto 14px" }} />
              <h3>Loading products...</h3>
              <p>Please wait while your products are loaded.</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="prod-table">
              <div className="prod-thead">
                <div>Image</div>
                <div>Product</div>
                <div>Price</div>
                <div>Category</div>
                <div>Available</div>
                <div>Actions</div>
              </div>

              <AnimatePresence>
                {filtered.map((product, index) => (
                  <motion.div
                    key={product._id}
                    className="prod-row"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.04, duration: 0.3 } }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                  >
                    {/* IMAGE */}
                    <div
                      className="prod-img-cell"
                      style={{ background: CATEGORY_BG[product.category] || "#F5F0FF" }}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }}
                        />
                      ) : (
                        "📦"
                      )}
                    </div>

                    {/* NAME + DESC */}
                    <div className="prod-name-cell">
                      <div className="name">{product.name}</div>
                      {product.description && (
                        <div className="desc">
                          {product.description.slice(0, 48)}
                          {product.description.length > 48 ? "…" : ""}
                        </div>
                      )}
                    </div>

                    {/* PRICE */}
                    <div className="prod-price">₹{product.price}</div>

                    {/* CATEGORY */}
                    <div>
                      <span className="badge bv" style={{ fontSize: 10 }}>{product.category}</span>
                    </div>

                    {/* AVAILABLE */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <label className="tog">
                        <input type="checkbox" checked={Boolean(product.available)} onChange={() => toggleAvail(product)} />
                        <span className="tog-sl" />
                      </label>
                      <span style={{ fontSize: 12, fontWeight: 700, color: product.available ? "#059669" : "#6B7280", minWidth: 70 }}>
                        {product.available ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    {/* ACTIONS */}
                    <div className="prod-actions">
                      <button className="act-btn edit" onClick={() => openEdit(product)}>Edit</button>
                      <button className="act-btn del"  onClick={() => setDeleteTarget(product)}>Delete</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="prod-empty">
              <div className="prod-empty-em">📦</div>
              <h3>{products.length === 0 ? "No products yet" : "No products found"}</h3>
              <p>{products.length === 0 ? "Add your first product to get started." : "Try adjusting your search or filters."}</p>
            </div>
          )}
        </motion.div>

      </main>

      {/* ======================================================
          ADD / EDIT MODAL
      ====================================================== */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="pm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="pm-modal"
              initial={{ y: 24, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0 }}
            >
              {/* HEADER */}
              <div className="pm-hd">
                <div className="pm-title">{editTarget ? "Edit product" : "Add product"}</div>
                <button className="pm-close" onClick={closeModal} disabled={saving}>✕</button>
              </div>

              {/* NAME + PRICE */}
              <div className="pm-2col">
                <div className="pm-field">
                  <label className="pm-label">Product name *</label>
                  <input
                    className="pm-input"
                    placeholder="e.g. Masala Dosa"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="pm-field">
                  <label className="pm-label">Price (₹) *</label>
                  <input
                    className="pm-input"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  />
                </div>
              </div>

              {/* CATEGORY + UNIT */}
              <div className="pm-2col">
                <div className="pm-field">
                  <label className="pm-label">Category *</label>
                  <select
                    className="pm-input"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="pm-field">
                  <label className="pm-label">Unit</label>
                  <input
                    className="pm-input"
                    placeholder="per item"
                    value={form.unit}
                    onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="pm-field">
                <label className="pm-label">Description *</label>
                <textarea
                  className="pm-input"
                  placeholder="Describe this product..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              {/* ✅ ADDED: IMAGE UPLOAD */}
              <div className="pm-field">
                <label className="pm-label">Product image</label>

                {/* Preview */}
                {imagePreview && (
                  <div style={{ marginBottom: 10, borderRadius: 12, overflow: "hidden", width: 100, height: 100, border: "1.5px solid var(--border)" }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />

                {/* Styled trigger button */}
                <button
                  type="button"
                  className="btn bg bsm"
                  style={{ fontSize: 13 }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? "Change image" : "Upload image"}
                </button>

                {imageFile && (
                  <span style={{ fontSize: 12, color: "var(--ink3)", marginLeft: 10 }}>
                    {imageFile.name}
                  </span>
                )}

                <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 6 }}>
                  JPG, PNG or WebP · max 5MB
                </div>
              </div>

              {/* AVAILABLE */}
              <div className="pm-field" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <label className="tog">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
                  />
                  <span className="tog-sl" />
                </label>
                <span style={{ fontSize: 13, color: "var(--ink2)", fontWeight: 600 }}>
                  Available to customers
                </span>
              </div>

              {/* FOOTER */}
              <div className="pm-foot">
                <button className="btn bg bsm" onClick={closeModal} disabled={saving}>Cancel</button>
                <button className="btn bp bsm" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : editTarget ? "Save changes" : "Add product"}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================
          DELETE CONFIRMATION (unchanged)
      ====================================================== */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div className="pm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="pm-modal del-modal"
              initial={{ y: 24, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0 }}
            >
              <div className="del-icon">🗑️</div>
              <div className="del-title">Delete product?</div>
              <div className="del-desc">
                Are you sure you want to delete{" "}
                <strong>"{deleteTarget.name}"</strong>? This action cannot be undone.
              </div>
              <div className="del-foot">
                <button className="btn bg bsm" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
                <button className="btn bc bsm" onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Deleting..." : "Yes, delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}