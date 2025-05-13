import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  gender: "Male" | "Female" | "Other";
  birthDate?: Date;
  deathDate?: Date;
  photo?: string;
  biography?: string;

  father?: Types.ObjectId;
  mother?: Types.ObjectId;
  spouse?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    birthDate: { type: Date },
    deathDate: { type: Date },
    photo: { type: String },
    biography: { type: String },

    father: { type: Schema.Types.ObjectId, ref: "User" },
    mother: { type: Schema.Types.ObjectId, ref: "User" },
    spouse: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
