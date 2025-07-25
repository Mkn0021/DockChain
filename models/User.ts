import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  clerkId?: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User schema
const userSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
    },
    profileImageUrl: {
      type: String,
      trim: true,
      // Validate URL format
      match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
