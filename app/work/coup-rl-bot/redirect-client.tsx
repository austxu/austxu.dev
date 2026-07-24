"use client";

import { useEffect } from "react";

const COUP_URL = "https://coup.austxu.dev";

export default function CoupRedirect() {
  useEffect(() => {
    window.location.replace(COUP_URL);
  }, []);

  return (
    <div className="redirect-card" role="status" aria-live="polite">
      <p className="eyebrow">production / Gen5 1v1</p>
      <h2>Opening the bot…</h2>
      <p>If the redirect does not happen, use the button below.</p>
      <a className="button button-primary" href={COUP_URL}>
        Open Coup <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
