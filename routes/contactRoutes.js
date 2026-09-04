const express = require('express');
const router = express.Router();
const { 
    submitContact, 
    getMessages, 
    deleteMessage, 
    replyMessage 
} = require('../controllers/contactController');

const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');
const validate = require('../middlewares/validator');
const { 
    contactSubmitSchema, 
    contactReplySchema 
} = require('../validations/contactValidation');

router.post('/', validate(contactSubmitSchema), submitContact);

router.get('/', protect, adminOnly, getMessages);

router.post('/reply', protect, adminOnly, validate(contactReplySchema), replyMessage);

router.delete('/:id', protect, adminOnly, deleteMessage);

module.exports = router;
