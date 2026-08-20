// src/pages/Dashboard/Products.jsx

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import api from "../../services/api";
import "./Products.css";

// ============================================================
// SIDEBAR
// ============================================================

function SidebarLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient
          id="plg1"
          x1="0"
          y1="0"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#F72585" />
        </linearGradient>

        <linearGradient
          id="plg2"
          x1="0"
          y1="40"
          x2="40"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFAB00" />
          <stop offset="100%" stopColor="#00C9B1" />
        </linearGradient>
      </defs>

      <path
        d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z"
        fill="rgba(124,58,237,.1)"
        stroke="url(#plg1)"
        strokeWidth="1.8"
      />

      <path
        d="M13 13 L19.5 26 L20 24.5 L20.5 26 L27 13"
        stroke="url(#plg2)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="20"
        cy="20"
        r="2.8"
        fill="url(#plg1)"
      />
    </svg>
  );
}

function Sidebar({ active }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className="sb">
      <div className="sb-logo">
        <div
          className="logo-link"
          onClick={() => navigate("/")}
        >
          <SidebarLogo />

          <span className="sb-logo-txt">
            Vendor<b>Verse</b>
          </span>
        </div>
      </div>

      <div className="sb-sec">
        <span className="sb-lbl">Main</span>

        <button
          className={`sb-a${
            active === "overview" ? " on" : ""
          }`}
          onClick={() => navigate("/dashboard")}
        >
          <span className="sb-ic">📊</span>
          Overview
        </button>

        <button
          className={`sb-a${
            active === "products" ? " on" : ""
          }`}
          onClick={() => navigate("/dashboard/products")}
        >
          <span className="sb-ic">📦</span>
          Products
        </button>

        <button
          className={`sb-a${
            active === "shop" ? " on" : ""
          }`}
          onClick={() => navigate("/dashboard/shop")}
        >
          <span className="sb-ic">🏪</span>
          My Shop
        </button>

        <button
          className={`sb-a${
            active === "reviews" ? " on" : ""
          }`}
          onClick={() => navigate("/dashboard/reviews")}
        >
          <span className="sb-ic">⭐</span>
          Reviews
        </button>
      </div>

      <div
        className="sb-sec"
        style={{ marginTop: 8 }}
      >
        <span className="sb-lbl">Other</span>

        <button
          className="sb-a"
          onClick={() => navigate("/explore")}
        >
          <span className="sb-ic">🔍</span>
          Explore
        </button>

        <button
          className="sb-a logout"
          onClick={logout}
        >
          <span className="sb-ic">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}


// ============================================================
// CONSTANTS
// ============================================================

const CATEGORIES = [
  "All",
  "Food",
  "Beverage",
  "Snacks",
  "Bakery",
  "Clothing",
  "Beauty",
  "Grocery",
  "Electronics",
  "Other",
];

const CATEGORY_BG = {
  Food: "#FFF4EE",
  Beverage: "#EFF6FF",
  Snacks: "#FFF8E1",
  Bakery: "#FFF3E0",
  Clothing: "#F5F0FF",
  Beauty: "#FFF0F6",
  Grocery: "#E6FAF8",
  Electronics: "#EEF2FF",
  Other: "#F5F0FF",
};

const BLANK_FORM = {
  name: "",
  price: "",
  category: "Food",
  description: "",
  unit: "per item",
  available: true,
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 16,
  },

  visible: (i = 0) => ({
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.38,
      delay: i * 0.05,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};


// ============================================================
// PRODUCTS PAGE
// ============================================================

export default function Products() {
  const navigate = useNavigate();
  const { user , token} = useAuth();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [availFilter, setAvailFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [form, setForm] = useState(BLANK_FORM);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);


// ============================================================
// FETCH VENDOR PRODUCTS
// ============================================================

  const fetchProducts = async () => {
  if (!token) return;

  try {
    setLoading(true);

    const { data } = await api.get("/products/vendor", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProducts(data);
  } catch (error) {
    console.error("Fetch products error:", error);

    // Only show an error if the request actually failed.
    toast.error(
      error.response?.data?.message ||
        "Failed to load products"
    );
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
  if (!token) return;

  fetchProducts();
}, [token]);


// ============================================================
// FILTER PRODUCTS
// ============================================================

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return products.filter((p) => {
      const matchSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);

      const matchCat =
        catFilter === "All" ||
        p.category === catFilter;

      const matchAvail =
        availFilter === "All" ||
        (availFilter === "Available"
          ? p.available
          : !p.available);

      return (
        matchSearch &&
        matchCat &&
        matchAvail
      );
    });
  }, [
    products,
    search,
    catFilter,
    availFilter,
  ]);


// ============================================================
// MODAL
// ============================================================

  const openAdd = () => {
    setEditTarget(null);
    setForm(BLANK_FORM);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditTarget(product._id);

    setForm({
      name: product.name || "",
      price:
        product.price !== undefined
          ? String(product.price)
          : "",
      category:
        product.category || "Food",
      description:
        product.description || "",
      unit:
        product.unit || "per item",
      available:
        product.available !== false,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditTarget(null);
    setForm(BLANK_FORM);
  };


// ============================================================
// ADD / UPDATE PRODUCT
// ============================================================

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      toast.error("Enter a valid price");
      return;
    }

    if (!form.description.trim()) {
      toast.error(
        "Product description is required"
      );
      return;
    }

    try {
      setSaving(true);

      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        unit: form.unit.trim() || "per item",
        available: form.available,
      };

      // EDIT
      if (editTarget) {
        const { data } = await api.put(
          `/products/${editTarget}`,
          productData
        );

        setProducts((current) =>
          current.map((product) =>
            product._id === editTarget
              ? data.product
              : product
          )
        );

        toast.success(
          "Product updated successfully"
        );
      }

      // ADD
      else {
        const { data } = await api.post(
          "/products",
          productData
        );

        setProducts((current) => [
          data.product,
          ...current,
        ]);

        toast.success(
          "Product added successfully"
        );
      }

      setShowModal(false);
      setEditTarget(null);
      setForm(BLANK_FORM);
    } catch (error) {
      console.error(
        "Save product error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to save product"
      );
    } finally {
      setSaving(false);
    }
  };


// ============================================================
// DELETE PRODUCT
// ============================================================

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      await api.delete(
        `/products/${deleteTarget._id}`
      );

      setProducts((current) =>
        current.filter(
          (product) =>
            product._id !== deleteTarget._id
        )
      );

      toast.success(
        "Product deleted successfully"
      );

      setDeleteTarget(null);
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    } finally {
      setDeleting(false);
    }
  };


// ============================================================
// TOGGLE AVAILABILITY
// ============================================================

  const toggleAvail = async (product) => {
    try {
      const { data } = await api.put(
        `/products/${product._id}`,
        {
          available: !product.available,
        }
      );

      setProducts((current) =>
        current.map((p) =>
          p._id === product._id
            ? data.product
            : p
        )
      );

      toast.success(
        !product.available
          ? "Product marked available"
          : "Product marked unavailable"
      );
    } catch (error) {
      console.error(
        "Availability update error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update availability"
      );
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

        <motion.div
          className="prod-hd"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div>
            <div className="prod-title">
              Products
            </div>

            <div className="prod-sub">
              Manage your product listings
            </div>
          </div>

          <button
            className="btn bp bsm"
            onClick={openAdd}
          >
            + Add product
          </button>
        </motion.div>


        {/* CONTROLS */}

        <motion.div
          className="prod-controls"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <div className="prod-search">
            <span>🔍</span>

            <input
              placeholder="Search products…"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <select
            className="prod-select"
            value={catFilter}
            onChange={(e) =>
              setCatFilter(e.target.value)
            }
          >
            {CATEGORIES.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

          <select
            className="prod-select"
            value={availFilter}
            onChange={(e) =>
              setAvailFilter(e.target.value)
            }
          >
            <option value="All">
              All
            </option>

            <option value="Available">
              Available
            </option>

            <option value="Unavailable">
              Unavailable
            </option>
          </select>
        </motion.div>


        {/* COUNT */}

        <div className="prod-count">
          Showing {filtered.length} product
          {filtered.length !== 1
            ? "s"
            : ""}
        </div>


        {/* PRODUCT TABLE */}

        <motion.div
          className="prod-card"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >

          {loading ? (
            <div className="prod-empty">
              <div className="prod-empty-em">
                ⏳
              </div>

              <h3>
                Loading products...
              </h3>

              <p>
                Please wait while your products
                are loaded.
              </p>
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
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay:
                          index * 0.04,
                        duration: 0.3,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      overflow: "hidden",
                    }}
                  >

                    {/* IMAGE */}

                    <div
                      className="prod-img-cell"
                      style={{
                        background:
                          CATEGORY_BG[
                            product.category
                          ] ||
                          "#F5F0FF",
                      }}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "inherit",
                          }}
                        />
                      ) : (
                        "📦"
                      )}
                    </div>


                    {/* NAME + DESCRIPTION */}

                    <div className="prod-name-cell">
                      <div className="name">
                        {product.name}
                      </div>

                      {product.description && (
                        <div className="desc">
                          {product.description.slice(
                            0,
                            48
                          )}

                          {product.description.length >
                          48
                            ? "…"
                            : ""}
                        </div>
                      )}
                    </div>


                    {/* PRICE */}

                    <div className="prod-price">
                      ₹{product.price}
                    </div>


                    {/* CATEGORY */}

                    <div>
                      <span
                        className="badge bv"
                        style={{
                          fontSize: 10,
                        }}
                      >
                        {product.category}
                      </span>
                    </div>


                    {/* AVAILABLE */}

                    <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
  }}
>
  <label className="tog">
    <input
      type="checkbox"
      checked={Boolean(product.available)}
      onChange={() => toggleAvail(product)}
    />

    <span className="tog-sl" />
  </label>

  <span
    style={{
      fontSize: 12,
      fontWeight: 700,
      color: product.available ? "#059669" : "#6B7280",
      minWidth: 70,
    }}
  >
    {product.available ? "Available" : "Unavailable"}
  </span>
</div>

                       


                    {/* ACTIONS */}

                    <div className="prod-actions">

                      <button
                        className="act-btn edit"
                        onClick={() =>
                          openEdit(product)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="act-btn del"
                        onClick={() =>
                          setDeleteTarget(
                            product
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>

            </div>

          ) : (

            <div className="prod-empty">

              <div className="prod-empty-em">
                📦
              </div>

              <h3>
                {products.length === 0
                  ? "No products yet"
                  : "No products found"}
              </h3>

              <p>
                {products.length === 0
                  ? "Add your first product to get started."
                  : "Try adjusting your search or filters."}
              </p>

            </div>
          )}

        </motion.div>

      </main>


      {/* ======================================================
          ADD / EDIT MODAL
      ====================================================== */}

      <AnimatePresence>
        {showModal && (

          <motion.div
            className="pm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            <motion.div
              className="pm-modal"
              initial={{
                y: 24,
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                y: 0,
                opacity: 1,
                scale: 1,
              }}
              exit={{
                y: 16,
                opacity: 0,
              }}
            >

              {/* HEADER */}

              <div className="pm-hd">

                <div className="pm-title">
                  {editTarget
                    ? "Edit product"
                    : "Add product"}
                </div>

                <button
                  className="pm-close"
                  onClick={closeModal}
                  disabled={saving}
                >
                  ✕
                </button>

              </div>


              {/* NAME + PRICE */}

              <div className="pm-2col">

                <div className="pm-field">

                  <label className="pm-label">
                    Product name *
                  </label>

                  <input
                    className="pm-input"
                    placeholder="e.g. Masala Dosa"
                    value={form.name}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        name: e.target.value,
                      }))
                    }
                  />

                </div>


                <div className="pm-field">

                  <label className="pm-label">
                    Price (₹) *
                  </label>

                  <input
                    className="pm-input"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        price: e.target.value,
                      }))
                    }
                  />

                </div>

              </div>


              {/* CATEGORY + UNIT */}

              <div className="pm-2col">

                <div className="pm-field">

                  <label className="pm-label">
                    Category *
                  </label>

                  <select
                    className="pm-input"
                    value={form.category}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        category: e.target.value,
                      }))
                    }
                  >
                    {CATEGORIES
                      .filter(
                        (c) => c !== "All"
                      )
                      .map((category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ))}
                  </select>

                </div>


                <div className="pm-field">

                  <label className="pm-label">
                    Unit
                  </label>

                  <input
                    className="pm-input"
                    placeholder="per item"
                    value={form.unit}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        unit: e.target.value,
                      }))
                    }
                  />

                </div>

              </div>


              {/* DESCRIPTION */}

              <div className="pm-field">

                <label className="pm-label">
                  Description *
                </label>

                <textarea
                  className="pm-input"
                  placeholder="Describe this product..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      description:
                        e.target.value,
                    }))
                  }
                />

              </div>


              {/* AVAILABLE */}

              <div
                className="pm-field"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >

                <label className="tog">

                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        available:
                          e.target.checked,
                      }))
                    }
                  />

                  <span className="tog-sl" />

                </label>

                <span
                  style={{
                    fontSize: 13,
                    color: "var(--ink2)",
                    fontWeight: 600,
                  }}
                >
                  Available to customers
                </span>

              </div>


              {/* FOOTER */}

              <div className="pm-foot">

                <button
                  className="btn bg bsm"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  className="btn bp bsm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editTarget
                    ? "Save changes"
                    : "Add product"}
                </button>

              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>


      {/* ======================================================
          DELETE CONFIRMATION
      ====================================================== */}

      <AnimatePresence>
        {deleteTarget && (

          <motion.div
            className="pm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            <motion.div
              className="pm-modal del-modal"
              initial={{
                y: 24,
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                y: 0,
                opacity: 1,
                scale: 1,
              }}
              exit={{
                y: 16,
                opacity: 0,
              }}
            >

              <div className="del-icon">
                🗑️
              </div>

              <div className="del-title">
                Delete product?
              </div>

              <div className="del-desc">
                Are you sure you want to delete{" "}
                <strong>
                  "{deleteTarget.name}"
                </strong>
                ? This action cannot be undone.
              </div>

              <div className="del-foot">

                <button
                  className="btn bg bsm"
                  onClick={() =>
                    setDeleteTarget(null)
                  }
                  disabled={deleting}
                >
                  Cancel
                </button>

                <button
                  className="btn bc bsm"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting
                    ? "Deleting..."
                    : "Yes, delete"}
                </button>

              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}