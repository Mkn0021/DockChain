import bcrypt from "bcrypt";
import { User } from "@type/user.type";
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document, Omit<User, 'id'> {
    _id: mongoose.Types.ObjectId;
    isPasswordCorrect(providedPassword: string): Promise<boolean>;
    toJSON(): Omit<User, 'password' | 'refreshTokenHash' | 'otp' | 'otpExpiry' | 'googleId'>;
}

const UserSchema = new Schema<IUser>(
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

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.isPasswordCorrect = async function (providedPassword: string): Promise<boolean> {
    if (!this.password) {
        return false;
    }
    return await bcrypt.compare(providedPassword, this.password);
}

UserSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    const { password, refreshTokenHash, otp, otpExpiry, googleId, __v, ...safeUser } = userObject;
    safeUser.id = safeUser._id.toString();
    delete safeUser._id;
    return safeUser;
}

const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
