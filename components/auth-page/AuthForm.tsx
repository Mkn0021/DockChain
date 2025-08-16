"use client"

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import type { CreateUserInput, LoginInput } from '@/types/user';
import FormInput from '../ui/FormInput';

type FormField = {
    id: string;
    name: keyof CreateUserInput;
    type: string;
    placeholder: string;
    required?: boolean;
};

const AuthForm: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [formData, setFormData] = useState<CreateUserInput>({
        email: '',
        password: '',
        name: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const loginFields: FormField[] = [
        { id: 'login-email', name: 'email', type: 'email', placeholder: 'Email Address', required: true },
        { id: 'login-password', name: 'password', type: 'password', placeholder: 'Password', required: true }
    ];

    const signupFields: FormField[] = [
        { id: 'signup-name', name: 'name', type: 'text', placeholder: 'Full Name', required: true },
        { id: 'signup-email', name: 'email', type: 'email', placeholder: 'Email Address', required: true },
        { id: 'signup-password', name: 'password', type: 'password', placeholder: 'Password', required: true }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleLogin = async (loginData: LoginInput) => {
        const result = await signIn('credentials', {
            email: loginData.email,
            password: loginData.password,
            redirect: false,
        });

        if (result?.error) {
            setError('Invalid email or password');
        } else {
            router.push('/dashboard');
        }
    };

    const handleSignup = async (signupData: CreateUserInput) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData),
            });

            const data = await response.json();

            if (!data.success) {
                setError(data.error || 'Registration failed');
                return;
            }

            await signIn('credentials', {
                email: signupData.email,
                password: signupData.password,
                redirect: false,
            });

            router.push('/dashboard');
        } catch (error) {
            setError(`Registration failed. Please try again : ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (activeTab === 'login') {
                await handleLogin({
                    email: formData.email,
                    password: formData.password,
                });
            } else {
                await handleSignup({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                });
            }
        } catch (error) {
            setError(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full max-w-md bg-white p-10 sm:p-16 shadow-medium">
            <div className="w-[200%]">
                <h1 className="w-1/2 text-left">{activeTab === 'login' ? 'Login' : 'Sign Up'}</h1>
            </div>
            <div className="w-full">
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="w-full p-3 mb-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="w-full h-60 flex flex-col gap-6 justify-center py-6">
                        {(activeTab === 'login' ? loginFields : signupFields).map((field) => (
                            <FormInput
                                key={field.id}
                                {...field}
                                value={formData[field.name]}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        ))}
                    </div>

                    <div className="text-center">
                        <Button type="submit" className='w-full' disabled={isLoading}>
                            {isLoading ? 'Processing...' : activeTab === 'login' ? 'Login' : 'Sign Up'}
                        </Button>

                        <div className="mt-4">
                            {activeTab === 'login' ? 'Not a member? ' : 'Already have an account? '}
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveTab(activeTab === 'login' ? 'signup' : 'login');
                                    setError('');
                                    setFormData({ email: '', password: '', name: '' });
                                }}
                                className="text-blue-600 hover:underline"
                                disabled={isLoading}
                            >
                                {activeTab === 'login' ? 'Signup now' : 'Sign in'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;