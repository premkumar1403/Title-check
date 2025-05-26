const ratelimit = require("express-rate-limit");

const limiter = ratelimit({
  windowMs: 1 * 60 * 1000, //One minute
  max: 60,
  message: "Server taking too many requests please wait",
});

module.exports = limiter;