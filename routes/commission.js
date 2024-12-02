const express = require("express");
const { getCommissions } = require("../controllers/commissionController");
const router = express.Router();
router.get("/", getCommissions);
module.exports = router;
