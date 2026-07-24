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
              <span>~/home</span>
              <span>01 · Los Angeles</span>
            </div>
            <div className="home-room-copy">
              <p className="room-kicker"><span className="status-dot" />Available · StarAI / UCLA</p>
              <h1 id="home-room-title">Austin Xu</h1>
              <p className="home-room-deck">
                I build and study systems where models meet machines and markets.
              </p>
            </div>
            <div className="room-footer">
              <span>inference / agents / uncertain systems</span>
              <span aria-hidden="true">↘</span>
            </div>
          </section>

          <section
            className="room room-blog"
            data-panel="blog"
            aria-labelledby="blog-room-title"
          >
            <div className="room-topline">
              <span>~/blog</span>
              <span>02 · Latest note</span>
            </div>
            <div className="blog-room-layout">
              <div className="blog-room-copy">
                <p className="room-kicker">{latestPost.publishedAt} · {latestPost.readingTime}</p>
                <h2 id="blog-room-title">
                  <Link href="/blog">{latestPost.title}</Link>
                </h2>
                <p>{latestPost.summary}</p>
              </div>
              <div className="metric-tile" aria-hidden="true">
                <span>benchmark.delta</span>
                <strong>+3.095%</strong>
                <span>geometric mean</span>
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
              <span>~/projects</span>
              <span>03 · Public archive</span>
            </div>
            <div className="projects-stage">
              <div className="projects-intro">
                <p className="room-kicker room-kicker-light">Three public case studies</p>
                <h2 id="projects-room-title">
                  <Link href="/projects">Performance, agents, and uncertainty.</Link>
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
              Browse projects <span aria-hidden="true">↗</span>
            </Link>
          </section>

          <section
            className="room room-about"
            data-panel="about"
            aria-labelledby="about-room-title"
          >
            <div className="room-topline">
              <span>~/about</span>
              <span>04 · README</span>
            </div>
            <div className="about-room-copy">
              <p className="room-kicker">Currently</p>
              <h2 id="about-room-title">
                <Link href="/about">Research, systems, and interfaces.</Link>
              </h2>
              <p>
                I turn research questions into working software, measurable
                experiments, and clear technical artifacts.
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
