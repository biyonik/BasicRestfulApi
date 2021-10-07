const router = require('express').Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const adminMiddleware = require('../../middlewares/adminMiddleware');
const {deleteAllUsers, getAllUsers, getMe, updateMe, getById, add, login, update, deleteById} = require("../../controllers/userController");

/**
 *
 */
router.get('/', [authMiddleware, adminMiddleware], getAllUsers);

/**
 *
 */
router.get('/me', authMiddleware, getMe);

/**
 *
 */
router.patch('/me', authMiddleware, updateMe);

/**
 *
 */
router.get('/:id', [authMiddleware, adminMiddleware], getById);

/**
 *
 */
router.post('/', [authMiddleware, adminMiddleware], add);

/**
 *
 */
router.post('/login', login);

/**
 *
 */
router.patch('/:id', [authMiddleware, adminMiddleware], update);

/**
 *
 */
router.delete('/all', [authMiddleware, adminMiddleware], deleteAllUsers);

/**
 *
 */
router.delete('/:id', deleteById);


module.exports = router;
