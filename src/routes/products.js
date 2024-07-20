const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/:category/products', productController.getTopProducts);
router.get('/:category/products/:productId', productController.getProductDetails);

module.exports = router;
