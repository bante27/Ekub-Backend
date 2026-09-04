const express = require('express');
const router = express.Router();

// 1. Import all controller functions once
const { 
  createGroup, 
  joinGroup, 
  getGroupDetails, 
  getMyGroups,
  getWinnerHistory,    
  getMyWinningHistory  
} = require('../controllers/groupController');

// 2. Middlewares
const { protect } = require('../middlewares/authMiddleware');
const { isVerified } = require('../middlewares/isVerified'); 

// --- ROUTES ---

// 1. Create Group: User must be logged in AND KYC Verified
router.post('/create', protect, isVerified, createGroup);

// 2. Join Group: User must be logged in AND KYC Verified
router.post('/join', protect, isVerified, joinGroup);

// 3. View My Groups
router.get('/my-ekubs', protect, getMyGroups);

// 4. Personal Winning History (Must precede generic dynamic routes)

router.get('/my-winning-history', protect, getMyWinningHistory);

// 5. Winner History for a specific group
router.get('/winner-history/:groupId', protect, getWinnerHistory);
// 6. View Details (Must be placed last because :id is a dynamic parameter)
router.get('/:id', protect, getGroupDetails);

module.exports = router;