const express = require ('express');
const router = express.Router();
const reportsCtrl = require('../controllers/reports');
const authFonctions = require('../middleware/auth');

router.post('/', authFonctions.classicAuth, reportsCtrl.createOneReport);
router.get('/', authFonctions.classicAuth, reportsCtrl.getAllReports);
router.delete('/', authFonctions.adminAuth, reportsCtrl.deleteAllReports);
router.get('/:reportId', authFonctions.adminAuth, reportsCtrl.getOneReport);
router.delete('/:reportId', authFonctions.classicAuth, reportsCtrl.deleteOneReport);

module.exports = router;