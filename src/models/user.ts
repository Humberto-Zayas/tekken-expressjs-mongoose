import { model, Schema, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  isCorrectPassword: (password: string) => Promise<boolean>;
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
});

// Compare the incoming password with the stored password
UserSchema.methods.isCorrectPassword = async function (password: string) {
  return password === this.password;
};

const UserModel = model<IUser>("User", UserSchema);

export { UserModel, IUser };
