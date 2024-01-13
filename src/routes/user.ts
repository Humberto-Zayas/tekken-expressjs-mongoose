import { Router } from "express";
import { UserModel, IUser } from "../models/user";
import { signToken } from "../utils/auth";

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

    // Sign a token for the newly created user
    const token = signToken({ username, email, _id: newUser._id });

    return res.status(201).json({ user: newUser, token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Route for user login
userRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user: IUser | null = await UserModel.findOne({ email }).exec();

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check for whitespace and compare using isCorrectPassword method
    const passwordMatch = await user.isCorrectPassword(password.trim());

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Sign a token on successful login
    const token = signToken({ username: user.username, email: user.email, _id: user._id });

    return res.json({ message: "Login successful", token, username: user.username });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

export default userRoutes;
