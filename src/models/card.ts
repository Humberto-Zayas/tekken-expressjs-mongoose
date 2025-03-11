import { model, Schema, Document } from "mongoose";
import { IMoveData } from '../interfaces/moveDataInterface';
import { IFlowChartData } from "../interfaces/flowChartData";
import { IComboData } from "../interfaces/comboData";

interface ICard extends Document {
  characterName: string;
  cardName: string;
  cardDescription: string;
  youtubeLink?: string;
  twitchLink?: string;
  userId: string;
  username: string;
  punisherData: IMoveData[];
  followUpData: IFlowChartData[];
  moveFlowChartData: IFlowChartData[];
  moveData: IMoveData[];
  comboData: IComboData[];
  ratings: {
    userId: string;
    rating: number;
  }[];
  tags: {
    name: string;
    reactions: {
      userId: string;
      type: 'like' | 'dislike';
    }[];
  }[];
  patchVersion: string[]; 
  createdAt: Date;
  lastEditedAt: Date | null;

  getAverageRating(): number;
}

const CardSchema = new Schema<ICard>({
  characterName: { type: String, required: true },
  cardName: { type: String, required: true },
  cardDescription: { type: String, required: true },
  twitchLink: { type: String },
  youtubeLink: { type: String },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  punisherData: [Schema.Types.Mixed],
  followUpData: [Schema.Types.Mixed],
  moveFlowChartData: [Schema.Types.Mixed],
  comboData: [Schema.Types.Mixed],
  moveData: [Schema.Types.Mixed],
  ratings: [{ userId: String, rating: Number }],
  tags: [
    {
      name: {
        type: String,
        required: true,
      },
      reactions: [
        {
          userId: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            enum: ['like', 'dislike'],
          },
        },
      ],
    },
  ],
  patchVersion: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  lastEditedAt: Date,
});

// Method to calculate average rating
CardSchema.methods.getAverageRating = function (): number {
  if (this.ratings.length === 0) return 0;
  
  const total = this.ratings.reduce((sum: number, ratingObj: { userId: string; rating: number }) => {
    return sum + ratingObj.rating;
  }, 0);
  
  return total / this.ratings.length;
};


const CardModel = model<ICard>("Card", CardSchema);

export { CardModel, ICard };
