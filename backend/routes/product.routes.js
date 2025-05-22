const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');

const { verifyToken, requireAdmin } = require('../middleware/auth');

// Rutas públicas
router.get('/', getAllProducts);

// Rutas protegidas
router.post('/', verifyToken, requireAdmin, createProduct);
router.put('/:id', verifyToken, requireAdmin, updateProduct);
router.delete('/:id', verifyToken, requireAdmin, deleteProduct);

module.exports = router;
