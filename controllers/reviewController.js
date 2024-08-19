// controllers/reviewController.js
const Review = require('../models/reviewModel');

// Create a new review
exports.createReview = async (req, res) => {

    try {
        const { userId, rating, comment } = req.body;
        const review = new Review({ userId, rating, comment });
        await review.save();
        res.status(201).json({ message: 'Review created successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Error creating review', error });
    }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('userId', 'username'); // Assuming User model has a 'username' field
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
};

// Get a single review by ID
exports.getReviewById = async (req, res) => {

    console.log(req.params.id);
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching review', error });
    }
};

// Update a review
exports.updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { rating, comment },
            { new: true, runValidators: true }
        );
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Error updating review', error });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error });
    }
};
