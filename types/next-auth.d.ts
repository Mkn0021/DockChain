import type { User as DBUser } from './user';

declare module 'next-auth' {
    interface Session {
        user: DBUser;
    }

    interface User extends Omit<DBUser, 'hashedPassword'> {
        name: string;
        email: string;
        profileImageUrl?: string;
        createdAt: Date;
        updatedAt: Date;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends Pick<User, 'id' | 'profileImageUrl' | 'createdAt' | 'updatedAt'> { }
}
