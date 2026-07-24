"use client";

import { useEffect, useRef, useState } from "react";

const HESTON_URL = "https://heston.austxu.dev";

export default function EmbeddedLab() {
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
          <p id="embedded-lab-title" className="eyebrow">Production lab / embedded view</p>
          <p className="lab-embed-meta">heston.austxu.dev · live + synthetic provenance</p>
        </div>
        <div className="lab-embed-actions">
          <button type="button" className="embed-control" onClick={() => void toggleFullscreen()}>
            {fullscreen ? "Exit fullscreen" : "Fullscreen"}
          </button>
          <a className="embed-control embed-control-link" href={HESTON_URL} target="_blank" rel="noreferrer">
            Open full tab <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div ref={frameRef} className="lab-embed-frame">
        <iframe
          title="Heston regime lab"
          src={HESTON_URL}
          allow="fullscreen"
          allowFullScreen
        />
      </div>
    </section>
  );
}
