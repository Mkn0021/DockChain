import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import type { User } from '../types/user';

export interface IUser extends Document, Omit<User, 'id'> {
  _id: mongoose.Types.ObjectId;
  isPasswordCorrect(password: string): Promise<boolean>;
}

// User schema
const userSchema = new Schema<IUser>(
  {
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
      match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
    },
    hashedPassword: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('hashedPassword') || !this.hashedPassword) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.hashedPassword = await bcrypt.hash(this.hashedPassword, salt);
  next();
});

// Method to check password
userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
  if (!this.hashedPassword) {
    return false;
  }
  return await bcrypt.compare(password, this.hashedPassword);
};


const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
