const userRoutes = require("./user.routes");
const dayPlanRoutes = require("./dayPlan.routes");

module.exports = (app) => {
  app.use("/user", userRoutes);
  app.use("/day-plans", dayPlanRoutes);
};
