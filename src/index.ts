import "./lib/db";
import express from "express";
import countryRoutes from "./routes/country";
import userRoutes from "./routes/user";
import cardRoutes from "./routes/cards";
import cors from "cors";

require('dotenv').config();

const app = express();

const port = process.env.PORT || 3333;

app.use(cors())
app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

app.get("/", async (req, res) => {
  res.json({ message: "Please visit /countries to view all the countries" });
});

app.use("/countries", countryRoutes);
app.use("/users", userRoutes);
app.use("/cards", cardRoutes); // Use the card routes under the base path "/cards"

// Middleware for handling errors
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
