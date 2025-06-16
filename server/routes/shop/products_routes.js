const express = require('express')

const {getFilteredProducts, getProductDetailes } = require("../../controllers/shop/products_controller")

const router =  express.Router();

router.get('/get', getFilteredProducts)
router.get('/get/:id', getProductDetailes)

module.exports = router;
