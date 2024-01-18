import { Router, Request, Response } from 'express';
import { CardModel, ICard } from '../models/card';

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

    const cards: ICard[] = await CardModel.find({ cardName: characterName }).exec();

    return res.json(cards);
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
cardRoutes.post('/create', async (req: Request, res: Response) => {
  try {
    const { cardName, characterName, cardDescription, youtubeLink, punisherData, moveFlowChartData, userId } = req.body;

    // Extract userId from the decoded token if needed
    // const userId = req.user._id;

    const newCard = await CardModel.create({
      cardName,
      characterName,
      cardDescription,
      youtubeLink,
      userId, 
      punisherData,
      moveFlowChartData,
    });


    return res.status(201).json(newCard);
  } catch (error) {
    console.error('Error creating new card:', error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

// Route to edit an existing card
cardRoutes.put('/edit/:cardId', async (req: Request, res: Response) => {
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

export default cardRoutes;
