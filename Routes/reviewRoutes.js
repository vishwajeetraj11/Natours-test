const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });
// router.param('id', tourController.checkID);

router.use(authController.protect);
// POST /tour/23221/reviews => create a review on a particular tour
// GET /tour/23221/reviews => get all reviews related to a specific tour
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    reviewController.setTourUserIds,
    authController.RestrictTo('user'),
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.RestrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.RestrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
