const express = require('express');
const router = express.Router();
const usersCtrl = require ('../controllers/users');
const authFonctions = require('../middleware/auth');
const multer = require('../middleware/multer');

router.post('/signup', multer, usersCtrl.signup);
router.post('/login', usersCtrl.login);
router.post('/logout', authFonctions.classicAuth, usersCtrl.logout);
router.post('/', authFonctions.adminAuth, multer, usersCtrl.createOneUser);
router.get('/', authFonctions.adminAuth, usersCtrl.getAllUsers);
router.delete('/', authFonctions.adminAuth, usersCtrl.deleteAllUsers);
router.get('/:userId', authFonctions.classicAuth, usersCtrl.getOneUser);
router.put('/:userId', authFonctions.classicAuth, multer, usersCtrl.modifyOneUser);
router.delete('/:userId', authFonctions.classicAuth, usersCtrl.deleteOneUser);

module.exports = router;