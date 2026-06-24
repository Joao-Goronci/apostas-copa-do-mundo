const express = require('express');
const router = express.Router();
const jogosController = require('../controllers/jogosController');
const { autenticar, somenteAdmin } = require('../middleware/auth');

// Listagem é pública
router.get('/', jogosController.listar);
router.get('/:id', jogosController.obterPorId);

// Apenas administradores podem gerenciar jogos e resultados
router.post('/', autenticar, somenteAdmin, jogosController.criar);
router.put('/:id', autenticar, somenteAdmin, jogosController.atualizar);
router.put('/:id/resultado', autenticar, somenteAdmin, jogosController.registrarResultado);
router.delete('/:id', autenticar, somenteAdmin, jogosController.remover);

module.exports = router;
