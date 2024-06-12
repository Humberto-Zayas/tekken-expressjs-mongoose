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

cardRoutes.get('/character/:characterName', async (req: Request, res: Response) => {
  try {
    const characterName = req.params.characterName;
    const tags = req.query.tags as string | undefined;
    const youtube = req.query.YouTube === 'true';
    const twitch = req.query.Twitch === 'true';
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = 10; // Number of items per page

    // Construct the query object
    const query: any = { characterName: { $regex: new RegExp(characterName, 'i') } };

    if (typeof tags === 'string') {
      const tagsArray = tags.split(','); // Split the tags string into an array
      query['tags.name'] = { $in: tagsArray }; // Filter cards where any tag name is in the provided tags array
    }

    if (youtube) {
      query.youtubeLink = { $exists: true, $ne: '' }; 
    }

    if (twitch) {
      query.twitchLink = { $exists: true, $ne: '' }; 
    }

    const totalCount = await CardModel.countDocuments(query).exec();

    // Fetch cards, apply pagination, and sort them by createdAt in ascending order
    const cards: ICard[] = await CardModel.find(query)
      .sort({ createdAt: -1 })  // Sorting by createdAt in ascending order
      .skip((page - 1) * limit) // Skip the specified number of documents based on the current page
      .limit(limit) // Limit the number of documents returned per page
      .exec();

    res.setHeader('X-Total-Count', totalCount.toString());

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
    const userId = req.query.userId as string; 
    console.log(userId)

    const card: ICard | null = await CardModel.findById(cardId).exec();

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Check if the user has liked or disliked any tags associated with the card
    const userReactions = card.tags.map((tag: { name: string; reactions: any[] }) => {
      // Use toggleTagReaction method on the schema level
      const cardSchema = CardModel.schema as any; // Cast to any to avoid TypeScript errors
      const tagReaction = cardSchema.methods.toggleTagReaction.call(card, userId, tag.name);
      return {
        tag: tag.name,
        liked: tagReaction === 'like',
        disliked: tagReaction === 'dislike',
      };
    });

    // Include user reactions in the response
    const cardWithReactions = { ...card.toObject(), userReactions };

    return res.json(cardWithReactions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

cardRoutes.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = 10; // Number of items per page

    // Construct the query object to filter cards by user ID
    const query: any = { userId };

    // Fetch total number of cards based on the user ID
    const totalCount = await CardModel.countDocuments(query).exec();

    // Fetch cards, apply pagination, and sort them by createdAt in ascending order
    const cards: ICard[] = await CardModel.find(query)
      .sort({ createdAt: -1 })  // Sorting by createdAt in ascending order
      .skip((page - 1) * limit) // Skip the specified number of documents based on the current page
      .limit(limit) // Limit the number of documents returned per page
      .exec();

    // Set the total count in the response headers
    res.setHeader('X-Total-Count', totalCount.toString());

    // Return the paginated cards
    return res.json(cards);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

// Route to create a new card
cardRoutes.post('/create', verifyToken, async (req: Request, res: Response) => {
  try {
    const { cardName, characterName, cardDescription, youtubeLink, punisherData, comboData, followUpData, moveFlowChartData, userId, username, tags } = req.body;

    const newCard = await CardModel.create({
      cardName,
      characterName,
      cardDescription,
      youtubeLink,
      userId, 
      username,
      punisherData,
      comboData,
      followUpData,
      moveFlowChartData,
      tags
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
    const { cardName, cardDescription, youtubeLink, punisherData, moveFlowChartData, followUpData, comboData, userId, tags } = req.body;

    const updatedCard = await CardModel.findByIdAndUpdate(
      cardId,
      {
        cardName,
        cardDescription,
        youtubeLink,
        punisherData,
        moveFlowChartData,
        followUpData,
        comboData,
        userId,
        tags,
        lastEditedAt: new Date(), // Update lastEditedAt field with current date/time
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

// Route to delete a card
cardRoutes.delete('/:cardId', verifyToken, async (req: Request, res: Response) => {
  try {
    const cardId = req.params.cardId;
    const { userId } = req.body;

    console.log(req.body)

    // Check if the card exists
    const cardToDelete = await CardModel.findById(cardId);

    if (!cardToDelete) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Check if the user has the right to delete the card (you can modify this based on your authentication logic)
    if (cardToDelete.userId !== userId) {
      return res.status(403).json({ error: 'You do not have permission to delete this card' });
    }

    // Delete the card
    await CardModel.findByIdAndDelete(cardId);

    return res.status(200).json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Error deleting card:', error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});


export default cardRoutes;
