import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel, { IUser } from '@/models/User';
import type { CreateUserInput } from '@/types/user';
import { asyncHandler, apiResponse } from '@/lib/api/response';
import { APIError } from '@/lib/api/errors';

export const POST = asyncHandler(async (request: NextRequest) => {
    const { name, email, password }: CreateUserInput = await request.json();

    // Validation
    if (!name || !email || !password) {
        throw APIError.validation('Name, email, and password are required');
    }

    if (password.length < 6) {
        throw APIError.validation('Password must be at least 6 characters long');
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        throw APIError.conflict('User with this email already exists');
    }

    // Create user
    const user: IUser = await UserModel.create({
        name,
        email,
        hashedPassword: password,
    });

    const userData = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
    };

    return apiResponse.success(userData, 'User created successfully', 201);
});
