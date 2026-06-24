const Aposta = require('../models/Aposta');
const Jogo = require('../models/Jogo');

exports.criar = async (req, res) => {
  try {
    const { jogo: jogoId, palpiteGolsCasa, palpiteGolsFora } = req.body;

    if (palpiteGolsCasa === undefined || palpiteGolsFora === undefined) {
      return res.status(400).json({ mensagem: 'É necessário informar o palpite de gols para os dois times' });
    }

    const jogo = await Jogo.findById(jogoId);
    if (!jogo) {
      return res.status(404).json({ mensagem: 'Jogo não encontrado' });
    }

    if (jogo.status !== 'agendado' || new Date(jogo.dataHora) <= new Date()) {
      return res.status(400).json({ mensagem: 'Não é possível apostar em um jogo que já começou ou foi finalizado' });
    }

    const apostaExistente = await Aposta.findOne({ usuario: req.usuario.id, jogo: jogoId });
    if (apostaExistente) {
      return res.status(409).json({ mensagem: 'Você já registrou uma aposta para este jogo' });
    }

    const aposta = await Aposta.create({
      usuario: req.usuario.id,
      jogo: jogoId,
      palpiteGolsCasa,
      palpiteGolsFora
    });

    return res.status(201).json({ mensagem: 'Aposta registrada com sucesso', aposta });
  } catch (erro) {
    return res.status(400).json({ mensagem: 'Erro ao registrar aposta', erro: erro.message });
  }
};

exports.listarMinhas = async (req, res) => {
  try {
    const apostas = await Aposta.find({ usuario: req.usuario.id })
      .populate({
        path: 'jogo',
        populate: [
          { path: 'timeCasa', select: 'nome sigla bandeiraUrl' },
          { path: 'timeFora', select: 'nome sigla bandeiraUrl' }
        ]
      })
      .sort({ createdAt: -1 });

    return res.json(apostas);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao listar histórico de apostas', erro: erro.message });
  }
};

exports.listarTodas = async (req, res) => {
  try {
    const apostas = await Aposta.find()
      .populate('usuario', 'nome email')
      .populate({
        path: 'jogo',
        populate: [
          { path: 'timeCasa', select: 'nome sigla' },
          { path: 'timeFora', select: 'nome sigla' }
        ]
      })
      .sort({ createdAt: -1 });

    return res.json(apostas);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao listar apostas', erro: erro.message });
  }
};

exports.obterPorId = async (req, res) => {
  try {
    const aposta = await Aposta.findById(req.params.id).populate('jogo').populate('usuario', 'nome email');
    if (!aposta) {
      return res.status(404).json({ mensagem: 'Aposta não encontrada' });
    }

    const ehDoProprioUsuario = aposta.usuario._id.toString() === req.usuario.id;
    if (!ehDoProprioUsuario && req.usuario.papel !== 'admin') {
      return res.status(403).json({ mensagem: 'Você não tem permissão para acessar esta aposta' });
    }

    return res.json(aposta);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao buscar aposta', erro: erro.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { palpiteGolsCasa, palpiteGolsFora } = req.body;

    const aposta = await Aposta.findById(req.params.id).populate('jogo');
    if (!aposta) {
      return res.status(404).json({ mensagem: 'Aposta não encontrada' });
    }

    if (aposta.usuario.toString() !== req.usuario.id) {
      return res.status(403).json({ mensagem: 'Você não tem permissão para alterar esta aposta' });
    }

    if (aposta.jogo.status !== 'agendado' || new Date(aposta.jogo.dataHora) <= new Date()) {
      return res.status(400).json({ mensagem: 'Não é possível alterar a aposta de um jogo que já começou' });
    }

    aposta.palpiteGolsCasa = palpiteGolsCasa ?? aposta.palpiteGolsCasa;
    aposta.palpiteGolsFora = palpiteGolsFora ?? aposta.palpiteGolsFora;
    await aposta.save();

    return res.json({ mensagem: 'Aposta atualizada com sucesso', aposta });
  } catch (erro) {
    return res.status(400).json({ mensagem: 'Erro ao atualizar aposta', erro: erro.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const aposta = await Aposta.findById(req.params.id).populate('jogo');
    if (!aposta) {
      return res.status(404).json({ mensagem: 'Aposta não encontrada' });
    }

    const ehDoProprioUsuario = aposta.usuario.toString() === req.usuario.id;
    if (!ehDoProprioUsuario && req.usuario.papel !== 'admin') {
      return res.status(403).json({ mensagem: 'Você não tem permissão para remover esta aposta' });
    }

    await Aposta.findByIdAndDelete(req.params.id);
    return res.json({ mensagem: 'Aposta removida com sucesso' });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao remover aposta', erro: erro.message });
  }
};
