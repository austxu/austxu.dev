"use client";

import { useEffect, useRef, useState } from "react";

interface EmbeddedLabProps {
  url: string;
  eyebrow: string;
  meta: string;
  title: string;
}

export default function EmbeddedLab({ url, eyebrow, meta, title }: EmbeddedLabProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const syncFullscreen = () => setFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  async function toggleFullscreen() {
    if (!frameRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await frameRef.current.requestFullscreen();
    }
  }

  return (
    <section className="lab-embed" aria-labelledby="embedded-lab-title">
      <div className="lab-embed-toolbar">
        <div>
          <p id="embedded-lab-title" className="eyebrow">{eyebrow}</p>
          <p className="lab-embed-meta">{meta}</p>
        </div>
        <div className="lab-embed-actions">
          <button type="button" className="embed-control" onClick={() => void toggleFullscreen()}>
            {fullscreen ? "Exit fullscreen" : "Fullscreen"}
          </button>
          <a className="embed-control embed-control-link" href={url} target="_blank" rel="noreferrer">
            Open full tab <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div ref={frameRef} className="lab-embed-frame">
        <iframe
          title={title}
          src={url}
          allow="fullscreen"
          allowFullScreen
        />
      </div>
    </section>
  );
}
