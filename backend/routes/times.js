const express = require('express');
const router = express.Router();
const timesController = require('../controllers/timesController');
const { autenticar, somenteAdmin } = require('../middleware/auth');

// Listagem é pública (necessária para a tela de jogos/apostas)
router.get('/', timesController.listar);
router.get('/:id', timesController.obterPorId);

// Apenas administradores podem gerenciar times
router.post('/', autenticar, somenteAdmin, timesController.criar);
router.put('/:id', autenticar, somenteAdmin, timesController.atualizar);
router.delete('/:id', autenticar, somenteAdmin, timesController.remover);

module.exports = router;
