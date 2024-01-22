import { Router } from "express";
import { UserModel, IUser } from "../models/user";
import { signToken } from "../utils/auth";
import mongoose from 'mongoose';

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
    const token = signToken({ username, email, _id: newUser._id, bookmarkedCardIds: null });

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

    const bookmarkedCardIds = user.bookmarks
      ? user.bookmarks.map((id) => id.toString())
      : [];

    // Sign a token on successful login
    const token = signToken({
      username: user.username,
      email: user.email,
      _id: user._id,
      bookmarkedCardIds,
    });

    return res.json({ token, username: user.username, userId: user._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

// Route to bookmark a card
userRoutes.post('/:userId/bookmark/:cardId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const cardId = req.params.cardId;

    const user: IUser | null = await UserModel.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Convert cardId to a valid ObjectId
    const validCardId = new mongoose.Types.ObjectId(cardId);

    // Check if the card is already bookmarked
    if (user.bookmarks.map(b => b.toString()).includes(validCardId.toString())) {
      return res.status(400).json({ error: 'Card already bookmarked' });
    }

    // Add the card to the user's bookmarks
    user.bookmarks.push(new mongoose.Schema.Types.ObjectId(cardId));
    await user.save();    

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

// Route to get a user's bookmarks
userRoutes.get('/:userId/bookmarks', async (req, res) => {
  try {
    const userId = req.params.userId;

    const user: IUser | null = await UserModel.findById(userId)
      .populate('bookmarks') // Populate the bookmarks field with actual Card objects
      .exec();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ bookmarks: user.bookmarks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

export default userRoutes;
