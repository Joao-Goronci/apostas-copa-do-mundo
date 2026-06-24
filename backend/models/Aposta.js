const mongoose = require('mongoose');

const apostaSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    jogo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Jogo',
      required: true
    },
    palpiteGolsCasa: {
      type: Number,
      required: [true, 'O palpite de gols do time da casa é obrigatório'],
      min: 0
    },
    palpiteGolsFora: {
      type: Number,
      required: [true, 'O palpite de gols do time visitante é obrigatório'],
      min: 0
    },
    pontosGanhos: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['pendente', 'acertou_placar', 'acertou_vencedor', 'errou'],
      default: 'pendente'
    }
  },
  { timestamps: true, collection: 'apostas' }
);

// Garante que o usuário só pode apostar uma vez em cada jogo
apostaSchema.index({ usuario: 1, jogo: 1 }, { unique: true });

module.exports = mongoose.model('Aposta', apostaSchema);
