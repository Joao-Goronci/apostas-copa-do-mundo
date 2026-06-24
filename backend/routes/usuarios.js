const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { autenticar, somenteAdmin } = require('../middleware/auth');

// Rotas públicas
router.post('/registrar', usuariosController.registrar);
router.post('/login', usuariosController.login);

// Rotas autenticadas
router.get('/perfil', autenticar, usuariosController.perfil);

// Rotas administrativas
router.get('/', autenticar, somenteAdmin, usuariosController.listar);
router.get('/:id', autenticar, somenteAdmin, usuariosController.obterPorId);
router.put('/:id', autenticar, somenteAdmin, usuariosController.atualizar);
router.delete('/:id', autenticar, somenteAdmin, usuariosController.remover);

module.exports = router;
