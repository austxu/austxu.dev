import Link from "next/link";
import { ChapterVisual } from "./components/chapter-visual";
import { SiteShell } from "./components/site-shell";
import { projects } from "./data/projects";

export default function Home() {
  return (
    <SiteShell>
      <main>
        <section className="hero section-grid" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> Austin Xu / field notes 01—04</p>
            <h1 id="hero-title">I chase the edge cases where <em>models</em> meet machines and markets.</h1>
            <p className="hero-deck">Austin Xu is a researcher at StarAI, UCLA, building faster inference paths, bluffing agents, and tools for uncertain systems.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="#work">Explore the work <span aria-hidden="true">↘</span></Link>
              <Link className="text-link" href="/work/amd-inference">Read the AMD story <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <div className="hero-orbit" aria-label="A visual index of inference, deception, and volatility">
            <div className="orbit-grid" />
            <div className="orbit-ring orbit-ring-one" />
            <div className="orbit-ring orbit-ring-two" />
            <div className="orbit-core"><span>uncertainty</span><strong>∞</strong></div>
            <span className="orbit-label orbit-label-top">01 / inference</span>
            <span className="orbit-label orbit-label-right">02 / deception</span>
            <span className="orbit-label orbit-label-bottom">03 / volatility</span>
            <span className="orbit-axis axis-x" /><span className="orbit-axis axis-y" />
          </div>
          <div className="hero-meta"><span>Los Angeles / UTC−07</span><span>Research × systems × play</span></div>
        </section>

        <section className="signal-strip" aria-label="Selected audited signal">
          <span className="signal-label">Signal / audited</span>
          <strong>+3.095%</strong>
          <span>geometric mean decode gain on an RX 6700 XT</span>
          <Link href="/work/amd-inference">trace the evidence <span aria-hidden="true">↗</span></Link>
        </section>

        <section id="work" className="chapters" aria-labelledby="chapters-title">
          <div className="section-intro section-grid">
            <p className="eyebrow">Selected work / three technical worlds</p>
            <h2 id="chapters-title">Small systems, sharp edges.</h2>
            <p>Each project starts with a constraint: a consumer GPU, hidden information, or a market that changes its mind.</p>
          </div>

          <Chapter
            index="01"
            id="amd"
            label="GPU inference / 2025"
            question="What happens when a consumer GPU becomes an inference laboratory?"
            title="Three percent, honestly."
            body="A Vulkan decode investigation on an RX 6700 XT, where the result is less a record than a repeatable hot-loop improvement with its failure modes intact."
            project={projects[0]}
            visual={<ChapterVisual kind="amd" />}
          />
          <Chapter
            index="02"
            id="coup"
            label="Strategic deception / Gen5"
            question="Can an agent learn when to bluff?"
            title="The tell is in the timing."
            body="A playable 1v1 Coup bot trained to make decisions with incomplete information, pressure, and a very small action space."
            project={projects[1]}
            visual={<ChapterVisual kind="coup" />}
          />
          <Chapter
            index="03"
            id="heston"
            label="Market volatility / research demo"
            question="Reading volatility as a regime, not a number."
            title="A surface that changes its mind."
            body="A live calibration lab for Heston-style dynamics, designed to make parameter uncertainty legible before it becomes a chart."
            project={projects[2]}
            visual={<ChapterVisual kind="heston" />}
          />
        </section>

        <section className="afterglow section-grid" aria-labelledby="afterglow-title">
          <div>
            <p className="eyebrow">Working principle</p>
            <h2 id="afterglow-title">Make the uncertainty inspectable.</h2>
          </div>
          <div className="afterglow-copy">
            <p>Benchmarks are arguments. Interfaces are arguments too. I build the instrument panel alongside the experiment so someone else can see what moved, what held, and what did not survive contact with reality.</p>
            <Link className="text-link" href="/about">A little more context <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        <section className="contact-panel section-grid" aria-labelledby="contact-title">
          <p className="eyebrow">Open channel / 04</p>
          <h2 id="contact-title">Have a strange system<br /><em>worth looking at?</em></h2>
          <div className="contact-row">
            <a className="button button-light" href="mailto:austinxu@ucla.edu">austinxu@ucla.edu <span aria-hidden="true">↗</span></a>
            <a className="text-link text-link-light" href="https://github.com/austxu" target="_blank" rel="noreferrer">github.com/austxu <span aria-hidden="true">↗</span></a>
          </div>
          <p className="colophon">The bear is a personal reference, not a logo. No IKEA affiliation.</p>
        </section>
      </main>
    </SiteShell>
  );
}

function Chapter({ index, id, label, question, title, body, project, visual }: {
  index: string;
  id: string;
  label: string;
  question: string;
  title: string;
  body: string;
  project: (typeof projects)[number];
  visual: React.ReactNode;
}) {
  return (
    <article id={id} className={`chapter chapter-${id} section-grid`}>
      <div className="chapter-copy">
        <p className="chapter-index">{index} <span>/</span> {label}</p>
        <p className="chapter-question">{question}</p>
        <h3>{title}</h3>
        <p className="chapter-body">{body}</p>
        <div className="chapter-footer">
          <span className={`accent-bar accent-${project.accent}`} />
          <Link className="text-link" href={`/work/${project.slug}`}>Open case study <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className="chapter-visual">{visual}</div>
    </article>
  );
}
