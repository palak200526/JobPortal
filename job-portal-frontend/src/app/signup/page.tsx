"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
    const [role, setRole] = useState<'seeker' | 'recruiter'>('seeker');

    // Common Fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Seeker Fields
    const [skills, setSkills] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');

    // Recruiter Fields
    const [companyName, setCompanyName] = useState('');
    const [roleTitle, setRoleTitle] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            role, name, email, password,
            ...(role === 'seeker' ? {
                skills,
                resume_url: resumeUrl
            } : {
                company_name: companyName,
                role_title: roleTitle
            })
        };

        console.log('Signup Profile submitted (sending to backend...):', payload);
        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            console.log('Response from backend:', data);
        } catch (err) {
            console.error('Error reaching backend:', err);
        }
    };

    return (
        <div className="app-container">
            <nav className="navbar">
                <Link href="/" className="logo">
                    Aura<span className="text-gradient">Jobs</span>
                </Link>
                <div className="nav-actions">
                    <Link href="/login">
                        <button className="btn-primary" aria-label="Log In">Log In Instead</button>
                    </Link>
                </div>
            </nav>

            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Join Aura<span className="text-gradient">Jobs</span></h1>
                        <p>Create your new account</p>
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
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                className="form-input"
                                placeholder="Jane Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

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

                        {/* Dynamic Fields Details Based on Role */}
                        {role === 'seeker' ? (
                            <>
                                <div className="form-group">
                                    <label htmlFor="skills">Key Skills (Comma separated)</label>
                                    <input
                                        type="text"
                                        id="skills"
                                        className="form-input"
                                        placeholder="React, TypeScript, Node.js"
                                        value={skills}
                                        onChange={(e) => setSkills(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="resumeUrl">Resume/Portfolio URL</label>
                                    <input
                                        type="url"
                                        id="resumeUrl"
                                        className="form-input"
                                        placeholder="https://yourportfolio.com"
                                        value={resumeUrl}
                                        onChange={(e) => setResumeUrl(e.target.value)}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="form-group">
                                    <label htmlFor="companyName">Company Name</label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        className="form-input"
                                        placeholder="Acme Corp"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="roleTitle">Your Title in Company</label>
                                    <input
                                        type="text"
                                        id="roleTitle"
                                        className="form-input"
                                        placeholder="Hiring Manager, CTO, etc."
                                        value={roleTitle}
                                        onChange={(e) => setRoleTitle(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" className="btn-primary form-submit">
                            Sign Up as {role === 'seeker' ? 'Job Seeker' : 'Recruiter'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Already have an account? <Link href="/login">Log in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
