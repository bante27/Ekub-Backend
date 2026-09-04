const express = require('express');
const router = express.Router();
const { updateProfile, submitKYC, getMe } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const validate = require('../middlewares/validator');
const { updateProfileSchema, submitKYCSchema } = require('../validations/userValidation');

router.get('/me', protect, getMe);

router.put('/update-profile', protect, validate(updateProfileSchema), updateProfile);

router.put('/submit-kyc', protect, upload.single('idImage'), validate(submitKYCSchema), submitKYC);

module.exports = router;
