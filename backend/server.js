const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./database");
const authRoutes = require("./routes/auth.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const itensRoutes = require("./routes/itens.routes");
const movimentacoesRoutes = require("./routes/movimentacoes.routes");

const app = express();

app.use(cors());
app.use(express.json());

initializeDatabase();

// Cada grupo de rotas aponta para um modulo de negocio especifico.
app.use(authRoutes);
app.use(usuariosRoutes);
app.use(itensRoutes);
app.use(movimentacoesRoutes);

// Erros lancados pelos services/controllers.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  res.status(err.status || 500).json({
    erro: err.status ? err.message : "Erro no servidor.",
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor do Offstock rodando na porta ${PORT}`);
});
