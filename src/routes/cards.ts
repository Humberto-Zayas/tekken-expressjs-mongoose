import { Router, Request, Response } from 'express';
import { CardModel, ICard } from '../models/card';
import verifyToken from '../middlewares/authMiddleware';

const cardRoutes = Router();

// Route to get cards by character name
cardRoutes.get('/character/:characterName', async (req: Request, res: Response) => {
  try {
    const characterName = req.params.characterName;

    const cards: ICard[] = await CardModel.find({ cardName: characterName }).exec();

    return res.json(cards);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

// Route to get cards by user ID
cardRoutes.get('/user/:userId', verifyToken, async (req: any, res: Response) => {
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
cardRoutes.post('/create', verifyToken, async (req: any, res: Response) => {
  try {
    const { cardName, cardDescription, youtubeLink, punisherData, moveFlowChartData } = req.body;

    // Extract userId from the decoded token
    const userId = req.user._id;

    const newCard = await CardModel.create({
      cardName,
      cardDescription,
      youtubeLink,
      userId,
      punisherData,
      moveFlowChartData,
    });

    return res.status(201).json(newCard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

// Route to edit an existing card
cardRoutes.put('/edit/:cardId', verifyToken, async (req: any, res: Response) => {
  try {
    const cardId = req.params.cardId;
    const { cardName, cardDescription, youtubeLink, punisherData, moveFlowChartData } = req.body;

    const updatedCard = await CardModel.findByIdAndUpdate(
      cardId,
      {
        cardName,
        cardDescription,
        youtubeLink,
        punisherData,
        moveFlowChartData,
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

export default cardRoutes;
