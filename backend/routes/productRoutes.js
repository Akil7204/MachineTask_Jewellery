const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getStockSummary } = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/products', authMiddleware, upload.single('image'), createProduct);
router.get('/products', getProducts);
router.get('/:id', getProductById);
router.put("/products/:id", authMiddleware, upload.single("image"), updateProduct);
router.delete('/products/:id', authMiddleware, deleteProduct);
router.get('/stock-summary', authMiddleware, getStockSummary);





module.exports = router;
