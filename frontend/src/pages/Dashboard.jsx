import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../redux/productSlice";
import { logout } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading, error, currentPage, totalPages } = useSelector(
    (state) => state.products
  );
  const { token } = useSelector((state) => state.auth);

  console.log(items);

  // 🔹 State for filters & pagination
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      dispatch(fetchProducts({ page, search, sortBy, order }));
    }
  }, [dispatch, token, page, search, sortBy, order]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      dispatch(deleteProduct(id))
        .unwrap()
        .then(() => {
          alert("Product deleted successfully!");
        })
        .catch((err) => {
          console.error("Delete failed:", err);
          alert("Failed to delete product!");
        });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 🔹 Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Dashboard</h1>
        <button
          onClick={() => {
            dispatch(logout());
            navigate("/login");
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* 🔹 Search & Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          className="p-2 border rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>
        <select
          className="p-2 border rounded"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* 🔹 Add Product Button */}
      <div className="mb-6">
        <Link
          to="/add-product"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Product
        </Link>
      </div>

      {/* 🔹 Error Handling */}
      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* 🔹 Product List */}
      {items.length === 0 && !loading ? (
        <p className="text-gray-500 text-center mt-4">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <div
              key={product._id}
              className="p-4 border rounded-lg shadow-lg bg-white hover:shadow-xl transition"
            >
              {/* Product Image */}
              <div className="w-full h-48 bg-gray-200 flex justify-center items-center overflow-hidden rounded-md">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">No Image</span>
                )}
              </div>

              {/* Product Details */}
              <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
              <p className="text-gray-600 text-sm">${product.price}</p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              <p className="text-sm text-gray-700">{product.description}</p>
              <p className="text-sm text-gray-500">
                Category: {product.category}
              </p>
              <p className="text-xs text-gray-400">
                Mfg Date: {new Date(product.manufacturingDate).toDateString()}
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-between">
                <Link
                  to={`/edit-product/${product._id}`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 border rounded mr-2 bg-gray-200 hover:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded ml-2 bg-gray-200 hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
