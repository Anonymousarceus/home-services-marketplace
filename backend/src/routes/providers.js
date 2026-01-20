const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');

router.get('/', providerController.getAllProviders);
router.get('/:id', providerController.getProviderById);
router.patch('/:id/availability', providerController.updateAvailability);

module.exports = router;
