const express = require('express');
const viewController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');
const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', bookingController.createBookingCheckout, authController.isLoggedIn, viewController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.login);
router.get('/signup', authController.isLoggedIn, viewController.signup);
router.get('/me', authController.protect, viewController.accountPage);
router.get('/my-tours', authController.protect, viewController.getMyTours);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
