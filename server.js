//Express is a web application framework for Node.js, designed to simplify the process of building web applications and APIs.
const express = require("express");
const connectDB = require("./config/db");

const app = express();

//connect database
connectDB();

//get data in req.body
//parse incoming JSON data from HTTP requests.
app.use(express.json({extended: false})); //The express.json() middleware focuses on parsing JSON from the request body,

//When extended is set to false, the query string parsing uses the Node.js built-in querystring library

app.get("/", (req, res) => res.send("API Running"));

//Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/post", require("./routes/api/post"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
