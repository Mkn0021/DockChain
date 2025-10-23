"use client";
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import InputBox from '@/components/InputBox';

const AuthForm: React.FC = () => {
    const [mode, setMode] = useState<'login' | 'signup' | 'otp' | 'setPassword'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Signup - Step 1: Name and Email
        if (mode === 'signup') {
            if (!fullName.trim()) {
                setError('Please enter your full name');
                return;
            }
            if (!email.trim()) {
                setError('Please enter your email');
                return;
            }
            // Move to OTP verification
            setMode('otp');
        }

        // Signup - Step 2: OTP Verification
        else if (mode === 'otp') {
            if (otp.length !== 6) {
                setError('Please enter a valid 6-digit OTP');
                return;
            }
            // Move to password setup
            setMode('setPassword');
        }

        // Signup - Step 3: Set Password
        else if (mode === 'setPassword') {
            if (password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            // Complete signup
            alert('Signup complete!');
        }

        // Login
        else if (mode === 'login') {
            if (!email.trim()) {
                setError('Please enter your email');
                return;
            }
            if (!password.trim()) {
                setError('Please enter your password');
                return;
            }
            // Process login
            alert('Login successful!');
        }
    };

    const handleForgotPassword = () => {
        alert('Forgot password clicked');
    };

    const handleGoogleLogin = () => {
        alert('Google login clicked');
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {mode === 'otp'
                        ? 'Verify Email'
                        : mode === 'setPassword'
                            ? 'Set Password'
                            : mode === 'login'
                                ? 'Welcome Back'
                                : 'Create Account'}
                </h1>
                <p className="text-gray-600">
                    {mode === 'otp'
                        ? 'Enter the OTP sent to your email'
                        : mode === 'setPassword'
                            ? 'Create a secure password for your account'
                            : mode === 'login'
                                ? 'Sign in to continue'
                                : 'Sign up to get started'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {/* OTP Verification Step */}
                {mode === 'otp' ? (
                    <>
                        <InputBox
                            label="OTP Code"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                        />
                        <Button type="submit" variant="primary" className="w-full">
                            Verify OTP
                        </Button>
                        <button
                            type="button"
                            onClick={() => alert('Resend OTP')}
                            className="w-full text-center text-sm text-blue-600 hover:underline"
                        >
                            Resend OTP
                        </button>
                    </>
                ) : mode === 'setPassword' ? (
                    <>
                        <InputBox
                            label="Password"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputBox
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button type="submit" variant="primary" className="w-full">
                            Complete Signup
                        </Button>
                    </>
                ) : (
                    <>
                        {mode === 'signup' && (
                            <InputBox
                                label="Full Name"
                                type="text"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        )}

                        <InputBox
                            label="Email Address"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {mode === 'login' && (
                            <>
                                <InputBox
                                    label="Password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            </>
                        )}

                        <Button type="submit" variant="primary" className="w-full">
                            {mode === 'login' ? 'Sign In' : 'Continue'}
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-150"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </button>
                    </>
                )}
            </form>

            {mode !== 'otp' && mode !== 'setPassword' && (
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            {mode === 'login' ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            )}

            {mode === 'otp' && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setMode('signup')}
                        className="text-sm text-gray-600 hover:underline"
                    >
                        ← Back to Sign Up
                    </button>
                </div>
            )}

            {mode === 'setPassword' && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setMode('otp')}
                        className="text-sm text-gray-600 hover:underline"
                    >
                        ← Back to OTP
                    </button>
                </div>
            )}
        </div>
    );
};

export default AuthForm;