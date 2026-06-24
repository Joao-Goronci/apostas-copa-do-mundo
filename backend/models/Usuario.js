const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome é obrigatório'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'O e-mail é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true
    },
    senha: {
      type: String,
      required: [true, 'A senha é obrigatória'],
      minlength: 6,
      select: false
    },
    papel: {
      type: String,
      enum: ['usuario', 'admin'],
      default: 'usuario'
    },
    pontuacaoTotal: {
      type: Number,
      default: 0
    },
    ativo: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true, collection: 'usuarios' }
);

usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

usuarioSchema.methods.compararSenha = function (senhaInformada) {
  return bcrypt.compare(senhaInformada, this.senha);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
