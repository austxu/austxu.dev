import type { Metadata } from "next";
import Link from "next/link";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { PageFrame } from "../components/page-frame";

export const metadata: Metadata = { title: "About", description: "About Austin Xu and his research across inference, deception, and volatility." };

export default function About() {
  return (
    <PageFrame
      eyebrow="~/about"
      title="About Austin."
      intro="I work at the seam between research and the systems that make research observable: kernels, agents, interfaces, and the small details that decide whether a result can travel."
    >
      <div className="page-body-copy">
        <h2>Three recurring questions</h2>
        <p>
          <strong>Can the path be faster?</strong> I like the layer where an
          abstract model meets memory traffic, a kernel, or a consumer GPU that
          has to do more with less.
        </p>
        <p>
          <strong>What is hidden?</strong> Agents need to reason about actions
          that are not fully observable. The interface should make that
          uncertainty legible, not decorate it away.
        </p>
        <p>
          <strong>What changed?</strong> A volatility surface is useful when it
          reveals a regime shift. A benchmark is useful when it keeps the
          failed comparison in the frame.
        </p>
        <h2>Now</h2>
        <p>
          Researcher at StarAI, UCLA. Currently circling GPU inference,
          strategic deception, and uncertain systems.
        </p>
        <div className="about-contact-row">
          <Link className="text-link" href="mailto:austinxu@ucla.edu">
            austinxu@ucla.edu <span aria-hidden="true">↗</span>
          </Link>
          <nav className="about-social-links" aria-label="Austin on social media">
            <a
              href="https://github.com/austxu"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <FaGithub aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/axu25"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn aria-hidden="true" />
            </a>
            <a
              href="https://x.com/austixu"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
            >
              <FaXTwitter aria-hidden="true" />
            </a>
          </nav>
        </div>
      </div>
    </PageFrame>
  );
}
