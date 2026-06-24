const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario._id, nome: usuario.nome, email: usuario.email, papel: usuario.papel },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

exports.registrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Nome, e-mail e senha são obrigatórios' });
    }

    const existente = await Usuario.findOne({ email: email.toLowerCase() });
    if (existente) {
      return res.status(409).json({ mensagem: 'Já existe um usuário cadastrado com este e-mail' });
    }

    const usuario = await Usuario.create({ nome, email, senha });
    const token = gerarToken(usuario);

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel
      }
    });
  } catch (erro) {
    return res.status(400).json({ mensagem: 'Erro ao cadastrar usuário', erro: erro.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios' });
    }

    const usuario = await Usuario.findOne({ email: email.toLowerCase() }).select('+senha');
    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const senhaValida = await usuario.compararSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const token = gerarToken(usuario);

    return res.json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel
      }
    });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao realizar login', erro: erro.message });
  }
};

exports.perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    return res.json(usuario);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao buscar perfil', erro: erro.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const usuarios = await Usuario.find().sort({ pontuacaoTotal: -1 });
    return res.json(usuarios);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao listar usuários', erro: erro.message });
  }
};

exports.obterPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    return res.json(usuario);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao buscar usuário', erro: erro.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { nome, papel, ativo } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nome, papel, ativo },
      { new: true, runValidators: true }
    );
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    return res.json({ mensagem: 'Usuário atualizado com sucesso', usuario });
  } catch (erro) {
    return res.status(400).json({ mensagem: 'Erro ao atualizar usuário', erro: erro.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    return res.json({ mensagem: 'Usuário removido com sucesso' });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao remover usuário', erro: erro.message });
  }
};
