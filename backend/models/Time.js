const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome do time é obrigatório'],
      trim: true
    },
    sigla: {
      type: String,
      required: [true, 'A sigla do time é obrigatória'],
      uppercase: true,
      trim: true,
      minlength: 2,
      maxlength: 3
    },
    bandeiraUrl: {
      type: String,
      default: ''
    },
    grupo: {
      type: String,
      trim: true,
      uppercase: true
    },
    confederacao: {
      type: String,
      trim: true
    }
  },
  { timestamps: true, collection: 'times' }
);

module.exports = mongoose.model('Time', timeSchema);
