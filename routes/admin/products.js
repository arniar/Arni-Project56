const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/products');

router.get('/', productController.getHomePage);
router.post('/table', productController.getProductsTable);
router.get('/addProduct', productController.getAddProductPage);
router.post('/addProduct', productController.addProduct);
router.get('/editProduct', productController.getEditProductPage);
router.post('/edit', productController.editProduct);
router.delete('/delete', productController.deleteProduct);
router.patch('/inactivate', productController.inactivateProduct);
router.patch('/activate', productController.activateProduct);

module.exports = router;