import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Home() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">Aura<span className="text-gradient">Jobs</span></div>
        <div className="nav-links">
          <a href="#">Find Jobs</a>
          <a href="#">Companies</a>
          <a href="#">Salaries</a>
          <a href="#">Resources</a>
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <Link href="/login">
            <button className="btn-ghost" aria-label="Log In">Log In</button>
          </Link>
          <Link href="/signup">
            <button className="btn-primary" aria-label="Sign Up">Sign Up</button>
          </Link>
        </div>
      </nav>

      <main>
        <header className="hero">
          <div className="hero-badge" aria-label="New Jobs Added">✨ Over 10k+ new jobs added today</div>
          <h1 className="hero-title">
            Discover Your Next<br />
            <span className="text-gradient">Dream Career</span>
          </h1>
          <p className="hero-subtitle">
            The most advanced platform to discover opportunities, research leading companies, and accelerate your professional growth.
          </p>

          <div className="search-bar">
            <div className="search-input-wrapper">
              <span className="icon" aria-hidden="true">🔍</span>
              <input type="text" placeholder="Job title, keyword, or company" className="search-input" aria-label="Job Search Input" />
            </div>
            <div className="divider" aria-hidden="true"></div>
            <div className="search-input-wrapper">
              <span className="icon" aria-hidden="true">📍</span>
              <input type="text" placeholder="City, state, or remote" className="search-input" aria-label="Location Input" />
            </div>
            <button className="btn-primary search-btn" aria-label="Search Jobs">Search Jobs</button>
          </div>

          <div className="popular-tags">
            <span aria-hidden="true">Popular:</span>
            <span className="tag" role="button" tabIndex={0}>Frontend Developer</span>
            <span className="tag" role="button" tabIndex={0}>Product Manager</span>
            <span className="tag" role="button" tabIndex={0}>UI/UX Designer</span>
            <span className="tag" role="button" tabIndex={0}>Data Scientist</span>
          </div>
        </header>

        <section className="featured-section" id="categories">
          <div className="section-header">
            <h2>Explore Categories</h2>
            <a href="#" className="link-more" aria-label="View all categories">View all →</a>
          </div>

          <div className="categories-grid">
            <div className="category-card" tabIndex={0} role="button">
              <div className="cat-icon bg-indigo">💻</div>
              <h3>Software Engineering</h3>
              <p>4,200+ open positions</p>
            </div>
            <div className="category-card" tabIndex={0} role="button">
              <div className="cat-icon bg-purple">🎨</div>
              <h3>Design & Creative</h3>
              <p>1,800+ open positions</p>
            </div>
            <div className="category-card" tabIndex={0} role="button">
              <div className="cat-icon bg-blue">📈</div>
              <h3>Sales & Marketing</h3>
              <p>2,400+ open positions</p>
            </div>
            <div className="category-card" tabIndex={0} role="button">
              <div className="cat-icon bg-green">⚙️</div>
              <h3>Operations</h3>
              <p>1,200+ open positions</p>
            </div>
          </div>
        </section>

        <section className="featured-section" id="latest-jobs">
          <div className="section-header">
            <h2>Latest Featured Jobs</h2>
            <a href="#" className="link-more" aria-label="View all recent jobs">View all →</a>
          </div>
          <div className="jobs-list">
            <div className="job-card">
              <div className="job-logo">A</div>
              <div className="job-details">
                <h4>Senior Frontend Engineer</h4>
                <div className="job-meta">
                  <span>Acme Corp</span> • <span>San Francisco, CA (Hybrid)</span> • <span>$140k - $180k</span>
                </div>
                <div className="job-tags">
                  <span className="tag-sm">React</span>
                  <span className="tag-sm">TypeScript</span>
                  <span className="tag-sm">Next.js</span>
                </div>
              </div>
              <button className="btn-secondary" aria-label="Apply Now for Senior Frontend Engineer">Apply Now</button>
            </div>

            <div className="job-card">
              <div className="job-logo">G</div>
              <div className="job-details">
                <h4>Product Manager</h4>
                <div className="job-meta">
                  <span>GlobalTech</span> • <span>Remote</span> • <span>$130k - $160k</span>
                </div>
                <div className="job-tags">
                  <span className="tag-sm">Agile</span>
                  <span className="tag-sm">B2B SaaS</span>
                </div>
              </div>
              <button className="btn-secondary" aria-label="Apply Now for Product Manager">Apply Now</button>
            </div>

            <div className="job-card">
              <div className="job-logo">N</div>
              <div className="job-details">
                <h4>Lead UI/UX Designer</h4>
                <div className="job-meta">
                  <span>Nexus Design</span> • <span>New York, NY</span> • <span>$120k - $150k</span>
                </div>
                <div className="job-tags">
                  <span className="tag-sm">Figma</span>
                  <span className="tag-sm">Design Systems</span>
                </div>
              </div>
              <button className="btn-secondary" aria-label="Apply Now for Lead UI/UX Designer">Apply Now</button>
            </div>
          </div>
        </section>

        <section className="cta-section" id="cta">
          <h2>Ready to level up your career?</h2>
          <p>Join millions of professionals who have found their next big step with AuraJobs.</p>
          <div className="cta-buttons">
            <button className="btn-primary btn-lg" aria-label="Create an Account">Create an Account</button>
            <button className="btn-secondary btn-lg" aria-label="For Employers">For Employers</button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">Aura<span className="text-gradient">Jobs</span></div>
            <p>Connecting top talent with the world's most innovative companies. Your advanced career acceleration platform.</p>
          </div>
          <div className="footer-links">
            <div className="link-column">
              <h4>Candidates</h4>
              <a href="#">Find Jobs</a>
              <a href="#">Career Advice</a>
              <a href="#">Resume Builder</a>
              <a href="#">Job Alerts</a>
            </div>
            <div className="link-column">
              <h4>Employers</h4>
              <a href="#">Post a Job</a>
              <a href="#">Talent Search</a>
              <a href="#">Pricing Platform</a>
              <a href="#">Case Studies</a>
            </div>
            <div className="link-column">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Contact Us</a>
              <a href="#">Terms of Service</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AuraJobs. Designed with precise aesthetics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
