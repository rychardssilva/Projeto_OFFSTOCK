const express = require("express");
const authController = require("../controllers/auth.controller");
// 🛡️ PASSO 1: Importa o nosso controller novo e seguro
const usuariosController = require("../controllers/usuarios.controller");

const router = express.Router();

router.get("/check-setup", authController.checkSetup);
router.post("/setup", authController.setup);

// 🔒 PASSO 2: Mudamos aqui para usar o 'realizarLogin' que tem a trava de 3 erros!
router.post("/login", usuariosController.realizarLogin);

module.exports = router;