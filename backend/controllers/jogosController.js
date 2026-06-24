const Jogo = require('../models/Jogo');
const Aposta = require('../models/Aposta');
const Usuario = require('../models/Usuario');

exports.criar = async (req, res) => {
  try {
    const jogo = await Jogo.create(req.body);
    return res.status(201).json({ mensagem: 'Jogo cadastrado com sucesso', jogo });
  } catch (erro) {
    return res.status(400).json({ mensagem: 'Erro ao cadastrar jogo', erro: erro.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.fase) {
      filtro.fase = req.query.fase;
    }
    if (req.query.status) {
      filtro.status = req.query.status;
    }

    const jogos = await Jogo.find(filtro)
      .populate('timeCasa', 'nome sigla bandeiraUrl')
      .populate('timeFora', 'nome sigla bandeiraUrl')
      .sort({ dataHora: 1 });

    return res.json(jogos);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao listar jogos', erro: erro.message });
  }
};

exports.obterPorId = async (req, res) => {
  try {
    const jogo = await Jogo.findById(req.params.id)
      .populate('timeCasa', 'nome sigla bandeiraUrl')
      .populate('timeFora', 'nome sigla bandeiraUrl');

    if (!jogo) {
      return res.status(404).json({ mensagem: 'Jogo não encontrado' });
    }
    return res.json(jogo);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao buscar jogo', erro: erro.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const jogo = await Jogo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!jogo) {
      return res.status(404).json({ mensagem: 'Jogo não encontrado' });
    }
    return res.json({ mensagem: 'Jogo atualizado com sucesso', jogo });
  } catch (erro) {
    return res.status(400).json({ mensagem: 'Erro ao atualizar jogo', erro: erro.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const jogo = await Jogo.findByIdAndDelete(req.params.id);
    if (!jogo) {
      return res.status(404).json({ mensagem: 'Jogo não encontrado' });
    }
    return res.json({ mensagem: 'Jogo removido com sucesso' });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao remover jogo', erro: erro.message });
  }
};

function calcularResultado(golsCasa, golsFora) {
  if (golsCasa > golsFora) return 'casa';
  if (golsCasa < golsFora) return 'fora';
  return 'empate';
}

// Registra o placar final de um jogo e calcula a pontuação de todas as apostas relacionadas
exports.registrarResultado = async (req, res) => {
  try {
    const { golsCasa, golsFora } = req.body;

    if (golsCasa === undefined || golsFora === undefined) {
      return res.status(400).json({ mensagem: 'É necessário informar golsCasa e golsFora' });
    }

    const jogo = await Jogo.findByIdAndUpdate(
      req.params.id,
      { golsCasa, golsFora, status: 'finalizado' },
      { new: true, runValidators: true }
    );

    if (!jogo) {
      return res.status(404).json({ mensagem: 'Jogo não encontrado' });
    }

    const resultadoReal = calcularResultado(golsCasa, golsFora);
    const apostas = await Aposta.find({ jogo: jogo._id });

    for (const aposta of apostas) {
      const resultadoPalpite = calcularResultado(aposta.palpiteGolsCasa, aposta.palpiteGolsFora);

      let pontos = 0;
      let status = 'errou';

      if (aposta.palpiteGolsCasa === golsCasa && aposta.palpiteGolsFora === golsFora) {
        pontos = 3;
        status = 'acertou_placar';
      } else if (resultadoPalpite === resultadoReal) {
        pontos = 1;
        status = 'acertou_vencedor';
      }

      aposta.pontosGanhos = pontos;
      aposta.status = status;
      await aposta.save();

      if (pontos > 0) {
        await Usuario.findByIdAndUpdate(aposta.usuario, { $inc: { pontuacaoTotal: pontos } });
      }
    }

    return res.json({ mensagem: 'Resultado registrado e apostas calculadas com sucesso', jogo });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao registrar resultado', erro: erro.message });
  }
};
