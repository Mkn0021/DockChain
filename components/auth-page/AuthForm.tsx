"use client"

import React, { useState } from 'react';
import { Button } from '../ui/Button';

type FormField = {
    id: string;
    name: keyof FormData;
    type: string;
    placeholder: string;
    required?: boolean;
};

type FormData = {
    email: string;
    password: string;
    companyName: string;
};

const AuthForm: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        companyName: ''
    });

    const loginFields: FormField[] = [
        { id: 'login-email', name: 'email', type: 'email', placeholder: 'Email Address', required: true },
        { id: 'login-password', name: 'password', type: 'password', placeholder: 'Password', required: true }
    ];

    const signupFields: FormField[] = [
        { id: 'signup-companyName', name: 'companyName', type: 'text', placeholder: 'Company Name', required: true },
        ...loginFields.map(field => ({ ...field, id: field.id.replace('login', 'signup') }))
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`${activeTab === 'login' ? 'Login' : 'Signup'} data:`, formData);
    };

    return (
        <div className="w-full h-full max-w-[450px] bg-white p-10 sm:p-16 shadow-medium">
            <div className="w-[200%]">
                <h1 className="w-1/2 text-left">{activeTab === 'login' ? 'Login' : 'Sign Up'}</h1>
            </div>
            <div className="w-full">
                <form onSubmit={handleSubmit}>
                    <div className="w-full h-[240px] flex flex-col gap-6 justify-center py-6">
                        {(activeTab === 'login' ? loginFields : signupFields).map((field) => (
                            <div className="w-full h-[50px]" key={field.id}>
                                <input className='w-full h-full border border-gray-300 rounded-xl p-2 px-6'
                                    {...field}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Button type="submit" className='w-full'>
                            {activeTab === 'login' ? 'Login' : 'Sign Up'}
                        </Button>

                        {activeTab === 'login' ? 'Not a member? ' : 'Already have an account? '}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveTab(activeTab === 'login' ? 'signup' : 'login');
                            }}
                            className="text-blue-600 hover:underline"
                        >
                            {activeTab === 'login' ? 'Signup now' : 'Sign in'}
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;