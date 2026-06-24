const express = require('express');
const router = express.Router();
const apostasController = require('../controllers/apostasController');
const { autenticar, somenteAdmin } = require('../middleware/auth');

// Todas as rotas de apostas exigem autenticação
router.use(autenticar);

router.post('/', apostasController.criar);
router.get('/minhas', apostasController.listarMinhas);
router.get('/', somenteAdmin, apostasController.listarTodas);
router.get('/:id', apostasController.obterPorId);
router.put('/:id', apostasController.atualizar);
router.delete('/:id', apostasController.remover);

module.exports = router;
