const express = require("express");
const movimentacoesController = require("../controllers/movimentacoes.controller");

const router = express.Router();

router.get("/pendencias", movimentacoesController.listarPendencias);
router.put("/devolucao/:id", movimentacoesController.registrarDevolucao);
router.post("/retirada", movimentacoesController.registrarRetirada);
router.get("/historico", movimentacoesController.listarHistorico);

module.exports = router;
