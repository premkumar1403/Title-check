const ratelimit = require("express-rate-limit");

const limiter = ratelimit({
    windowms: 60 * 1000, //One minute
    max: 10,
    message:"Sever taking too many requests please wait"

});

module.exports = limiter;