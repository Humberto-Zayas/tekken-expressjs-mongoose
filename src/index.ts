import "./lib/db";
import express from "express";
import countryRoutes from "./routes/country";
import userRoutes from "./routes/user"; // Import the user routes
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

app.get("/", async (req, res) => {
  res.json({ message: "Please visit /countries to view all the countries" });
});

app.use("/countries", countryRoutes);

// Use the user routes under the base path "/users"
app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
