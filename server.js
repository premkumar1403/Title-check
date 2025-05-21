const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerJSdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const limiter = require("./src/middleware/ratelimit.js");
const userRouter = require("./src/router/user.router");
const fileRouter = require("./src/router/file.router.js");
const MongoDB = require("./config/db.config.js");
const app = express();


app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
dotenv.config();
app.use(limiter);

const Port = process.env.PORT || 5000;
MongoDB();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "A simple Express API",
    },
    servers: [
      {
        url: `http://localhost:${Port}/api/v1/users`
      },
      {
        url: `http://localhost:${Port}/api/v1/file`
      }
    ],
  },
  apis: ["./src/router/*.js"],
};

const swaggerSpec = swaggerJSdoc(swaggerOptions);

app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/users", userRouter); //uesr route
app.use("/api/v1/file", fileRouter); //file route

app.listen(5000 || Port, () => {
  console.log("server running on port number", Port);
  console.log(`Swagger docs available at http://localhost:${Port}/api-docs`);
});
