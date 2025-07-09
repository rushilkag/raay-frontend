import React, { useEffect, useState } from 'react';
import './App.css';

const promptBoxes = [
  {
    prompts: [
      'Join this GitHub repo, pull the latest changes, and write tests for the /auth API.',
      'Refactor this function to improve performance: getUserStats().',
      'Write a Slack bot that reminds me of my standup notes every morning at 9AM.',
      'Spin up a new microservice for handling file uploads using Flask and PostgreSQL.',
      'Deploy this on Vercel and set up a CI pipeline with GitHub Actions.'
    ]
  },
  {
    prompts: [
      'Analyze our churn rate over the past 3 months—break it down by segment.',
      'Find correlations between user retention and onboarding completion steps.',
      'Pull data from Stripe and generate a dashboard showing MRR growth.',
      'What’s our average user lifetime value for cohorts that joined in Q1?',
      'Run a quick clustering analysis on our most active users.'
    ]
  },
  {
    prompts: [
      'Give me 5 high-ROI experiments to increase sign-ups this month.',
      'A/B test this landing page copy and tell me which performs better.',
      'Draft a cold outreach email to YC founders for early feedback.',
      'Create a Typeform survey and connect it to our Slack when responses come in.',
      'Identify key drop-off points in our current funnel.'
    ]
  },
  {
    prompts: [
      'Write a LinkedIn post announcing our new AI feature—keep it punchy.',
      'What are the top 5 SEO keywords we\'re missing for our blog?',
      'Generate a 7-day email onboarding sequence for new users.',
      'Create a 30-second product demo script for TikTok.',
      'Analyze engagement on our last 10 tweets—what worked and what didn’t?'
    ]
  },
  {
    prompts: [
      'Summarize the last 10 customer support tickets and suggest improvements.',
      'Draft a privacy policy for our SaaS app.',
      'Generate a product roadmap for the next 6 months.',
      'Write a migration script from MongoDB to PostgreSQL.',
      'Create a user onboarding checklist for our mobile app.'
    ]
  },
  {
    prompts: [
      'Design a logo for our new AI-powered analytics tool.',
      'Suggest 3 new features based on user feedback.',
      'Write a press release for our Series A funding.',
      'Draft a partnership proposal for a major tech conference.',
      'Create a FAQ page for our product.'
    ]
  }
];

const commsWords = ["Anywhere.", "Call.", "Email.", "Slack.", "Text."];
const commsIcons = [
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="18" fill="url(#phone-gradient)" />
        <path d="M25.5 22.5l-2.7-2.7a1.5 1.5 0 0 0-2.1 0l-1.05 1.05a10.5 10.5 0 0 1-4.2-4.2l1.05-1.05a1.5 1.5 0 0 0 0-2.1l-2.7-2.7a1.5 1.5 0 0 0-2.1 0l-1.2 1.2c-1.2 1.2-1.2 3.15 0 4.35 3.15 4.05 7.05 7.95 11.1 11.1 1.2 1.2 3.15 1.2 4.35 0l1.2-1.2a1.5 1.5 0 0 0 0-2.1z" fill="#222"/>
        <defs>
          <linearGradient id="phone-gradient" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stop-color="#dc6bad"/>
            <stop offset="1" stop-color="#7192be"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    label: "Call."
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="18" fill="url(#mail-gradient)" />
        <rect x="8" y="13" width="20" height="10" rx="2" fill="#fff"/>
        <path d="M10 15l8 6 8-6" stroke="#222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <defs>
          <linearGradient id="mail-gradient" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stop-color="#dc6bad"/>
            <stop offset="1" stop-color="#7192be"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    label: "Email."
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="18" fill="url(#chat-gradient)" />
        <rect x="10" y="13" width="16" height="10" rx="4" fill="#fff"/>
        <ellipse cx="15" cy="18" rx="1.2" ry="1.2" fill="#222"/>
        <ellipse cx="18" cy="18" rx="1.2" ry="1.2" fill="#222"/>
        <ellipse cx="21" cy="18" rx="1.2" ry="1.2" fill="#222"/>
        <defs>
          <linearGradient id="chat-gradient" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stop-color="#dc6bad"/>
            <stop offset="1" stop-color="#7192be"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    label: "Slack."
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="18" fill="url(#sms-gradient)" />
        <rect x="12" y="10" width="12" height="16" rx="3" fill="#fff"/>
        <rect x="15" y="25" width="6" height="2" rx="1" fill="#222"/>
        <rect x="15" y="13" width="6" height="1.5" rx="0.75" fill="#222"/>
        <rect x="15" y="16" width="6" height="1.5" rx="0.75" fill="#222"/>
        <rect x="15" y="19" width="6" height="1.5" rx="0.75" fill="#222"/>
        <defs>
          <linearGradient id="sms-gradient" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stop-color="#dc6bad"/>
            <stop offset="1" stop-color="#7192be"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    label: "Text."
  }
];

function AnimatedPromptBox({ prompts }) {
  const [promptIndex, setPromptIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % prompts.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [prompts.length]);
  return (
    <div className="prompt-box prompt-box-uniform">
      <div className="prompt-box-animated">
        <span key={promptIndex}>{prompts[promptIndex]}</span>
      </div>
    </div>
  );
}

function AnimatedCommsWord() {
  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % commsWords.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);
  return (
    <span className="comms-gradient-word" key={wordIndex}>{commsWords[wordIndex]}</span>
  );
}

function App() {
  const roles = [
    'analyst',
    'engineer',
    'designer',
    'marketer',
    'tester',
  ];
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      {/* Navigation Bar */}
      <header className="header-light floating-nav">
        <div className="container nav-container">
          <div className="nav-left">
            <div className="window-controls">
              <span className="window-btn close"></span>
              <span className="window-btn minimize"></span>
              <span className="window-btn maximize"></span>
            </div>
            <div className="logo">Raay</div>
          </div>
          <nav className="nav-menu">
            <a href="#features" className="nav-link">Features</a>
            <a href="#contact" className="nav-link">Contact</a>
            <button className="btn-nav">Download</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="container hero-center">
          <h1 className="hero-title-large">Understand and fix bugs faster</h1>
          <p className="hero-subtitle-light">Ray is a desktop application that serves as the dedicated home for debugging output. Send, format and filter debug information from both local projects and remote servers.</p>
          <div className="hero-buttons">
            <button className="btn-cta">Download for Mac</button>
            <button className="btn-ghost">All Platforms</button>
          </div>
          <div className="hero-image-placeholder">[ Product Screenshot Placeholder ]</div>
        </div>
      </section>

      {/* Proven Results Section */}
      <section className="results-section">
        <div className="container results-center">
          <h2 className="results-headline">
            PROVEN <span className="results-gradient-blue">AI INTERN</span> <span className="results-gradient-purple">RESULTS</span>
          </h2>
          <div className="results-subheadline">WHAT FOUNDERS ACHIEVE WITH THEIR AUTONOMOUS AI INTERN</div>
          <div className="results-cards-grid">
            <div className="results-card">
              <div className="results-card-stat results-gradient-purple">87%</div>
              <div className="results-card-title">Faster MVP Development</div>
              <div className="results-card-desc">From idea to market in weeks</div>
            </div>
            <div className="results-card">
              <div className="results-card-stat results-gradient-blue">4.8x</div>
              <div className="results-card-title">Return on Investment</div>
              <div className="results-card-desc">Average ROI using Raay</div>
            </div>
            <div className="results-card">
              <div className="results-card-stat results-gradient-purple">67%</div>
              <div className="results-card-title">Reduced Costs</div>
              <div className="results-card-desc">AI-driven optimizations</div>
            </div>
            <div className="results-card">
              <div className="results-card-stat results-gradient-blue">3.2x</div>
              <div className="results-card-title">Faster User Growth</div>
              <div className="results-card-desc">Data-optimized acquisition</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Raay Section */}
      <section className="why-raay-section">
        <div className="container why-raay-center">
          <h2 className="why-raay-headline">WHY CHOOSE <span className="results-gradient-blue">RAAY AI</span> <span className="results-gradient-purple">INTERN?</span></h2>
          <div className="why-raay-subheadline">THE #1 AUTONOMOUS AI INTERN THAT NEVER SLEEPS, NEVER TAKES EQUITY, AND SCALES INFINITELY</div>
          <div className="why-raay-table-wrap">
            <table className="why-raay-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Raay AI Intern</th>
                  <th>Traditional Intern</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Availability</td>
                  <td>24/7/365 execution</td>
                  <td>Limited by capacity</td>
                </tr>
                <tr>
                  <td>Cost</td>
                  <td>Monthly subscription</td>
                  <td>20-50% equity + salary</td>
                </tr>
                <tr>
                  <td>Knowledge</td>
                  <td>Market intelligence</td>
                  <td>Personal experience</td>
                </tr>
                <tr>
                  <td>Scaling</td>
                  <td>Infinitely scalable</td>
                  <td>Limited bandwidth</td>
                </tr>
                <tr>
                  <td>Decisions</td>
                  <td>Data-driven analysis</td>
                  <td>Emotionally influenced</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* No Hiring Platforms Section */}
      <section className="no-hiring-section">
        <div className="container no-hiring-center">
          <h2 className="no-hiring-headline">
            Skip the <span className="no-hiring-platforms">hiring platforms</span>.<br />
            <span className="no-hiring-carousel-container">
              <span className="no-hiring-carousel">
                <div className="no-hiring-carousel-track">
                  <img className="no-hiring-carousel-logo-img-horiz" src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" title="LinkedIn" />
                  <img className="no-hiring-carousel-logo-img-horiz" src="https://upload.wikimedia.org/wikipedia/commons/6/6e/Y_Combinator_logo.svg" alt="Y Combinator" title="YC Co-founder Matching" />
                  <img className="no-hiring-carousel-logo-img-horiz" src="https://upload.wikimedia.org/wikipedia/commons/6/62/AngelList_logo.png" alt="AngelList" title="AngelList" />
                  <img className="no-hiring-carousel-logo-img-horiz" src="https://upload.wikimedia.org/wikipedia/commons/6/6e/Upwork_Logo.svg" alt="Upwork" title="Upwork" />
                  <img className="no-hiring-carousel-logo-img-horiz" src="https://assets-global.website-files.com/5f6b7190797c1a1c0b1c7c5a/63f8e2b6e7e0b2b1e7c8e2b6_wellfound-logo.svg" alt="Wellfound" title="Wellfound" />
                  <img className="no-hiring-carousel-logo-img-horiz" src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Fiverr_Logo_2022.svg" alt="Fiverr" title="Fiverr" />
                  <img className="no-hiring-carousel-logo-img-horiz" src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Toptal-logo-2021.svg" alt="Toptal" title="Toptal" />
                  <img className="no-hiring-carousel-logo-img-horiz" src="https://cdn.worldvectorlogo.com/logos/hired-1.svg" alt="Hired" title="Hired" />
                  <img className="no-hiring-carousel-logo-img-horiz" src="https://cdn.worldvectorlogo.com/logos/triplebyte.svg" alt="Triplebyte" title="Triplebyte" />
                  <img className="no-hiring-carousel-logo-img-horiz" src="https://www.guru.com/mc/images/logos/guru-logo-horizontal.svg" alt="Guru" title="Guru" />
                  <img className="no-hiring-carousel-logo-img-horiz" src="https://upload.wikimedia.org/wikipedia/commons/6/6b/FlexJobs_logo.svg" alt="FlexJobs" title="FlexJobs" />
                  <img className="no-hiring-carousel-logo-img-horiz" src="https://cdn.worldvectorlogo.com/logos/dribbble-icon-1.svg" alt="Dribbble" title="Dribbble" />
                  <img className="no-hiring-carousel-logo-img-horiz" src="https://cdn.worldvectorlogo.com/logos/behance-1.svg" alt="Behance" title="Behance" />
                  {/* Repeat for seamless loop */}
                  <img className="no-hiring-carousel-logo-img-horiz" src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" title="LinkedIn" />
                  <img className="no-hiring-carousel-logo-img-horiz" src="https://upload.wikimedia.org/wikipedia/commons/6/6e/Y_Combinator_logo.svg" alt="Y Combinator" title="YC Co-founder Matching" />
                </div>
              </span>
            </span>
            <br />No more endless interviews, matching, or waiting.
          </h2>
          <p className="no-hiring-subheadline">
            <span className="no-hiring-gradient">No equity required.</span> No HR. No recruiters. Just focus on building.
          </p>
        </div>
      </section>

      {/* Animated Role Section */}
      <section className="animated-role-section">
        <div className="container animated-role-center">
          <span className="animated-role-static">Raay is your&nbsp;</span>
          <span className="animated-role-dynamic" key={roleIndex}>{roles[roleIndex]}</span>
        </div>
      </section>

      {/* Prompt Boxes Section - Uniform Grid */}
      <section className="prompt-boxes-section">
        <div className="prompt-boxes-uniform-grid">
          {promptBoxes.map((box, i) => (
            <AnimatedPromptBox key={i} {...box} />
          ))}
        </div>
      </section>

      {/* Communication Section */}
      <section className="comms-section">
        <div className="container comms-center">
          <h2 className="comms-headline">
            Ray is your debugging sidekick.
          </h2>
          <p className="comms-subheadline">
            Ray is always a call, message, or email away.<br />However you work, Ray is there.
          </p>
          <div className="comms-icons-row">
            {commsIcons.map((c, i) => (
              <div className="comms-icon-glow" key={c.label} title={c.label}>
                {c.icon}
              </div>
            ))}
          </div>
          <div className="comms-bubble">
            <span className="comms-bubble-arrow" />
            <span className="comms-bubble-text">“Hey! How can I help you today?”</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-light">
        <div className="container footer-container">
          <div className="footer-logo">Ray</div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} Ray. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
