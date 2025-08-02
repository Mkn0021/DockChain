import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import UserModel, { IUser } from '@/models/User';
import type { CreateUserInput } from '@/types/user';

export async function POST(request: NextRequest) {
    try {
        const body: CreateUserInput = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        await dbConnect();

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user: IUser = await UserModel.create({
            name,
            email,
            hashedPassword,
        });

        // Convert to object and remove hashedPassword
        const userObject = user.toObject();
        delete userObject.hashedPassword;

        return NextResponse.json(
            {
                message: 'User created successfully',
                user: {
                    id: userObject._id.toString(),
                    name: userObject.name,
                    email: userObject.email,
                    profileImageUrl: userObject.profileImageUrl,
                    createdAt: userObject.createdAt,
                    updatedAt: userObject.updatedAt,
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
