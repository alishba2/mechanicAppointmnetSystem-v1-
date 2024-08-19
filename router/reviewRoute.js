// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Route to create a new review
router.post('/addReview', reviewController.createReview);

// Route to get all reviews
router.get('/getReview', reviewController.getAllReviews);

// Route to get a single review by ID
router.get('getReview/:id', reviewController.getReviewById);

// Route to update a review
router.put('/:id', reviewController.updateReview);

// Route to delete a review
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
