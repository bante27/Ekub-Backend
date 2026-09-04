const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');
const { isVerified } = require('../middlewares/isVerified');
const upload = require('../middlewares/upload');
const validate = require('../middlewares/validator');
const { submitManualPaymentSchema } = require('../validations/paymentValidation');

const { 
  submitManualPayment,
  getUserTransactions
} = require('../controllers/paymentController');

router.post(
  '/submit',
  protect,
  isVerified,
  upload.single('receiptImage'),
  validate(submitManualPaymentSchema),
  submitManualPayment
);

router.get(
  '/user-transactions',
  protect,
  getUserTransactions
);

module.exports = router;
