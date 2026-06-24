require('dotenv').config();
const mongoose = require('mongoose');
const conectarBancoDados = require('../config/db');

const Usuario = require('../models/Usuario');
const Time = require('../models/Time');
const Jogo = require('../models/Jogo');
const Aposta = require('../models/Aposta');

const times = [
  { nome: 'Brasil', sigla: 'BRA', grupo: 'A', confederacao: 'CONMEBOL' },
  { nome: 'Sérvia', sigla: 'SRB', grupo: 'A', confederacao: 'UEFA' },
  { nome: 'Suíça', sigla: 'SUI', grupo: 'A', confederacao: 'UEFA' },
  { nome: 'Camarões', sigla: 'CMR', grupo: 'A', confederacao: 'CAF' },
  { nome: 'Argentina', sigla: 'ARG', grupo: 'B', confederacao: 'CONMEBOL' },
  { nome: 'México', sigla: 'MEX', grupo: 'B', confederacao: 'CONCACAF' },
  { nome: 'Polônia', sigla: 'POL', grupo: 'B', confederacao: 'UEFA' },
  { nome: 'Arábia Saudita', sigla: 'KSA', grupo: 'B', confederacao: 'AFC' },
  { nome: 'França', sigla: 'FRA', grupo: 'C', confederacao: 'UEFA' },
  { nome: 'Dinamarca', sigla: 'DEN', grupo: 'C', confederacao: 'UEFA' },
  { nome: 'Tunísia', sigla: 'TUN', grupo: 'C', confederacao: 'CAF' },
  { nome: 'Austrália', sigla: 'AUS', grupo: 'C', confederacao: 'AFC' },
  { nome: 'Espanha', sigla: 'ESP', grupo: 'D', confederacao: 'UEFA' },
  { nome: 'Alemanha', sigla: 'GER', grupo: 'D', confederacao: 'UEFA' },
  { nome: 'Japão', sigla: 'JPN', grupo: 'D', confederacao: 'AFC' },
  { nome: 'Costa Rica', sigla: 'CRC', grupo: 'D', confederacao: 'CONCACAF' },
  { nome: 'Bélgica', sigla: 'BEL', grupo: 'E', confederacao: 'UEFA' },
  { nome: 'Canadá', sigla: 'CAN', grupo: 'E', confederacao: 'CONCACAF' },
  { nome: 'Marrocos', sigla: 'MAR', grupo: 'E', confederacao: 'CAF' },
  { nome: 'Croácia', sigla: 'CRO', grupo: 'E', confederacao: 'UEFA' },
  { nome: 'Portugal', sigla: 'POR', grupo: 'F', confederacao: 'UEFA' },
  { nome: 'Gana', sigla: 'GHA', grupo: 'F', confederacao: 'CAF' },
  { nome: 'Uruguai', sigla: 'URU', grupo: 'F', confederacao: 'CONMEBOL' },
  { nome: 'Coreia do Sul', sigla: 'KOR', grupo: 'F', confederacao: 'AFC' },
  { nome: 'Inglaterra', sigla: 'ENG', grupo: 'G', confederacao: 'UEFA' },
  { nome: 'Irã', sigla: 'IRN', grupo: 'G', confederacao: 'AFC' },
  { nome: 'Estados Unidos', sigla: 'USA', grupo: 'G', confederacao: 'CONCACAF' },
  { nome: 'País de Gales', sigla: 'WAL', grupo: 'G', confederacao: 'UEFA' },
  { nome: 'Holanda', sigla: 'NED', grupo: 'H', confederacao: 'UEFA' },
  { nome: 'Senegal', sigla: 'SEN', grupo: 'H', confederacao: 'CAF' },
  { nome: 'Equador', sigla: 'ECU', grupo: 'H', confederacao: 'CONMEBOL' },
  { nome: 'Catar', sigla: 'QAT', grupo: 'H', confederacao: 'AFC' }
];

async function executarSeed() {
  await conectarBancoDados();

  console.log('Limpando coleções existentes...');
  await Promise.all([
    Usuario.deleteMany({}),
    Time.deleteMany({}),
    Jogo.deleteMany({}),
    Aposta.deleteMany({})
  ]);

  console.log('Inserindo usuários de exemplo...');
  const admin = await Usuario.create({
    nome: 'Administrador',
    email: 'admin@apostascopa.com',
    senha: 'admin123',
    papel: 'admin'
  });

  const usuarioTeste = await Usuario.create({
    nome: 'Usuário Teste',
    email: 'usuario@apostascopa.com',
    senha: 'usuario123',
    papel: 'usuario'
  });

  console.log('Inserindo times...');
  const timesInseridos = await Time.insertMany(times);

  const encontrarTime = (sigla) => timesInseridos.find((t) => t.sigla === sigla);

  console.log('Inserindo jogos de exemplo...');
  const jogos = await Jogo.insertMany([
    {
      timeCasa: encontrarTime('BRA')._id,
      timeFora: encontrarTime('SRB')._id,
      dataHora: new Date('2026-06-24T16:00:00Z'),
      fase: 'grupos',
      estadio: 'Estádio Nacional',
      status: 'agendado'
    },
    {
      timeCasa: encontrarTime('ARG')._id,
      timeFora: encontrarTime('MEX')._id,
      dataHora: new Date('2026-06-25T19:00:00Z'),
      fase: 'grupos',
      estadio: 'Arena Central',
      status: 'agendado'
    },
    {
      timeCasa: encontrarTime('FRA')._id,
      timeFora: encontrarTime('DEN')._id,
      dataHora: new Date('2026-06-22T13:00:00Z'),
      fase: 'grupos',
      estadio: 'Estádio Internacional',
      golsCasa: 2,
      golsFora: 1,
      status: 'finalizado'
    },
    {
      timeCasa: encontrarTime('ESP')._id,
      timeFora: encontrarTime('GER')._id,
      dataHora: new Date('2026-06-26T16:00:00Z'),
      fase: 'grupos',
      estadio: 'Estádio Nacional',
      status: 'agendado'
    }
  ]);

  console.log('Inserindo aposta de exemplo...');
  await Aposta.create({
    usuario: usuarioTeste._id,
    jogo: jogos[2]._id,
    palpiteGolsCasa: 2,
    palpiteGolsFora: 1
  });

  console.log('\nSeed concluído com sucesso!');
  console.log(`Admin: ${admin.email} / senha: admin123`);
  console.log(`Usuário: ${usuarioTeste.email} / senha: usuario123`);

  await mongoose.disconnect();
  process.exit(0);
}

executarSeed().catch((erro) => {
  console.error('Erro ao executar o seed:', erro);
  process.exit(1);
});
