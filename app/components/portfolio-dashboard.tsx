"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { projects } from "../data/projects";

type LatestPost = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  readingTime: string;
};

const projectLabels: Record<(typeof projects)[number]["slug"], string> = {
  "amd-inference": "AMD inference",
  "coup-rl-bot": "Coup RL bot",
  "heston-regime-lab": "Heston regime lab",
};

const socialLinks = [
  {
    href: "https://github.com/austxu",
    label: "GitHub",
    icon: FaGithub,
  },
  {
    href: "https://www.linkedin.com/in/axu25",
    label: "LinkedIn",
    icon: FaLinkedinIn,
  },
  {
    href: "https://x.com/austixu",
    label: "X",
    icon: FaXTwitter,
  },
] as const;

export function PortfolioDashboard({ latestPost }: { latestPost: LatestPost }) {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const toggleProjects = () => setProjectsOpen((open) => !open);

  return (
    <>
      <a className="skip-link" href="#dashboard-grid">Skip to the four rooms</a>
      <main className="dashboard" id="main-content">
        <div className="dashboard-grid" id="dashboard-grid">
          <section
            className="room room-home"
            data-panel="home"
            aria-labelledby="home-room-title"
          >
            <div className="room-topline">
              <span>Home</span>
              <span>01 / Los Angeles</span>
            </div>
            <div className="home-room-copy">
              <p className="room-kicker"><span className="status-dot" />Researcher at StarAI, UCLA</p>
              <h1 id="home-room-title">Austin Xu</h1>
              <p className="home-room-deck">
                I chase the edge cases where <strong>models</strong> meet machines
                and markets.
              </p>
            </div>
            <div className="room-footer">
              <span>Inference × agents × uncertain systems</span>
              <span aria-hidden="true">↘</span>
            </div>
          </section>

          <section
            className="room room-blog"
            data-panel="blog"
            aria-labelledby="blog-room-title"
          >
            <div className="room-topline">
              <span>Blog</span>
              <span>02 / Field notes</span>
            </div>
            <div className="blog-room-layout">
              <div className="blog-room-copy">
                <p className="room-kicker">{latestPost.publishedAt} · {latestPost.readingTime}</p>
                <h2 id="blog-room-title">
                  <Link href="/blog">{latestPost.title}</Link>
                </h2>
                <p>{latestPost.summary}</p>
              </div>
              <div className="paper-stack" aria-hidden="true">
                <span />
                <span />
                <span>+3.095%</span>
              </div>
            </div>
            <Link className="room-link" href={`/blog/${latestPost.slug}`}>
              Read the latest note <span aria-hidden="true">↗</span>
            </Link>
          </section>

          <section
            className="room room-projects"
            data-panel="projects"
            data-open={projectsOpen ? "true" : "false"}
            aria-labelledby="projects-room-title"
          >
            <div className="room-topline room-topline-light">
              <span>Projects</span>
              <span>03 / Public portfolio</span>
            </div>
            <div className="projects-stage">
              <div className="projects-intro">
                <p className="room-kicker room-kicker-light">Three systems. No password.</p>
                <h2 id="projects-room-title">
                  <Link href="/projects">Make the work inspectable.</Link>
                </h2>
              </div>

              <div
                className="project-drawer"
                id="project-drawer"
                aria-hidden={!projectsOpen}
              >
                {projects.map((project, index) => (
                  <Link
                    className="project-drawer-link"
                    href={`/work/${project.slug}`}
                    key={project.slug}
                    tabIndex={projectsOpen ? undefined : -1}
                  >
                    <span>0{index + 1}</span>
                    <strong>{projectLabels[project.slug]}</strong>
                    <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>

              <button
                className="bear-button"
                type="button"
                aria-expanded={projectsOpen}
                aria-controls="project-drawer"
                aria-label={projectsOpen ? "Tuck the project links away" : "Boop the bear to reveal projects"}
                onClick={toggleProjects}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggleProjects();
                  }
                }}
              >
                <Image
                  className="dashboard-bear"
                  src="/bear-cameo.png"
                  alt=""
                  width={460}
                  height={460}
                  priority
                  unoptimized
                />
                <span className="bear-button-label">
                  {projectsOpen ? "Bear approved" : "Boop the bear"}
                </span>
              </button>
            </div>
            <p className="sr-only" aria-live="polite">
              {projectsOpen ? "Projects revealed. Three case-study links are now available." : ""}
            </p>
            <Link className="room-link room-link-light" href="/projects">
              View all projects <span aria-hidden="true">↗</span>
            </Link>
          </section>

          <section
            className="room room-about"
            data-panel="about"
            aria-labelledby="about-room-title"
          >
            <div className="room-topline">
              <span>About</span>
              <span>04 / Open channel</span>
            </div>
            <div className="about-room-copy">
              <p className="room-kicker">Now</p>
              <h2 id="about-room-title">
                <Link href="/about">Build the instrument panel.</Link>
              </h2>
              <p>
                I work where research meets the systems that make it observable:
                kernels, agents, interfaces, and evidence that can travel.
              </p>
              <a className="about-email" href="mailto:austinxu@ucla.edu">
                austinxu@ucla.edu <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="about-room-footer">
              <nav className="social-links" aria-label="Social links">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    href={href}
                    key={label}
                    className="social-link"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    title={label}
                  >
                    <Icon aria-hidden="true" />
                  </a>
                ))}
              </nav>
              <p>The bear is a personal cameo, not a logo. No IKEA affiliation.</p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
