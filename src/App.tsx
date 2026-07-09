import React, { useState, useEffect } from 'react';
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
  Loader2
} from 'lucide-react';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <a className="flex items-center gap-3 font-semibold active" href="/" aria-current="page">
            <span className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground">
              <Code2 size={24} />
            </span>
            <span>
              <span className="block leading-tight">Your Name</span>
              <span className="block text-xs font-medium text-muted-foreground">Full-Stack Developer</span>
            </span>
          </a>
          <nav className="flex flex-wrap items-center gap-2">
            <a className="rounded-md px-3 py-2 text-sm font-medium text-foreground bg-secondary transition hover:bg-secondary hover:text-foreground" href="/">
              Overview
            </a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground" href="#projects">
              Projects
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
                Your Name
              </h1>
              <p className="mt-4 text-xl font-medium text-primary sm:text-2xl">
                Full-Stack Developer
              </p>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                I build reliable, polished web products that turn ambiguous ideas into shipped features. A product-minded developer focused on React, TypeScript, API design, and performance. I care about clean implementation, accessible interfaces, and measurable outcomes that hiring teams can trust in production.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="https://calendly.com/your-name" className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-sm transition hover:opacity-90">
                  <CalendarCheck size={18} /> Schedule an interview
                </a>
                <a href="#resume" className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-5 py-3 font-semibold transition hover:bg-secondary">
                  <Download size={18} /> Download resume
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <a className="inline-flex items-center gap-2 hover:text-foreground transition-colors" href="mailto:hello@example.com">
                  <Mail size={16} /> hello@example.com
                </a>
                <a className="inline-flex items-center gap-2 hover:text-foreground transition-colors" href="https://github.com/your-username">
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
            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  title: 'Client Analytics Console',
                  desc: 'A compact reporting interface for stakeholders who needed to compare trends, identify account risk, and export clean summaries without waiting on manual reports.',
                  tags: ['Data Visualization', 'React', 'API Integration', 'Performance']
                },
                {
                  title: 'Recruiter Portfolio Platform',
                  desc: 'A fast professional portfolio that packages skills, project proof, resume downloads, contact options, and interview scheduling into a single hiring-manager flow.',
                  tags: ['TanStack Start', 'Netlify', 'Tailwind CSS', 'Content Collections']
                },
                {
                  title: 'Operations Task Manager',
                  desc: 'A responsive planning workspace for teams that needed faster task triage, clearer ownership, and dependable status visibility across active workstreams.',
                  tags: ['React', 'TypeScript', 'Workflow UX', 'Responsive UI']
                }
              ].map((project) => (
                <article key={project.title} className="rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="mt-3 min-h-24 text-sm leading-6 text-muted-foreground">{project.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{tag}</span>
                    ))}
                  </div>
                  <a href="#" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                    <Github size={16} /> Repository
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8" id="contact">
          <h2 className="text-3xl font-semibold tracking-tight">Hiring managers can review the work, download the resume, and book time from one place.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Use the interview link for availability, or send role details through the contact form below for a direct response.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row mb-12">
            <a href="https://calendly.com/your-name" className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90">
              <CalendarCheck size={18} /> Schedule an interview
            </a>
          </div>

          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              setIsSubmitting(true);
              setTimeout(() => {
                alert('Message sent successfully!');
                setIsSubmitting(false);
              }, 1500);
            }} 
            className="text-left bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm"
          >
            <div className="grid gap-6">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input id="name" disabled={isSubmitting} required type="text" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50" placeholder="Jane Doe" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input id="email" disabled={isSubmitting} required type="email" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50" placeholder="jane@example.com" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea id="message" disabled={isSubmitting} required rows={4} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50" placeholder="How can I help you?"></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </main>
      
      <footer className="border-t border-border bg-background py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

