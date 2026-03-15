"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [role, setRole] = useState<'seeker' | 'recruiter'>('seeker');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt with:', { role, email, password });

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role })
            });
            const data = await response.json();
            console.log('Login response:', data);
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    return (
        <div className="app-container">
            <nav className="navbar">
                <Link href="/" className="logo">
                    Aura<span className="text-gradient">Jobs</span>
                </Link>
                <div className="nav-actions">
                    <Link href="/signup">
                        <button className="btn-primary" aria-label="Sign Up">Sign Up Instead</button>
                    </Link>
                </div>
            </nav>

            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Welcome Back</h1>
                        <p>Log in to your account</p>
                    </div>

                    <div className="role-toggle">
                        <button
                            className={role === 'seeker' ? 'active' : ''}
                            onClick={() => setRole('seeker')}
                            type="button"
                        >
                            Job Seeker
                        </button>
                        <button
                            className={role === 'recruiter' ? 'active' : ''}
                            onClick={() => setRole('recruiter')}
                            type="button"
                        >
                            Recruiter
                        </button>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary form-submit">
                            Log In as {role === 'seeker' ? 'Job Seeker' : 'Recruiter'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link href="/signup">Sign up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
