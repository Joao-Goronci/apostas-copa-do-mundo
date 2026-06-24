const mongoose = require('mongoose');

async function conectarBancoDados() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/apostas_copa';

  try {
    await mongoose.connect(uri);
    console.log(`[MongoDB] Conectado com sucesso em: ${uri}`);
  } catch (erro) {
    console.error('[MongoDB] Erro ao conectar:', erro.message);
    process.exit(1);
  }
}

module.exports = conectarBancoDados;
