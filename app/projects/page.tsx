import type { Metadata } from "next";
import Link from "next/link";
import { PageFrame } from "../components/page-frame";
import { projects } from "../data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Public case studies from Austin Xu across inference, strategic deception, and market volatility.",
};

const projectNames: Record<(typeof projects)[number]["slug"], string> = {
  "amd-inference": "AMD inference",
  "coup-rl-bot": "Coup RL bot",
  "heston-regime-lab": "Heston regime lab",
};

export default function Projects() {
  return (
    <PageFrame
      eyebrow="Projects / public archive"
      title={
        <>
          Research you can
          <br />
          <em>look inside.</em>
        </>
      }
      intro="Three public case studies about making performance, hidden information, and changing regimes easier to inspect."
    >
      <section className="page-link-grid" aria-label="Project case studies">
        {projects.map((project) => {
          const name = projectNames[project.slug];
          const titleId = `project-${project.slug}-title`;

          return (
            <article
              className="page-link-card"
              key={project.slug}
              aria-labelledby={titleId}
            >
              <div>
                <p className="eyebrow">Status / {project.status}</p>
                <h2 id={titleId}>{project.hook}</h2>
                <p>{project.description}</p>
              </div>

              <div>
                <p className="eyebrow">
                  Stack / {project.stack.join(" / ")}
                </p>
                <div className="hero-actions">
                  <Link
                    className="text-link"
                    href={`/work/${project.slug}`}
                    aria-label={`Read the ${name} case study`}
                  >
                    Case study <span aria-hidden="true">↗</span>
                  </Link>
                  {project.liveUrl ? (
                    <a
                      className="text-link"
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open the live ${name} demo in a new tab`}
                    >
                      Live demo <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </PageFrame>
  );
}
