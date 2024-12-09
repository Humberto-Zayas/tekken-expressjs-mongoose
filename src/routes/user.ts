import { Router } from "express";
import { UserModel, IUser } from "../models/user";
import { CardModel, ICard } from "../models/card";
import { signToken, verifyRefreshToken, signRefreshToken } from "../utils/auth";
import mongoose, { Types } from 'mongoose'; // Import mongoose and Types

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

userRoutes.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if a user with the provided email already exists
    const emailExists = await UserModel.findOne({ email }).exec();
    if (emailExists) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    // Check if a user with the provided username already exists
    const usernameExists = await UserModel.findOne({ username }).exec();
    if (usernameExists) {
      return res.status(409).json({ error: "Username is already taken" });
    }

    // If neither exists, create a new user
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

    const user = await UserModel.findOne({ email }).exec();

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

    // Sign tokens on successful login
    const token = signToken({
      username: user.username,
      email: user.email,
      _id: user._id,
      bookmarkedCardIds,
    });

    const refreshToken = signToken({
      username: user.username,
      email: user.email,
      _id: user._id,
      bookmarkedCardIds,
    }, { expiresIn: '7d' }); // Set appropriate expiration for refresh token

    return res.json({ token, refreshToken, username: user.username, userId: user._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

userRoutes.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const newToken = signToken(decoded.data);
    res.json({ token: newToken });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid refresh token' });
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
    const validCardId = mongoose.Types.ObjectId.createFromHexString(cardId);

    // Check if the card is already bookmarked
    if (user.bookmarks.map(b => b.toString()).includes(validCardId.toString())) {
      return res.status(400).json({ error: 'Card already bookmarked' });
    }

    // Convert validCardId to a string before pushing it to the array
    user.bookmarks.push(validCardId as unknown as mongoose.Schema.Types.ObjectId);
    await user.save();

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

// Route to unbookmark a card
userRoutes.delete('/:userId/unbookmark/:cardId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const cardId = req.params.cardId;

    const user: IUser | null = await UserModel.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Convert cardId to a valid ObjectId
    const validCardId = mongoose.Types.ObjectId.createFromHexString(cardId);

    // Check if the card is bookmarked
    const bookmarkIndex = user.bookmarks.findIndex(b => b.toString() === validCardId.toString());

    if (bookmarkIndex === -1) {
      return res.status(400).json({ error: 'Card not bookmarked' });
    }

    // Remove the card from the bookmarks array
    user.bookmarks.splice(bookmarkIndex, 1);
    await user.save();

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

userRoutes.get('/:userId/bookmarks', async (req, res) => {
  try {
    const userId = req.params.userId;
    const characterName = req.query.characterName;

    // Fetch the user with only the bookmarks' ObjectIds
    const user = await UserModel.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Populate the bookmarks manually using CardModel
    const populatedBookmarks = await CardModel.find({
      _id: { $in: user.bookmarks },
      ...(characterName && { characterName }), // Apply character name filter if provided
    }).exec();

    const bookmarksWithProperty = populatedBookmarks.map((bookmark) => ({
      ...bookmark.toObject(),
      bookmarked: true,
    }));

    return res.json({ bookmarks: bookmarksWithProperty });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});




export default userRoutes;
