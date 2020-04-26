const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
// const Bundler = require('parcel-bundler');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
const reviewRouter = require('./Routes/reviewRoutes');
const bookingRouter = require('./Routes/bookingRoutes');
const viewRouter = require('./Routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1. Global Middleware

// to get this inthe console : POST /api/v1/tours 201 126.424 ms - 167
// console.log(process.env.NODE_ENV);

// Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));
// Set Security HTTP headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from the same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many Requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
// Data sanitization against query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);


app.use(compression());
// Test  Middleware
app.use((req, res, next) => {
  // console.log(req.cookie);
  req.requestTime = new Date().toISOString();
  next();
});

// Single entrypoint file location:
// const entryFiles = path.join(__dirname, './public/js/index.js');
// OR: Multiple files with globbing (can also be .js)
// const entryFiles = './src/*.js';
// OR: Multiple files in an array
// const entryFiles = ['./src/index.html', './some/other/directory/scripts.js'];

// // Bundler options
// const options = {
//   outDir: './dist', // The out directory to put the build files in, defaults to dist
//   outFile: 'bundle.js', // The name of the outputFile
//   publicUrl: '/', // The url to serve on, defaults to '/'
//   watch: true // Whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
// };

// (async function() {
//   // Initializes a bundler using the entrypoint location and options provided
//   const bundler = new Bundler(entryFiles, options);

//   // Run the bundler, this returns the main bundle
//   // Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
//    await bundler.bundle();
// })();

// 2. Routes

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// all runs for all http methods
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on the server!`
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on the server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
