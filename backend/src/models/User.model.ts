import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types/user.type";

export interface IUserDocument extends IUser, Document { }

const UserSchema = new Schema<IUserDocument>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String },
        googleId: { type: String },
        isVerified: { type: Boolean, default: false },
        otp: { type: String },
        otpExpiry: { type: Date },
        role: { type: String, enum: ["admin", "user"], default: "user" },
        refreshTokenHash: { type: String },
    },
    { timestamps: true }
);

UserSchema.index({ email: 1 }); // optimize lookups

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
