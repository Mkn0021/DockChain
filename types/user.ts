export interface User {
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
    hashedPassword?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserInput extends Pick<User, 'name' | 'email'> {
    password: string;
}

export interface LoginInput extends Omit<CreateUserInput, 'name'> { }
