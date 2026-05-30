const express = require("express");
const itensController = require("../controllers/itens.controller");

const router = express.Router();

router.post("/itens", itensController.cadastrarItem);
router.get("/itens", itensController.listarItens);

module.exports = router;
