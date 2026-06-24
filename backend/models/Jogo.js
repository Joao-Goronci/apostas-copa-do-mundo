const mongoose = require('mongoose');

const jogoSchema = new mongoose.Schema(
  {
    timeCasa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Time',
      required: true
    },
    timeFora: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Time',
      required: true
    },
    dataHora: {
      type: Date,
      required: [true, 'A data e hora do jogo são obrigatórias']
    },
    fase: {
      type: String,
      enum: ['grupos', 'oitavas', 'quartas', 'semifinal', 'final', 'terceiro_lugar'],
      default: 'grupos'
    },
    estadio: {
      type: String,
      trim: true
    },
    golsCasa: {
      type: Number,
      default: null
    },
    golsFora: {
      type: Number,
      default: null
    },
    status: {
      type: String,
      enum: ['agendado', 'em_andamento', 'finalizado', 'cancelado'],
      default: 'agendado'
    }
  },
  { timestamps: true, collection: 'jogos' }
);

jogoSchema.index({ dataHora: 1 });

module.exports = mongoose.model('Jogo', jogoSchema);
