import { Router, Request, Response } from 'express';
import { CardModel, ICard } from '../models/card';
import verifyToken from '../middlewares/authMiddleware'; // Adjust the path as per your project structure


const cardRoutes = Router();

cardRoutes.get('/all', async (_req: Request, res: Response) => {
  try {
    const cards: ICard[] = await CardModel.find().exec();
    return res.json(cards);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

// Route to get cards by character name
cardRoutes.get('/character/:characterName', async (req: Request, res: Response) => {
  try {
    const characterName = req.params.characterName;

    const cards: ICard[] = await CardModel.find({ characterName: { $regex: new RegExp(characterName, 'i') } }).exec();

    return res.json(cards);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

// Route to get a card by ID
cardRoutes.get('/id/:cardId', async (req: Request, res: Response) => {
  try {
    const cardId = req.params.cardId;

    const card: ICard | null = await CardModel.findById(cardId).exec();

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    return res.json(card);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

// Route to get cards by user ID
cardRoutes.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const cards: ICard[] = await CardModel.find({ userId }).exec();

    return res.json(cards);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

// Route to create a new card
cardRoutes.post('/create', verifyToken, async (req: Request, res: Response) => {
  try {
    const { cardName, characterName, cardDescription, youtubeLink, punisherData, moveFlowChartData, userId, username } = req.body;

    const newCard = await CardModel.create({
      cardName,
      characterName,
      cardDescription,
      youtubeLink,
      userId, 
      username,
      punisherData,
      moveFlowChartData,
    });

    return res.status(201).json(newCard);
  } catch (error) {
    // Log the error to the console
    console.error('Error creating new card:', error);

    // Send an error response to the client
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

// Route to edit an existing card
cardRoutes.put('/edit/:cardId', verifyToken, async (req: Request, res: Response) => {
  try {
    const cardId = req.params.cardId;
    const { cardName, cardDescription, youtubeLink, punisherData, moveFlowChartData, userId } = req.body;

    const updatedCard = await CardModel.findByIdAndUpdate(
      cardId,
      {
        cardName,
        cardDescription,
        youtubeLink,
        punisherData,
        moveFlowChartData,
        userId
      },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ error: 'Card not found' });
    }

    return res.json(updatedCard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

// Route to add or update a rating for a card
cardRoutes.post('/rate/:cardId', verifyToken, async (req: Request, res: Response) => {
  try {
    const cardId = req.params.cardId;
    const { userId, rating } = req.body;

    // Find the card
    const card: ICard | null = await CardModel.findById(cardId).exec();

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Check if the user has already rated the card
    const existingRating = card.ratings.find((r) => r.userId === userId);

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = rating;
    } else {
      // Add a new rating
      card.ratings.push({ userId, rating });
    }

    // Save the updated card
    const updatedCard = await card.save();

    return res.json(updatedCard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});


export default cardRoutes;
