import { model, Schema, Document, Types } from "mongoose";
import bcrypt from 'bcrypt';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  isCorrectPassword: (password: string) => Promise<boolean>;
  bookmarks: Schema.Types.ObjectId[]; // Array of Card IDs

}

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Card' }]
});

// set up pre-save middleware to create password and update lastActive
UserSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});


// Compare the incoming password with the stored password
UserSchema.methods.isCorrectPassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const UserModel = model<IUser>("User", UserSchema);

export { UserModel, IUser };
