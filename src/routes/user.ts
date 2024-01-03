import { Router } from "express";
import { UserModel, IUser } from "../models/user";

const userRoutes = Router();

// Route to get a specific user by ID
userRoutes.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user: IUser | null = await UserModel.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Route for user signup
userRoutes.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await UserModel.findOne({ email }).exec();

    if (userExists) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    const newUser = await UserModel.create({
      username,
      email,
      password,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Route for user login
userRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Received credentials:', { email, password });

    const user: IUser | null = await UserModel.findOne({ email }).exec();
    console.log('User found:', user);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Logging intermediate values
    console.log('Raw Password:', password);
    console.log('Stored Password (DB):', user.password);

    // Check for whitespace and compare using isCorrectPassword method
    const passwordMatch = await user.isCorrectPassword(password.trim());
    console.log('Password match:', passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default userRoutes;
