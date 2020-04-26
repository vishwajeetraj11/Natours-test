const Tour = require('./../Models/tourModel');
const User = require('./../Models/userModel');
const Booking = require('./../Models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1. get the data, for the requested tour including reviews and guides
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    next(new AppError('There is no tour with that name'), 404);
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.login = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your Account'
  });
});

exports.signup = catchAsync(async (req, res) => {
  res.status(200).render('signup', {
    title: 'Create an Account'
  });
});

exports.accountPage = catchAsync(async (req, res) => {
  res.status(200).render('accountpage', {
    title: 'Your Account'
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true, // get the new updated data
      runValidators: true
    }
  );

  res.status(200).render('accountpage', {
    title: 'Your Account',
    user: updatedUser
  });
});

exports.getMyTours = catchAsync(async(req, res, next) => {
    // 1. Find all bookings
    const bookings = await Booking.find({ user: req.user.id });
  
    // 2. Find tours with the returned IDs.
    const tourIDs = bookings.map(el => el.tour);
  
    const tours = await Tour.find({ _id: { $in: tourIDs }});

    res.status(200).render('overview', {
      title: 'My Tours',
      tours
    });
});