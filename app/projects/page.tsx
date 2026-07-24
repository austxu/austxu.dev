import type { Metadata } from "next";
import Link from "next/link";
import { ChapterVisual } from "../components/chapter-visual";
import { PageFrame } from "../components/page-frame";
import { projects } from "../data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected research projects by Austin Xu across inference, strategic deception, and volatility.",
  alternates: { canonical: "https://austxu.dev/projects" },
};

const visualKinds = {
  "amd-inference": "amd",
  "coup-rl-bot": "coup",
  "heston-regime-lab": "heston",
} as const;

export default function Projects() {
  return (
    <PageFrame
      eyebrow="Projects / selected field work"
      title={<>Small systems,<br /><em>sharp edges.</em></>}
      intro="Research projects across inference, hidden information, and volatility—built with the instrument panel alongside the experiment."
    >
      <div className="projects-list">
        {projects.map((project, index) => (
          <article className={`project-card project-card-${project.accent}`} key={project.slug}>
            <div className="project-card-copy">
              <p className="project-index">0{index + 1} <span>/</span> {project.status}</p>
              <h2>{project.hook}</h2>
              <p className="project-description">{project.description}</p>
              <div className="project-metrics">
                {project.metrics.map((metric) => <span key={metric}>{metric}</span>)}
              </div>
              <div className="project-card-footer">
                <Link className="button button-primary" href={`/work/${project.slug}`}>Open case study <span aria-hidden="true">↗</span></Link>
                {project.liveUrl ? <Link className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer">Open live demo <span aria-hidden="true">↗</span></Link> : null}
              </div>
              <div className="project-stack" aria-label={`${project.hook} technology stack`}>
                {project.stack.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>
            <div className="project-card-visual">
              <ChapterVisual kind={visualKinds[project.slug]} />
            </div>
          </article>
        ))}
      </div>
    </PageFrame>
  );
}
