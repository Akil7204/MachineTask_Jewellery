import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../redux/productSlice";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.products);
  const [successMessage, setSuccessMessage] = useState(""); // Success Message State

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type! Please upload a JPG or PNG image.");
        return;
      }

      setImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Generate preview URL
    }
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
    } else {
      alert("Please upload an image!"); // Ensure image is required
      return;
    }

    dispatch(addProduct(formData))
      .unwrap()
      .then(() => {
        setSuccessMessage("Product added successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/dashboard");
        }, 2000); // Redirect after 2 seconds
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">
          Add New Product
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
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message || "Minimum 3 characters required"}</p>}
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
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message || "At least 10 characters required"}</p>}
          </div>

          {/* Category & Manufacturing Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1">Category</label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
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
              />
              {errors.manufacturingDate && <p className="text-red-500 text-sm">{errors.manufacturingDate.message}</p>}
            </div>
          </div>

          {/* Image Upload & Preview */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Upload Image</label>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-md border mb-2"
              />
            )}
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              onChange={handleImageChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition duration-300"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
