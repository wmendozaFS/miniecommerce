const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { verifyToken } = require('../middleware/auth');


router.post('/create', categoryController.createCategory);
router.get('/list', categoryController.getCategories);
router.delete('/delete/:id', categoryController.deleteCategory);
router.put('/update/:id', categoryController.updateCategory);
router.get('/lista-ordenada', categoryController.listaOrdenadaCategory);
module.exports = router;