const express = require("express");

const {SearchProducts} = require("../../controllers/shop/search_controller");

const router = express.Router();

router.get("/:keyword", SearchProducts);

module.exports = router;