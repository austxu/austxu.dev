"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function ForestLanding() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    if (reducedMotion.matches || !finePointer.matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      frame = 0;
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      scene.style.setProperty("--pointer-x", currentX.toFixed(3));
      scene.style.setProperty("--pointer-y", currentY.toFixed(3));
      if (Math.abs(targetX - currentX) > 0.002 || Math.abs(targetY - currentY) > 0.002) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    scene.addEventListener("pointermove", onPointerMove, { passive: true });
    scene.addEventListener("pointerleave", onPointerLeave, { passive: true });
    return () => {
      scene.removeEventListener("pointermove", onPointerMove);
      scene.removeEventListener("pointerleave", onPointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main className="forest-page" id="main-content">
      <a className="skip-link forest-skip-link" href="#forest-entry">Skip to the Home link</a>
      <div className="forest-scene" ref={sceneRef} aria-hidden="true">
        <Image className="forest-plate" src="/forest-hero.webp" alt="" fill priority sizes="100vw" />
        <div className="forest-color-wash" />
        <div className="forest-mist forest-mist-back" />
        <div className="forest-mist forest-mist-front" />
        <div className="forest-foliage forest-foliage-back" />
        <div className="forest-foliage forest-foliage-front" />
        <span className="forest-firefly firefly-one" />
        <span className="forest-firefly firefly-two" />
        <span className="forest-firefly firefly-three" />
        <span className="forest-firefly firefly-four" />
        <div className="forest-vignette" />
      </div>

      <div className="forest-brand">
        <span className="forest-brand-kicker">Austin Xu / field notes</span>
        <span className="forest-brand-title">Austin&apos;s Portfolio</span>
      </div>

      <div className="forest-instruction" aria-hidden="true">
        <span>01</span>
        <span>follow the bear / enter</span>
      </div>

      <Link
        id="forest-entry"
        className="forest-bear-link"
        href="/about"
        aria-label="Home — open Austin's About page"
      >
        <span className="forest-bear-entry">
          <span className="forest-bear-wander">
            <span className="forest-bear-art">
              <Image src="/bear-cameo.png" alt="" width={460} height={460} priority />
            </span>
            <span className="forest-home-tag">HOME <span aria-hidden="true">↗</span></span>
          </span>
        </span>
      </Link>

      <div className="forest-footer" aria-hidden="true">
        <span>Los Angeles / UTC−07</span>
        <span>Research × systems × play</span>
      </div>
    </main>
  );
}
