import { model, Schema, Document } from "mongoose";

interface ICard extends Document {
  cardName: string;
  cardDescription: string;
  youtubeLink?: string;
  userId: string;
  punisherData: Array<{
    move: string;
    description: string;
    hitLevel?: string;
    damage?: string;
    startUpFrame?: string;
    blockFrame?: string;
    hitFrame?: string;
    counterHitFrame?: string;
    notes?: string;
  }>;
  moveFlowChartData: Array<{
    move: string;
    description: string;
    hitLevel?: string;
    damage?: string;
    startUpFrame?: string;
    blockFrame?: string;
    hitFrame?: string;
    counterHitFrame?: string;
    notes?: string;
  }>;
}

const CardSchema = new Schema<ICard>({
  cardName: {
    type: String,
    required: true,
  },
  cardDescription: {
    type: String,
    required: true,
  },
  youtubeLink: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  punisherData: [
    {
      move: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      hitLevel: {
        type: String,
      },
      damage: {
        type: String,
      },
      startUpFrame: {
        type: String,
      },
      blockFrame: {
        type: String,
      },
      hitFrame: {
        type: String,
      },
      counterHitFrame: {
        type: String,
      },
      notes: {
        type: String,
      },
    },
  ],
  moveFlowChartData: [
    {
      move: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      hitLevel: {
        type: String,
      },
      damage: {
        type: String,
      },
      startUpFrame: {
        type: String,
      },
      blockFrame: {
        type: String,
      },
      hitFrame: {
        type: String,
      },
      counterHitFrame: {
        type: String,
      },
      notes: {
        type: String,
      },
    },
  ],
});

const CardModel = model<ICard>("Card", CardSchema);

export { CardModel, ICard };
