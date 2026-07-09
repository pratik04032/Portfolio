import React, { useState, useEffect, useRef } from 'react';
import {
  Code2,
  Moon,
  Sun,
  Download,
  CalendarCheck,
  Mail,
  Github,
  Globe,
  CheckCircle2,
  ArrowRight,
  Loader2,
  LogOut,
  X,
  Linkedin,
  Twitter,
  MessageCircle,
  Award
} from 'lucide-react';
import { initAuth, googleSignIn, getAccessToken, logout } from './lib/auth';
import { createInterviewEvent, logInterviewToSheet } from './lib/schedule';
import { submitContactMessage } from './lib/messages';
import { User } from 'firebase/auth';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [messageText, setMessageText] = useState('');
  const [formErrors, setFormErrors] = useState<{name?: string, email?: string, message?: string}>({});
  
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState<string | null>(null);
  
  const [githubProjects, setGithubProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetch('https://api.github.com/users/pratik04032/repos?sort=updated&per_page=6')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
           // Filter out profile readme repo
           const repos = data.filter(repo => repo.name !== 'pratik04032').slice(0, 3);
           setGithubProjects(repos);
        }
      })
      .catch(err => console.error("Error fetching projects", err))
      .finally(() => setLoadingProjects(false));
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setToken(token);
        setUser(user);
        setNeedsAuth(false);
      },
      () => {
        setToken(null);
        setUser(null);
        setNeedsAuth(true);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (user && formRef.current) {
      const nameInput = formRef.current.elements.namedItem('name') as HTMLInputElement;
      const emailInput = formRef.current.elements.namedItem('email') as HTMLInputElement;
      if (nameInput && !nameInput.value) nameInput.value = user.displayName || '';
      if (emailInput && !emailInput.value) emailInput.value = user.email || '';
    }
  }, [user]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        console.error('Login failed:', err);
        alert('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    setNeedsAuth(true);
    setUser(null);
    setToken(null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    const errors: {name?: string, email?: string, message?: string} = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Valid email is required';
    if (!message.trim()) errors.message = 'Message is required';
    if (message.length > 1000) errors.message = 'Message must be less than 1000 characters';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    setIsSubmitting(true);
    
    try {
      await submitContactMessage(name, email, message);
      
      if (formRef.current) formRef.current.reset();
      setMessageText('');
      alert('Your message has been sent successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to prepare message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !user?.email) {
      alert('Please sign in first.');
      return;
    }
    
    setIsScheduling(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const durationStr = formData.get('duration') as string;
    
    try {
      const startDateTimeStr = `${date}T${time}:00`;
      const startDateTime = new Date(startDateTimeStr);
      
      const durationMatch = durationStr.match(/(\d+)/);
      const durationMins = durationMatch ? parseInt(durationMatch[1]) : 30;
      
      const endDateTime = new Date(startDateTime.getTime() + durationMins * 60000);
      
      // 1. Create Calendar Event
      const eventRes = await createInterviewEvent(
        token,
        `Interview: ${title}`,
        startDateTime.toISOString(),
        endDateTime.toISOString(),
        'pratikkumarjena04@gmail.com' // Invite developer
      );
      
      const meetLink = eventRes.hangoutLink || 'Meet link generation failed';
      
      // 2. Log to Google Sheet
      await logInterviewToSheet(
        token,
        title,
        `${date} ${time}`,
        meetLink
      );
      
      setScheduleSuccess(meetLink);
    } catch (error) {
      console.error(error);
      alert('Failed to schedule interview. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <a className="flex items-center gap-3 font-semibold active" href="/" aria-current="page">
            <span className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground">
              <Code2 size={24} />
            </span>
            <span>
              <span className="block leading-tight">Pratik Kumar Jena</span>
              <span className="block text-xs font-medium text-muted-foreground">Full-Stack Developer</span>
            </span>
          </a>
          <nav className="flex flex-wrap items-center justify-end gap-2 ml-auto">
            <a className="rounded-md px-3 py-2 text-sm font-medium text-foreground bg-secondary transition hover:bg-secondary hover:text-foreground" href="/">
              Overview
            </a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground" href="#experience">
              Experience
            </a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground" href="#projects">
              Projects
            </a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground" href="#certificates">
              Certificates
            </a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground" href="#resume">
              Resume
            </a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground" href="#contact">
              Contact
            </a>
            <a href="https://github.com/your-username" className="inline-flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-secondary hover:text-foreground" aria-label="View GitHub profile">
              <Github size={18} />
            </a>
            <button
              onClick={() => setIsDark(!isDark)}
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a href="#resume" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
              <Download size={16} /> Resume
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_16%,rgba(79,70,229,.12),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(147,51,234,.1),transparent_28%)]"></div>
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-sm text-muted-foreground">
                <span className="flex size-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Available for product engineering and frontend roles
              </div>
              <h1 className="text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Pratik Kumar Jena
              </h1>
              <p className="mt-4 text-xl font-medium text-primary sm:text-2xl">
                Full-Stack Developer
              </p>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                I build reliable, polished web products that turn ambiguous ideas into shipped features. A product-minded developer focused on React, TypeScript, API design, and performance. I care about clean implementation, accessible interfaces, and measurable outcomes that hiring teams can trust in production.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => setShowScheduleModal(true)} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-sm transition hover:opacity-90">
                  <CalendarCheck size={18} /> Schedule an interview
                </button>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <a className="inline-flex items-center gap-2 hover:text-foreground transition-colors" href="mailto:hello@example.com">
                  <Mail size={16} /> Contact Me
                </a>
                <a className="inline-flex items-center gap-2 hover:text-foreground transition-colors" href="https://github.com/pratik04032">
                  <Github size={16} /> GitHub repositories
                </a>
                <span className="inline-flex items-center gap-2">
                  <Globe size={16} /> Open to remote, hybrid, and relocation-ready roles
                </span>
              </div>
            </div>
            <div className="grid content-start gap-4">
              <div className="rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                <div className="text-4xl font-semibold text-primary">42%</div>
                <div className="mt-2 font-semibold">faster repeat task completion</div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">through workflow-focused interface redesigns</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                <div className="text-4xl font-semibold text-primary">31%</div>
                <div className="mt-2 font-semibold">lower support handoff friction</div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">with clearer states, validation, and error recovery</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                <div className="text-4xl font-semibold text-primary">18</div>
                <div className="mt-2 font-semibold">production releases supported</div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">across client portals, dashboards, and internal tools</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.18em] text-primary">Core Skills</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Practical strengths hiring teams can evaluate quickly.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {['React', 'TypeScript', 'TanStack Router', 'Node.js', 'REST APIs', 'Postgres', 'Tailwind CSS', 'Netlify', 'Responsive UI', 'Accessibility', 'Performance', 'GitHub Workflows'].map((skill) => (
                <div key={skill} className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 shadow-sm hover:border-primary/50 transition-colors">
                  <CheckCircle2 size={18} className="text-primary" />
                  <span className="font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-background" id="experience">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-sm font-semibold uppercase tracking-[.18em] text-primary">Experience</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Work history.</h2>
            </div>
            
            <div className="space-y-12">
              <div className="relative pl-8 sm:pl-10 group/timeline">
                <div className="absolute left-0 top-6 h-3 w-3 rounded-full border-2 border-primary bg-background ring-4 ring-background transition-colors group-hover/timeline:bg-primary z-10"></div>
                <div className="absolute bottom-[-3rem] left-[5px] top-10 w-[2px] bg-border"></div>
                <div className="rounded-xl border border-transparent p-5 -ml-5 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:bg-card hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <h3 className="text-xl font-semibold">Data Analyst (Internship)</h3>
                    <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full w-fit">Apr 2026 - May 2026</span>
                  </div>
                  <p className="text-lg font-medium text-foreground/80 mb-4">Bluestock.in</p>
                  <ul className="list-disc space-y-2 pl-4 text-muted-foreground">
                    <li>Performed exploratory data analysis (EDA) on investment datasets; identified 5+ actionable business insights improving decision-making.</li>
                    <li>Developed SQL queries for data extraction and aggregation; optimized query performance by 35% through indexing and execution plan analysis.</li>
                    <li>Created interactive dashboards and reports to track KPIs; improved data accessibility for 20+ stakeholders.</li>
                  </ul>
                </div>
              </div>
              
              <div className="relative pl-8 sm:pl-10 group/timeline">
                <div className="absolute left-0 top-6 h-3 w-3 rounded-full border-2 border-primary bg-background ring-4 ring-background transition-colors group-hover/timeline:bg-primary z-10"></div>
                <div className="absolute bottom-[-3rem] left-[5px] top-10 w-[2px] bg-border"></div>
                <div className="rounded-xl border border-transparent p-5 -ml-5 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:bg-card hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <h3 className="text-xl font-semibold">Power BI Developer & Data Analyst (Internship)</h3>
                    <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full w-fit">Jun 2025 - Aug 2025</span>
                  </div>
                  <p className="text-lg font-medium text-foreground/80 mb-4">Cognifyz Technologies</p>
                  <ul className="list-disc space-y-2 pl-4 text-muted-foreground">
                    <li>Designed and developed 5+ Power BI dashboards with advanced visualizations and interactive filters.</li>
                    <li>Performed ETL operations for data integration from multiple sources; designed normalized data models.</li>
                    <li>Analyzed investment duration, frequency, and decision factors using aggregations and DAX calculations; uncovered 8+ actionable insights.</li>
                  </ul>
                </div>
              </div>

              <div className="relative pl-8 sm:pl-10 group/timeline">
                <div className="absolute left-0 top-6 h-3 w-3 rounded-full border-2 border-primary bg-background ring-4 ring-background transition-colors group-hover/timeline:bg-primary z-10"></div>
                <div className="absolute bottom-[-3rem] left-[5px] top-10 w-[2px] bg-border"></div>
                <div className="rounded-xl border border-transparent p-5 -ml-5 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:bg-card hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <h3 className="text-xl font-semibold">Frontend Developer (Internship)</h3>
                    <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full w-fit">Aug 2024 - Sep 2024</span>
                  </div>
                  <p className="text-lg font-medium text-foreground/80 mb-4">Cognifyz Technologies</p>
                  <ul className="list-disc space-y-2 pl-4 text-muted-foreground">
                    <li>Developed 3+ responsive web applications using HTML5, CSS3, and vanilla JavaScript with modern UI/UX principles.</li>
                    <li>Implemented dynamic client-side features using DOM manipulation; improved user engagement metrics by 25%.</li>
                    <li>Integrated RESTful APIs for real-time data fetching and display; optimized API response handling by 30%.</li>
                  </ul>
                </div>
              </div>
              
              <div className="relative pl-8 sm:pl-10 group/timeline">
                <div className="absolute left-[2px] top-6 h-2 w-2 rounded-full border-2 border-muted-foreground bg-background ring-4 ring-background transition-colors group-hover/timeline:border-primary z-10"></div>
                <div className="rounded-xl border border-transparent p-5 -ml-5 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:bg-card hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <h3 className="text-xl font-semibold text-muted-foreground transition-colors group-hover/timeline:text-foreground">Backend/Systems Developer (C/C++)</h3>
                    <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full w-fit">Jan 2024 - Feb 2024</span>
                  </div>
                  <p className="text-lg font-medium text-foreground/60 mb-4 transition-colors group-hover/timeline:text-foreground/80">Cognifyz Technologies</p>
                  <ul className="list-disc space-y-2 pl-4 text-muted-foreground">
                    <li>Developed console-based applications using C/C++ following SOLID principles and design patterns.</li>
                    <li>Built file handling systems for data processing; implemented efficient I/O operations reducing memory footprint by 20%.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/45" id="projects">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.18em] text-primary">Selected Work</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">Projects framed around outcomes.</h2>
              </div>
              <a href="#projects" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
                View all projects <ArrowRight size={16} />
              </a>
            </div>
            {loadingProjects ? (
              <div className="flex justify-center items-center py-20 w-full">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-3">
                {githubProjects.map((project, index) => {
                  const colors = [
                    'from-blue-500/20 to-cyan-500/20',
                    'from-purple-500/20 to-pink-500/20',
                    'from-emerald-500/20 to-teal-500/20'
                  ];
                  return (
                    <article key={project.name} className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                      <div className={`h-40 w-full bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center border-b border-border`}>
                        <Code2 className="text-foreground/50 transition-opacity group-hover:opacity-100" size={48} />
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-xl font-semibold break-words line-clamp-2" title={project.name.replace(/-/g, ' ')}>{project.name.replace(/-/g, ' ')}</h3>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground line-clamp-3" title={project.description || 'No description provided.'}>{project.description || 'No description provided.'}</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {project.language && (
                            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{project.language}</span>
                          )}
                        </div>
                        <div className="mt-auto pt-5">
                          <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                            <Github size={16} /> Repository
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="bg-background py-16" id="certificates">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.18em] text-primary">Certifications</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">Professional achievements.</h2>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'AWS Certified Solutions Architect',
                  issuer: 'Amazon Web Services',
                  date: '2025',
                },
                {
                  title: 'Google Cloud Professional Developer',
                  issuer: 'Google Cloud',
                  date: '2024',
                },
                {
                  title: 'Meta Front-End Developer',
                  issuer: 'Coursera',
                  date: '2023',
                }
              ].map((cert) => (
                <article key={cert.title} className="group flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                  <div>
                    <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Award size={20} />
                    </div>
                    <h3 className="text-lg font-semibold">{cert.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{cert.issuer}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm font-medium text-muted-foreground">{cert.date}</span>
                    <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                      Verify <ArrowRight size={14} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8" id="contact">
          <h2 className="text-3xl font-semibold tracking-tight">Hiring managers can review the work, download the resume, and book time from one place.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Use the interview link for availability, or send role details through the contact form below for a direct response.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row mb-12">
            <button onClick={() => setShowScheduleModal(true)} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90">
              <CalendarCheck size={18} /> Schedule an interview
            </button>
          </div>

          <form 
            ref={formRef}
            onSubmit={handleFormSubmit} 
            className="text-left bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm"
          >
            <div className="grid gap-6">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input id="name" name="name" disabled={isSubmitting} required type="text" defaultValue={user?.displayName || ''} className={`w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 ${formErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-border'}`} placeholder="Jane Doe" />
                {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input id="email" name="email" disabled={isSubmitting} required type="email" defaultValue={user?.email || ''} className={`w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 ${formErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-border'}`} placeholder="jane@example.com" />
                {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <span className={`text-xs ${messageText.length > 1000 || formErrors.message ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {messageText.length} / 1000
                  </span>
                </div>
                <textarea id="message" name="message" value={messageText} onChange={(e) => setMessageText(e.target.value)} disabled={isSubmitting} required rows={4} maxLength={1000} className={`w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50 ${formErrors.message ? 'border-red-500 focus:ring-red-500' : 'border-border'}`} placeholder="How can I help you?"></textarea>
                {formErrors.message && <p className="text-xs text-red-500">{formErrors.message}</p>}
              </div>
              
              <div className="mt-2 flex flex-col gap-3">
                <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Preparing...
                    </>
                  ) : (
                    <>
                      Send Message <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>
      
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 sm:p-6">
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2">
                <CalendarCheck size={20} className="text-primary" />
                <h3 className="font-semibold">Schedule an Interview</h3>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              {scheduleSuccess ? (
                <div className="text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Interview Scheduled!</h4>
                  <p className="text-sm text-muted-foreground mb-6">
                    A calendar invitation has been sent and the interview has been logged.
                  </p>
                  <a 
                    href={scheduleSuccess} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    Join Google Meet <ArrowRight size={16} />
                  </a>
                  <button 
                    onClick={() => { setShowScheduleModal(false); setScheduleSuccess(null); }} 
                    className="mt-3 inline-block w-full text-sm text-muted-foreground hover:text-foreground"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleScheduleSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="title" className="text-sm font-medium">Interview Title / Role</label>
                    <input id="title" name="title" required type="text" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Frontend Engineer Interview" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="date" className="text-sm font-medium">Date</label>
                      <input id="date" name="date" required type="date" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="time" className="text-sm font-medium">Time</label>
                      <input id="time" name="time" required type="time" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="duration" className="text-sm font-medium">Duration</label>
                    <select id="duration" name="duration" required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>
                  
                  <div className="mt-4 border-t border-border pt-4">
                    {needsAuth ? (
                      <button type="button" onClick={handleLogin} disabled={isLoggingIn} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-secondary border border-border text-foreground px-4 py-2 font-semibold transition hover:bg-secondary/80 disabled:opacity-50">
                        {isLoggingIn ? <><Loader2 size={16} className="animate-spin" /> Connecting...</> : 'Sign in to Schedule'}
                      </button>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <button type="submit" disabled={isScheduling} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
                          {isScheduling ? <><Loader2 size={16} className="animate-spin" /> Scheduling...</> : 'Schedule & Generate Meet Link'}
                        </button>
                        <p className="text-center text-xs text-muted-foreground">
                          Scheduling as {user?.email}
                        </p>
                      </div>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Pratik Kumar Jena. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://linkedin.com/in/pratikkumarjena" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" title="LinkedIn">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://github.com/pratikkumarjena" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" title="GitHub">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://twitter.com/pratikkumarjena" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" title="Twitter">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://wa.me/yourwhatsappnumber" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" title="WhatsApp">
                <MessageCircle size={20} />
                <span className="sr-only">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

