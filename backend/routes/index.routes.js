const userRouter = require('./user.routes');
const placeRouter = require('./place.routes'); // Import route place vừa tạo

function route(app) {
  // Định nghĩa các prefix cho route

  app.use('/api/users', userRouter);
  app.use('/api/places', placeRouter);
}

module.exports = route;
