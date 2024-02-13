import { model, Schema, Document } from "mongoose";

interface ICard extends Document {
  characterName: string;
  cardName: string;
  cardDescription: string;
  youtubeLink?: string;
  userId: string;
  username: string;
  punisherData: Array<{
    move: string;
    description: string;
    hitLevel?: string;
    damage?: string[];
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
    damage?: string[];
    startUpFrame?: string;
    blockFrame?: string;
    hitFrame?: string;
    counterHitFrame?: string;
    notes?: string;
  }>;
  ratings: Array<{
    userId: string;
    rating: number;
  }>;
  tags: Array<{
    name: string;
    reactions: Array<{
      userId: string;
      type: 'like' | 'dislike';
    }>;
  }>; // Modified tags field
  createdAt: Date;
  lastEditedAt: Date | null;

  // Method to toggle like/dislike for a tag by a user
  toggleTagReaction(userId: string, tagName: string, reactionType: 'like' | 'dislike'): void;
}

const CardSchema = new Schema<ICard>({
  characterName: { type: String, required: true },
  cardName: { type: String, required: true },
  cardDescription: { type: String, required: true },
  youtubeLink: String,
  userId: { type: String, required: true },
  username: { type: String, required: true },
  punisherData: [{ type: Object }],
  moveFlowChartData: [{ type: Object }],
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
  createdAt: { type: Date, default: Date.now },
  lastEditedAt: Date,
});

// Method to toggle like/dislike for a tag by a user
CardSchema.methods.toggleTagReaction = function (
  this: ICard,
  userId: string,
  tagName: string,
  reactionType: 'like' | 'dislike'
) {
  const tagIndex = this.tags.findIndex(tag => tag.name === tagName);
  if (tagIndex !== -1) {
    const userReactionIndex = this.tags[tagIndex].reactions.findIndex(
      reaction => reaction.userId === userId
    );
    if (userReactionIndex !== -1) {
      // If user already reacted, toggle reaction
      if (this.tags[tagIndex].reactions[userReactionIndex].type === reactionType) {
        this.tags[tagIndex].reactions.splice(userReactionIndex, 1); // Remove reaction
      } else {
        this.tags[tagIndex].reactions[userReactionIndex].type = reactionType; // Toggle reaction
      }
    } else {
      // If user hasn't reacted yet, add new reaction
      this.tags[tagIndex].reactions.push({ userId, type: reactionType });
    }
  }
};

const CardModel = model<ICard>("Card", CardSchema);

export { CardModel, ICard };
