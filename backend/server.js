require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarBancoDados = require('./config/db');

const usuariosRoutes = require('./routes/usuarios');
const timesRoutes = require('./routes/times');
const jogosRoutes = require('./routes/jogos');
const apostasRoutes = require('./routes/apostas');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/saude', (req, res) => {
  res.json({ status: 'ok', mensagem: 'API de Apostas da Copa do Mundo no ar' });
});

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/times', timesRoutes);
app.use('/api/jogos', jogosRoutes);
app.use('/api/apostas', apostasRoutes);

// Tratamento de rota não encontrada
app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada' });
});

// Tratamento de erros genéricos
app.use((erro, req, res, next) => {
  console.error(erro);
  res.status(500).json({ mensagem: 'Erro interno do servidor', erro: erro.message });
});

const PORTA = process.env.PORT || 3000;

conectarBancoDados().then(() => {
  app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
  });
});

module.exports = app;
