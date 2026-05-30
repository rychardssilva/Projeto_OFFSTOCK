const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "offstock.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao abrir o banco:", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite.");
  }
});


function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// Garante que o banco local tenha a estrutura minima ao iniciar a API
function initializeDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                cpf TEXT UNIQUE NOT NULL,
                area_trabalho TEXT,
                idade INTEGER,
                email TEXT UNIQUE NOT NULL,
                celular TEXT,
                senha TEXT NOT NULL,
                perfil TEXT DEFAULT 'operador',
                troca_senha_obrigatoria BOOLEAN DEFAULT 0
            )`);

    db.all(`PRAGMA table_info(usuarios)`, [], (err, colunas) => {
      if (err) {
        return console.error(
          "Erro ao verificar colunas de usuarios:",
          err.message,
        );
      }

      const possuiTrocaObrigatoria = colunas.some(
        (coluna) => coluna.name === "troca_senha_obrigatoria",
      );

      if (!possuiTrocaObrigatoria) {
        db.run(
          `ALTER TABLE usuarios ADD COLUMN troca_senha_obrigatoria BOOLEAN DEFAULT 0`,
          () => {
            db.run(
              `UPDATE usuarios SET troca_senha_obrigatoria = 1 WHERE perfil = 'operador' AND senha = 'mudar123'`,
            );
          },
        );
      } else {
        db.run(
          `UPDATE usuarios SET troca_senha_obrigatoria = 1 WHERE perfil = 'operador' AND senha = 'mudar123' AND troca_senha_obrigatoria = 0`,
        );
      }
    });

    db.run(`CREATE TABLE IF NOT EXISTS itens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            quantidade INTEGER NOT NULL,
            retornavel BOOLEAN NOT NULL,
            localizacao TEXT NOT NULL
             )`);

    db.run(`CREATE TABLE IF NOT EXISTS movimentacoes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                item_id INTEGER,
                usuario_id INTEGER,
                quantidade_retirada INTEGER,
                data_retirada DATETIME DEFAULT CURRENT_TIMESTAMP,
                data_devolucao_prevista DATE,
                data_devolvido DATETIME,
                FOREIGN KEY(item_id) REFERENCES itens(id),
                FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
            )`);
  });
}

module.exports = {
  db,
  run,
  get,
  all,
  initializeDatabase,
};
