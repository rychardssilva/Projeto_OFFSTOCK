const express = require("express");
const usuariosController = require("../controllers/usuarios.controller");

const router = express.Router();

router.post("/cadastro", usuariosController.cadastrarOperador);
router.post("/cadastro-admin", usuariosController.cadastrarAdmin);
router.put("/usuarios/:id/primeira-senha", usuariosController.atualizarPrimeiraSenha);
router.get("/operadores", usuariosController.listarOperadores);

module.exports = router;
