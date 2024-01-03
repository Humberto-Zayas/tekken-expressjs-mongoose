import { Router } from "express";
import { UserModel, IUser } from "../models/user";
import bcrypt from "bcrypt";

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
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

    const user: IUser | null = await UserModel.findOne({ email }).exec();

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

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
