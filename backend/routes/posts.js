const express = require ('express');
const router = express.Router();
const postsCtrl = require ('../controllers/posts');
const authFonctions = require('../middleware/auth');
const multer = require('../middleware/multer');

router.post('/', authFonctions.classicAuth, multer, postsCtrl.createOnePost);
router.get('/', authFonctions.classicAuth, postsCtrl.getAllPosts);
router.delete('/', authFonctions.adminAuth, postsCtrl.deleteAllPosts);
router.get('/:postId', authFonctions.classicAuth, postsCtrl.getOnePost);
router.put('/:postId', authFonctions.classicAuth, multer, postsCtrl.modifyOnePost);
router.delete('/:postId', authFonctions.classicAuth, postsCtrl.deleteOnePost);

module.exports = router;