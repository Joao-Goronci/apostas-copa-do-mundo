const Time = require('../models/Time');

exports.criar = async (req, res) => {
  try {
    const time = await Time.create(req.body);
    return res.status(201).json({ mensagem: 'Time cadastrado com sucesso', time });
  } catch (erro) {
    return res.status(400).json({ mensagem: 'Erro ao cadastrar time', erro: erro.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const times = await Time.find().sort({ nome: 1 });
    return res.json(times);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao listar times', erro: erro.message });
  }
};

exports.obterPorId = async (req, res) => {
  try {
    const time = await Time.findById(req.params.id);
    if (!time) {
      return res.status(404).json({ mensagem: 'Time não encontrado' });
    }
    return res.json(time);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao buscar time', erro: erro.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const time = await Time.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!time) {
      return res.status(404).json({ mensagem: 'Time não encontrado' });
    }
    return res.json({ mensagem: 'Time atualizado com sucesso', time });
  } catch (erro) {
    return res.status(400).json({ mensagem: 'Erro ao atualizar time', erro: erro.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const time = await Time.findByIdAndDelete(req.params.id);
    if (!time) {
      return res.status(404).json({ mensagem: 'Time não encontrado' });
    }
    return res.json({ mensagem: 'Time removido com sucesso' });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao remover time', erro: erro.message });
  }
};
