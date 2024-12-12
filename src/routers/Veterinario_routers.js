import {Router} from 'express';
import { comprobarTokenPassword, confirmEmail, login, nuevoPassword, perfilUsuario, recuperarPassword, registro, updatePerfil } from '../controllers/Veterinario_controller.js';
import { verificarAutenticacion } from '../helpers/crearJWT.js';

const router = Router();

//Rutas Públicas
router.post('/registro', registro);
router.get('/confirmar/:token', confirmEmail);
router.post('/login', login);
router.post('/recuperar-password', recuperarPassword);
router.get('/recuperar-password/:token', comprobarTokenPassword);
router.post('/nuevo-password/:token', nuevoPassword);
//Rutas Privdas
router.get('/perfilvet', verificarAutenticacion, perfilUsuario);
router.put('/actualizar-perfilvet/:id', verificarAutenticacion, updatePerfil);

export default router;