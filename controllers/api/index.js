const router = require('express').Router();
const pdfRoutes = require('./pdfRoutes');
router.use('/pdf', pdfRoutes);
module.exports = router;
