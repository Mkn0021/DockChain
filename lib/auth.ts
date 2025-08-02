import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import UserModel, { IUser } from '@/models/User';
import type { User } from '@/types/user';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    await dbConnect();
                    const user: IUser | null = await UserModel.findOne({ email: credentials.email });

                    if (!user || !user.hashedPassword) {
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.hashedPassword
                    );

                    if (!isPasswordValid) {
                        return null;
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        profileImageUrl: user.profileImageUrl,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                    } as User;
                } catch (error) {
                    console.error('Authorization error:', error);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: 'jwt' as const,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: User | null }): Promise<JWT> {
            if (user) {
                token.id = user.id;
                token.profileImageUrl = user.profileImageUrl;
                token.createdAt = user.createdAt;
                token.updatedAt = user.updatedAt;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
            if (token) {
                session.user.id = token.id;
                session.user.profileImageUrl = token.profileImageUrl;
                session.user.createdAt = token.createdAt;
                session.user.updatedAt = token.updatedAt;
            }
            return session;
        },
        async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            else if (new URL(url).origin === baseUrl) return url;
            return `${baseUrl}/dashboard`;
        },
    },
};
