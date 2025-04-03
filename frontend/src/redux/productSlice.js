import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch Products with Pagination, Search, Sorting
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 1, search = "", sortBy = "", order = "asc" }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.get("http://localhost:5000/api/products", {
        params: { page, search, sortBy, order }, // ✅ Query params
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data; // ✅ Response contains { products, currentPage, totalPages, totalProducts }
    } catch (err) {
      return rejectWithValue("Failed to load products");
    }
  }
);

// Create Product
export const addProduct = createAsyncThunk("products/addProduct", async (formData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token"); // Get JWT token
    const config = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } };

    const response = await axios.post("http://localhost:5000/api/products", formData, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Something went wrong");
  }
});

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } };

      const response = await axios.put(`http://localhost:5000/api/products/${productId}`, formData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update product");
    }
  }
);

// Delete Product
export const deleteProduct = createAsyncThunk("products/deleteProduct", async (productId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`http://localhost:5000/api/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status !== 200) throw new Error("Failed to delete product");
    return productId; // ✅ Return the deleted product's ID
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products; // ✅ Store only products array
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload); // ✅ Add new product to state
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.items = state.items.map((product) =>
          product._id === action.payload._id ? action.payload : product
        );
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((product) => product._id !== action.payload); // ✅ Remove deleted product
      });
  },
});

export default productSlice.reducer;
