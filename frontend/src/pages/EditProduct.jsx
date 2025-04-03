import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct } from "../redux/productSlice";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.products);
  console.log("Products in Redux:", items);
  const [successMessage, setSuccessMessage] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const product = items?.find((p) => p._id === productId) || null;

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("price", product.price);
      setValue("stock", product.stock);
      setValue("description", product.description);
      setValue("category", product.category);
      setValue("manufacturingDate", product.manufacturingDate?.split("T")[0] || "");
      setPreviewImage(product.image || "");
    }
  }, [product, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type! Please upload a JPG or PNG image.");
      return;
    }

    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("manufacturingDate", data.manufacturingDate);
    if (image) {
      formData.append("image", image);
    }

    dispatch(updateProduct({ productId, formData }))
    .unwrap()
    .then(() => {
      alert("Product updated successfully!");
      navigate("/dashboard");
    })
    .catch((err) => console.error("Update failed:", err));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        <p>Product not found!</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">
          Edit Product
        </h2>

        {successMessage && <p className="text-green-600 text-center mb-3">{successMessage}</p>}
        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Name</label>
            <input
              {...register("name", { required: "Name is required", minLength: 3 })}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Product Name"
              disabled={loading}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1">Price</label>
              <input
                {...register("price", {
                  required: "Price is required",
                  min: { value: 1, message: "Price must be a positive number" },
                })}
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                placeholder="Product Price"
                disabled={loading}
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">Stock</label>
              <input
                {...register("stock", {
                  required: "Stock is required",
                  min: { value: 1, message: "Stock must be at least 1" },
                })}
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                placeholder="Available Stock"
                disabled={loading}
              />
              {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Description</label>
            <textarea
              {...register("description", { required: "Description is required", minLength: 10 })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Product Description"
              rows="3"
              disabled={loading}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          {/* Category & Manufacturing Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1">Category</label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                disabled={loading}
              >
                <option value="">Select a Category</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Diamond">Diamond</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">Manufacturing Date</label>
              <input
                {...register("manufacturingDate", {
                  required: "Manufacturing date is required",
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    return selectedDate <= today || "Manufacturing date cannot be in the future";
                  },
                })}
                type="date"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                disabled={loading}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Upload Image</label>
            {previewImage && <img src={previewImage} alt="Preview" className="w-40 h-40 object-cover rounded-md border mb-2" />}
            <input type="file" onChange={handleImageChange} disabled={loading} className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold transition duration-300">
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
