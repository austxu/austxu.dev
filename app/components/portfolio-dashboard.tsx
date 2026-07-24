"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { LuMoon } from "react-icons/lu";
import { projects } from "../data/projects";
import { InteractiveWorldMap } from "./interactive-world-map";
import { PhysicsSkillCloud } from "./physics-skill-cloud";
import { PrimaryDock } from "./site-shell";

type CodeSegment = {
  text: string;
  tone?: "blue" | "green" | "pink" | "purple";
};

const codeRows: CodeSegment[][] = [
  [
    { text: "import", tone: "pink" },
    { text: " { models, machines, markets } ", tone: "blue" },
    { text: "from", tone: "pink" },
    { text: " 'austin-xu'" },
  ],
  [],
  [{ text: "// Profile", tone: "green" }],
  [
    { text: "export", tone: "pink" },
    { text: " const", tone: "blue" },
    { text: " austin = {" },
  ],
  [{ text: "  role", tone: "blue" }, { text: ": 'researcher / engineer'," }],
  [{ text: "  workingAt", tone: "blue" }, { text: ": {" }],
  [{ text: "    lab", tone: "blue" }, { text: ": 'StarAI @ UCLA'," }],
  [
    { text: "    focus", tone: "blue" },
    { text: ": ['inference', 'agents']" },
  ],
  [{ text: "  }," }],
  [
    { text: "  building", tone: "blue" },
    { text: ": ['systems', 'experiments'," },
  ],
  [{ text: "             'interfaces']," }],
  [{ text: "  basedIn", tone: "blue" }, { text: ": 'Los Angeles'," }],
  [{ text: "  curiosity", tone: "blue" }, { text: ": true" }],
  [{ text: "}" }],
  [],
  [{ text: "// Public work", tone: "green" }],
  [
    { text: "export default", tone: "pink" },
    { text: " austin" },
  ],
  [],
];

const fullCode = codeRows
  .map((row) => row.map((segment) => segment.text).join(""))
  .join("\n");

const totalCodeCharacters = fullCode.length;
const codeRowStarts = codeRows.map((_, index) =>
  codeRows
    .slice(0, index)
    .reduce(
      (total, row) =>
        total + row.reduce((sum, segment) => sum + segment.text.length, 0) + 1,
      0,
    ),
);

const projectLabels: Record<(typeof projects)[number]["slug"], string> = {
  "amd-inference": "AMD inference",
  "coup-rl-bot": "Coup RL bot",
  "heston-regime-lab": "Heston regime lab",
};

const socialLinks = [
  {
    href: "https://x.com/austixu",
    label: "X",
    icon: FaXTwitter,
  },
  {
    href: "https://www.linkedin.com/in/axu25",
    label: "LinkedIn",
    icon: FaLinkedinIn,
  },
  {
    href: "https://github.com/austxu",
    label: "GitHub",
    icon: FaGithub,
  },
];

function ProfileSummary({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={mobile ? "profile-summary mobile-profile" : "profile-summary desktop-profile"}>
      <span className="profile-avatar" aria-hidden="true">AX</span>
      <p>Hello, it’s Austin <span aria-hidden="true">👋🏻</span></p>
      <nav className="profile-socials" aria-label="Austin Xu on social media">
        {socialLinks.map(({ href, label, icon: Icon }) => (
          <a
            href={href}
            aria-label={`${label} (opens in a new tab)`}
            key={label}
            rel="noreferrer"
            target="_blank"
            title={label}
          >
            <Icon aria-hidden="true" />
          </a>
        ))}
      </nav>
    </div>
  );
}

function ClockAndTheme({
  isDark,
  onToggle,
}: {
  isDark: boolean;
  onToggle: () => void;
}) {
  const [clock, setClock] = useState({ time: "LA time", date: "Pacific" });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock({
        time: new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "America/Los_Angeles",
        }).format(now),
        date: new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "America/Los_Angeles",
        }).format(now),
      });
    };

    updateClock();
    const timer = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="utility-cluster">
      <div className="clock-cluster" aria-label={`Los Angeles time ${clock.time}, ${clock.date}`}>
        <span className="clock-time">
          <LuMoon aria-hidden="true" />
          {clock.time}
        </span>
        <span className="clock-date">{clock.date}</span>
      </div>
      <div className="theme-control">
        <button
          className="theme-track"
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label={`Use ${isDark ? "light" : "dark"} theme`}
          onClick={onToggle}
        >
          <span className="theme-thumb" />
        </button>
        <span>{isDark ? "Dark" : "Light"}</span>
      </div>
    </div>
  );
}

function CodePanel() {
  const [typedCharacters, setTypedCharacters] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const immediate = window.setTimeout(
        () => setTypedCharacters(totalCodeCharacters),
        0,
      );
      return () => window.clearTimeout(immediate);
    }

    let animationFrame = 0;
    const delay = window.setTimeout(() => {
      const startTime = performance.now();
      const typeNextCharacters = (time: number) => {
        const nextCount = Math.min(
          totalCodeCharacters,
          Math.floor((time - startTime) / 18),
        );
        setTypedCharacters(nextCount);

        if (nextCount < totalCodeCharacters) {
          animationFrame = window.requestAnimationFrame(typeNextCharacters);
        }
      };

      animationFrame = window.requestAnimationFrame(typeNextCharacters);
    }, 800);

    return () => {
      window.clearTimeout(delay);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const scrollArea = scrollRef.current;
    if (scrollArea) {
      const currentRow = codeRowStarts.findLastIndex(
        (start) => start <= typedCharacters,
      );
      const currentLineBottom = 20 + (currentRow + 1) * 20;
      scrollArea.scrollTop = Math.max(
        0,
        currentLineBottom - scrollArea.clientHeight + 20,
      );
    }
  }, [typedCharacters]);

  return (
    <section
      className="panel-frame"
      data-panel="code"
      aria-labelledby="code-panel-title"
    >
      <h1 className="sr-only" id="code-panel-title">
        Austin Xu, researcher and engineer
      </h1>
      <p className="sr-only">
        Austin builds systems and experiments across inference, agents, and
        uncertain markets at StarAI, UCLA.
      </p>
      <pre className="sr-only">{fullCode}</pre>
      <div className="tool-panel code-panel" aria-hidden="true">
        <div className="code-scroll" ref={scrollRef}>
          <div className="line-numbers">
            {codeRows.map((_, index) => (
              <span
                className={codeRowStarts[index] <= typedCharacters ? "line-number-visible" : undefined}
                key={index}
              >
                {index + 1}
              </span>
            ))}
          </div>
          <pre className="code-body">
            <code>
              {codeRows.map((row, rowIndex) => {
                const rowStart = codeRowStarts[rowIndex];
                const rowLength = row.reduce((sum, segment) => sum + segment.text.length, 0);
                const visibleInRow = Math.max(
                  0,
                  Math.min(rowLength, typedCharacters - rowStart),
                );
                const isCaretRow =
                  typedCharacters >= rowStart &&
                  typedCharacters <= rowStart + rowLength &&
                  typedCharacters < totalCodeCharacters;
                let segmentStart = 0;

                return (
                  <span className="code-line" key={rowIndex}>
                    {row.map((segment, segmentIndex) => {
                      const visibleText = segment.text.slice(
                        0,
                        Math.max(0, visibleInRow - segmentStart),
                      );
                      segmentStart += segment.text.length;
                      return (
                        <span
                          className={segment.tone ? `syntax-${segment.tone}` : undefined}
                          key={segmentIndex}
                        >
                          {visibleText}
                        </span>
                      );
                    })}
                    {isCaretRow ? <span className="code-caret" /> : null}
                    {"\n"}
                  </span>
                );
              })}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}

function SkillsPanel() {
  return (
    <section
      className="panel-frame"
      data-panel="skills"
      aria-labelledby="skills-panel-title"
    >
      <h2 className="sr-only" id="skills-panel-title">Technical focus areas</h2>
      <div className="tool-panel skills-panel">
        <PhysicsSkillCloud />
      </div>
    </section>
  );
}

function MapPanel() {
  return (
    <section
      className="panel-frame"
      data-panel="map"
      aria-labelledby="map-panel-title"
    >
      <h2 className="sr-only" id="map-panel-title">Based in Los Angeles, California</h2>
      <div className="tool-panel map-panel">
        <InteractiveWorldMap className="interactive-dot-map" />
        <button
          className="location-marker"
          type="button"
          aria-describedby="location-tooltip"
          aria-label="Based in Los Angeles, California"
        >
          <span className="location-ping" />
          <span className="location-halo" />
          <span className="location-core" />
        </button>
        <div className="location-tooltip" id="location-tooltip" role="tooltip">
          <span aria-hidden="true">🇺🇸</span>
          <strong>Based in Los Angeles, CA</strong>
          <p>Researching at StarAI, UCLA. Coffee is always a good idea.</p>
        </div>
      </div>
    </section>
  );
}

function ProjectsPanel() {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const toggleProjects = () => setProjectsOpen((open) => !open);

  return (
    <section
      className="panel-frame"
      data-panel="projects"
      data-open={projectsOpen ? "true" : "false"}
      aria-labelledby="projects-panel-title"
    >
      <div className="tool-panel projects-panel">
        <div className="project-utility-rail">
          <button
            className="bear-access-button"
            type="button"
            aria-expanded={projectsOpen}
            aria-controls="project-drawer"
            aria-label={projectsOpen ? "Hide project links" : "Boop the bear to reveal project links"}
            onClick={toggleProjects}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleProjects();
              }
            }}
          >
            <Image
              className="access-bear"
              src="/bear-cameo-reencoded.png"
              alt=""
              width={460}
              height={460}
              priority
              unoptimized
            />
          </button>
        </div>
        <div className="project-panel-content">
          <div className="project-closed-state" aria-hidden={projectsOpen}>
            <div className="project-form-fields">
              <p className="project-label" id="projects-panel-title">My projects</p>
              <button
                className="archive-trigger"
                type="button"
                aria-expanded={projectsOpen}
                aria-controls="project-drawer"
                tabIndex={projectsOpen ? -1 : undefined}
                onClick={toggleProjects}
              >
                <span aria-hidden="true">⌘</span>
                <span>Boop to browse</span>
              </button>
              <p className="project-note">
                Three public systems case studies. Open to everyone.
              </p>
            </div>
            <Link className="skeuo-button" href="/projects" tabIndex={projectsOpen ? -1 : undefined}>
              View projects
            </Link>
          </div>

          <div
            className="project-drawer"
            id="project-drawer"
            aria-hidden={!projectsOpen}
          >
            <div className="project-drawer-heading">
              <p>Public projects</p>
              <button type="button" onClick={toggleProjects}>Close</button>
            </div>
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
            <Link className="archive-all-link" href="/projects" tabIndex={projectsOpen ? undefined : -1}>
              All projects <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {projectsOpen ? "Projects revealed. Three public case-study links are now available." : ""}
      </p>
    </section>
  );
}

export function PortfolioDashboard() {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className="portfolio-shell" data-theme={isDark ? "dark" : "light"}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="portfolio-header">
        <div className="portfolio-header-inner">
          <ProfileSummary />
          <ClockAndTheme isDark={isDark} onToggle={() => setIsDark((dark) => !dark)} />
        </div>
      </header>

      <main className="portfolio-main" id="main-content">
        <ProfileSummary mobile />
        <div className="mitchell-grid" id="dashboard-grid">
          <CodePanel />
          <SkillsPanel />
          <MapPanel />
          <ProjectsPanel />
        </div>
      </main>

      <PrimaryDock />
    </div>
  );
}
