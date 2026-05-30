const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.get("/check-setup", authController.checkSetup);
router.post("/setup", authController.setup);
router.post("/login", authController.login);

module.exports = router;
