const express = require ('express');
const router = express.Router();
const commentsCtrl = require('../controllers/comments');
const authFonctions = require('../middleware/auth');

router.post('/', authFonctions.classicAuth, commentsCtrl.createOneComment);
router.get('/', authFonctions.classicAuth, commentsCtrl.getAllComments);
router.delete('/', authFonctions.adminAuth, commentsCtrl.deleteAllComments);
router.get('/:commentId', authFonctions.classicAuth, commentsCtrl.getOneComment);
router.put('/:commentId', authFonctions.classicAuth, commentsCtrl.modifyOneComment);
router.delete('/:commentId', authFonctions.classicAuth, commentsCtrl.deleteOneComment);

module.exports = router;
