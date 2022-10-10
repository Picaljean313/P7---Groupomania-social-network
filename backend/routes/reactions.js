const express = require ('express');
const router = express.Router();
const reactionsCtrl = require('../controllers/reactions');
const authFonctions = require('../middleware/auth');

router.post('/', authFonctions.classicAuth, reactionsCtrl.createOneReaction);
router.get('/', authFonctions.classicAuth, reactionsCtrl.getAllReactions);
router.delete('/', authFonctions.adminAuth, reactionsCtrl.deleteAllReactions);
router.get('/:reactionId', authFonctions.classicAuth, reactionsCtrl.getOneReaction);
router.put('/:reactionId', authFonctions.classicAuth, reactionsCtrl.modifyOneReaction);
router.delete('/:reactionId', authFonctions.classicAuth, reactionsCtrl.deleteOneReaction);

module.exports = router;