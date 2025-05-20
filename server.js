const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const color = require("colors");
const limiter=require("./src/middleware/ratelimit.js")
const userRouter = require("./src/router/user.router")
const fileRouter = require("./src/router/file.router.js")
const MongoDB = require("./config/db.config.js")
const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json())
dotenv.config();
app.use(limiter);

const Port = process.env.Port; 
MongoDB();

app.use("/api/v1/users", userRouter); //uesr route
app.use("/api/v1/file", fileRouter); //file route


app.listen(5000 || Port, () => {
    console.log("server running on port number".cyan, Port.cyan)
});