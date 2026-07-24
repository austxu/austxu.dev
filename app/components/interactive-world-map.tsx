"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import worldMapData from "../../public/data/world-map-dots.json";

const MAP_WIDTH = 1024;
const MAP_HEIGHT = 488;
const MAX_DEVICE_PIXEL_RATIO = 2;
const REPULSION_RADIUS = 68;
const REPULSION_STRENGTH = 1.5;
const SPRING_STRENGTH = 0.085;
const DAMPING = 0.8;
const REST_THRESHOLD = 0.04;

type ParticleField = {
  originX: Float32Array;
  originY: Float32Array;
  x: Float32Array;
  y: Float32Array;
  velocityX: Float32Array;
  velocityY: Float32Array;
  radius: number;
  count: number;
};

export type InteractiveWorldMapProps = {
  className?: string;
  dotColor?: string;
  style?: CSSProperties;
  ariaHidden?: boolean;
};

export function InteractiveWorldMap({
  className,
  dotColor = "var(--shell-border-strong)",
  style,
  ariaHidden = true,
}: InteractiveWorldMapProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const syncMotionPreference = () => {
      const enabled = !motionQuery.matches;
      setMotionEnabled(enabled);

      if (!enabled) {
        setCanvasReady(false);
      }
    };

    syncMotionPreference();
    motionQuery.addEventListener("change", syncMotionPreference);

    return () => {
      motionQuery.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (!motionEnabled) {
      return;
    }

    const root = rootRef.current;
    const fallback = fallbackRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!root || !fallback || !canvas || !context) {
      return;
    }

    const scaleX = MAP_WIDTH / worldMapData.w;
    const scaleY = MAP_HEIGHT / worldMapData.h;
    const count = Math.floor(worldMapData.dots.length / 2);
    const originX = new Float32Array(count);
    const originY = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      originX[index] = worldMapData.dots[index * 2] * scaleX;
      originY[index] = worldMapData.dots[index * 2 + 1] * scaleY;
    }

    const particles: ParticleField = {
      originX,
      originY,
      x: originX.slice(),
      y: originY.slice(),
      velocityX: new Float32Array(count),
      velocityY: new Float32Array(count),
      radius: worldMapData.r * ((scaleX + scaleY) / 2),
      count,
    };
    const pointer = { x: 0, y: 0, active: false };
    let fillColor = "#d5d7da";
    let animationFrame = 0;
    let active = true;

    const syncCanvasResolution = () => {
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        MAX_DEVICE_PIXEL_RATIO,
      );
      const pixelWidth = Math.round(MAP_WIDTH * pixelRatio);
      const pixelHeight = Math.round(MAP_HEIGHT * pixelRatio);

      if (
        canvas.width !== pixelWidth ||
        canvas.height !== pixelHeight
      ) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const syncFillColor = () => {
      const resolvedColor = getComputedStyle(fallback).backgroundColor;

      if (
        resolvedColor &&
        resolvedColor !== "rgba(0, 0, 0, 0)" &&
        resolvedColor !== "transparent"
      ) {
        fillColor = resolvedColor;
      }
    };

    const draw = () => {
      context.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
      context.fillStyle = fillColor;
      context.beginPath();

      for (let index = 0; index < particles.count; index += 1) {
        context.moveTo(
          particles.x[index] + particles.radius,
          particles.y[index],
        );
        context.arc(
          particles.x[index],
          particles.y[index],
          particles.radius,
          0,
          Math.PI * 2,
        );
      }

      context.fill();
    };

    const animate = () => {
      if (!active) {
        animationFrame = 0;
        return;
      }

      let maximumMotion = 0;

      for (let index = 0; index < particles.count; index += 1) {
        if (pointer.active) {
          const deltaX = particles.x[index] - pointer.x;
          const deltaY = particles.y[index] - pointer.y;
          const distanceSquared =
            deltaX * deltaX + deltaY * deltaY;

          if (
            distanceSquared <
              REPULSION_RADIUS * REPULSION_RADIUS &&
            distanceSquared > 0.0001
          ) {
            const distance = Math.sqrt(distanceSquared);
            const repulsion =
              (1 - distance / REPULSION_RADIUS) *
              REPULSION_STRENGTH;
            particles.velocityX[index] +=
              (deltaX / distance) * repulsion;
            particles.velocityY[index] +=
              (deltaY / distance) * repulsion;
          }
        }

        particles.velocityX[index] =
          (particles.velocityX[index] +
            (particles.originX[index] - particles.x[index]) *
              SPRING_STRENGTH) *
          DAMPING;
        particles.velocityY[index] =
          (particles.velocityY[index] +
            (particles.originY[index] - particles.y[index]) *
              SPRING_STRENGTH) *
          DAMPING;
        particles.x[index] += particles.velocityX[index];
        particles.y[index] += particles.velocityY[index];

        const motion =
          Math.abs(particles.velocityX[index]) +
          Math.abs(particles.velocityY[index]) +
          Math.abs(particles.originX[index] - particles.x[index]) +
          Math.abs(particles.originY[index] - particles.y[index]);

        maximumMotion = Math.max(maximumMotion, motion);
      }

      draw();
      animationFrame =
        pointer.active || maximumMotion > REST_THRESHOLD
          ? window.requestAnimationFrame(animate)
          : 0;
    };

    const startAnimation = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect();

      if (!bounds.width || !bounds.height) {
        return;
      }

      pointer.x =
        ((event.clientX - bounds.left) / bounds.width) * MAP_WIDTH;
      pointer.y =
        ((event.clientY - bounds.top) / bounds.height) *
        MAP_HEIGHT;
      pointer.active = true;
      startAnimation();
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      startAnimation();
    };

    const refreshCanvas = () => {
      if (!active) {
        return;
      }

      syncCanvasResolution();
      syncFillColor();
      draw();
    };

    syncCanvasResolution();
    syncFillColor();
    draw();
    setCanvasReady(true);

    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerleave", handlePointerLeave);
    root.addEventListener("pointercancel", handlePointerLeave);
    window.addEventListener("resize", refreshCanvas);
    window.addEventListener("themechange", refreshCanvas);
    window.addEventListener("storage", refreshCanvas);

    const resizeObserver = new ResizeObserver(refreshCanvas);
    resizeObserver.observe(root);

    const themeRoot =
      root.closest("[data-theme]") ?? document.documentElement;
    const themeObserver = new MutationObserver(refreshCanvas);
    themeObserver.observe(themeRoot, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    return () => {
      active = false;
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", handlePointerLeave);
      root.removeEventListener("pointercancel", handlePointerLeave);
      window.removeEventListener("resize", refreshCanvas);
      window.removeEventListener("themechange", refreshCanvas);
      window.removeEventListener("storage", refreshCanvas);
      resizeObserver.disconnect();
      themeObserver.disconnect();
    };
  }, [dotColor, motionEnabled]);

  return (
    <div
      className={className}
      aria-hidden={ariaHidden}
      style={{
        width: MAP_WIDTH,
        height: MAP_HEIGHT,
        ...style,
      }}
    >
      <div
        ref={rootRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          ref={fallbackRef}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: dotColor,
            WebkitMaskImage: "url('/world-map-dots.png')",
            maskImage: "url('/world-map-dots.png')",
            WebkitMaskPosition: "0 0",
            maskPosition: "0 0",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            opacity: canvasReady ? 0 : 1,
          }}
        />
        <canvas
          ref={canvasRef}
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: canvasReady ? 1 : 0,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
