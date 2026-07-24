"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const skillItems = [
  { label: "Inference Systems", hue: "#ee46bc" },
  { label: "GPU Kernels", hue: "#7a5af8" },
  { label: "Reinforcement Learning", hue: "#ef6820" },
  { label: "Agent Evaluation", hue: "#2e90fa" },
  { label: "Uncertainty", hue: "#17b26a" },
  { label: "Data Visualization", hue: "#7f56d9" },
  { label: "C++ / ROCm", hue: "#0ba5ec" },
  { label: "Python", hue: "#f63d68" },
  { label: "Market Models", hue: "#15b79e" },
  { label: "Research Design", hue: "#f79009" },
] as const;

type ChipSize = {
  width: number;
  height: number;
};

type ChipStyle = CSSProperties & {
  "--skill-hue": string;
};

function positionWrappedRows(
  container: HTMLDivElement,
  chips: HTMLDivElement[],
  sizes: ChipSize[],
) {
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const rows: number[][] = [[]];
  let rowWidth = 0;

  sizes.forEach((size, index) => {
    const currentRow = rows[rows.length - 1];

    if (
      rowWidth + size.width + 8 > containerWidth - 24 &&
      currentRow.length > 0
    ) {
      rows.push([]);
      rowWidth = 0;
    }

    rows[rows.length - 1].push(index);
    rowWidth += size.width + 8;
  });

  const rowHeight = (sizes[0]?.height ?? 30) + 8;
  let y = containerHeight - rows.length * rowHeight - 8;

  rows.forEach((row) => {
    const occupiedWidth = row.reduce(
      (total, index) => total + sizes[index].width + 8,
      -8,
    );
    let x = (containerWidth - occupiedWidth) / 2;

    row.forEach((index) => {
      chips[index].style.transform = `translate(${x}px, ${y}px)`;
      x += sizes[index].width + 8;
    });

    y += rowHeight;
  });
}

export function PhysicsSkillCloud() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const chips = chipRefs.current.filter(
      (chip): chip is HTMLDivElement => chip !== null,
    );

    if (!container || chips.length !== skillItems.length) {
      return;
    }

    let cancelled = false;
    let animationFrame = 0;
    const cleanupTasks: Array<() => void> = [];

    const reveal = () => {
      animationFrame = window.requestAnimationFrame(() => {
        if (!cancelled) {
          setIsReady(true);
        }
      });
    };

    const measureChips = (): ChipSize[] =>
      chips.map((chip) => ({
        width: chip.offsetWidth || 96,
        height: chip.offsetHeight || 30,
      }));

    const positionWrappedFallback = () => {
      let sizes = measureChips();
      const layout = () => {
        sizes = measureChips();
        positionWrappedRows(container, chips, sizes);
      };

      layout();
      reveal();

      const resizeObserver = new ResizeObserver(layout);
      resizeObserver.observe(container);
      cleanupTasks.push(() => resizeObserver.disconnect());
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      positionWrappedFallback();

      return () => {
        cancelled = true;
        window.cancelAnimationFrame(animationFrame);
        cleanupTasks.forEach((cleanup) => cleanup());
      };
    }

    void (async () => {
      let Matter: typeof import("matter-js");

      try {
        Matter = (await import("matter-js")).default;
      } catch {
        if (!cancelled) {
          positionWrappedFallback();
        }
        return;
      }

      if (cancelled) {
        return;
      }

      const {
        Bodies,
        Body,
        Composite,
        Constraint,
        Engine,
        Sleeping,
      } = Matter;

      if (document.fonts?.status === "loading") {
        try {
          await document.fonts.ready;
        } catch {
          // The measured fallback dimensions below remain usable.
        }

        if (cancelled) {
          return;
        }
      }

      for (
        let attempt = 0;
        (container.clientWidth < 1 || container.clientHeight < 1) &&
        attempt < 90;
        attempt += 1
      ) {
        await new Promise<void>((resolve) => {
          window.requestAnimationFrame(() => resolve());
        });

        if (cancelled) {
          return;
        }
      }

      const sizes = measureChips();
      let containerWidth =
        container.clientWidth || container.offsetWidth || 1;
      let containerHeight =
        container.clientHeight || container.offsetHeight || 1;
      const engine = Engine.create();

      engine.gravity.y = 1;
      engine.enableSleeping = false;

      const createBoundaries = () => [
        Bodies.rectangle(
          containerWidth / 2,
          containerHeight + 80,
          containerWidth + 400,
          160,
          { isStatic: true },
        ),
        Bodies.rectangle(-80, containerHeight / 2, 160, 4 * containerHeight, {
          isStatic: true,
        }),
        Bodies.rectangle(
          containerWidth + 80,
          containerHeight / 2,
          160,
          4 * containerHeight,
          { isStatic: true },
        ),
      ];

      let boundaries = createBoundaries();
      Composite.add(engine.world, boundaries);

      const bodies = sizes.map((size, index) => {
        const x =
          24 + Math.random() * Math.max(1, containerWidth - 48);
        const body = Bodies.rectangle(
          x,
          -40 - 52 * index,
          size.width,
          size.height,
          {
            angle: (Math.random() - 0.5) * 0.6,
            chamfer: { radius: size.height / 2 },
            friction: 0.5,
            frictionAir: 0.012,
            frictionStatic: 0.6,
            restitution: 0.3,
          },
        );

        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.12);
        return body;
      });

      Composite.add(engine.world, bodies);

      const syncChipTransforms = () => {
        bodies.forEach((body, index) => {
          const size = sizes[index];
          chips[index].style.transform =
            `translate(${body.position.x - size.width / 2}px, ` +
            `${body.position.y - size.height / 2}px) rotate(${body.angle}rad)`;
        });
      };

      syncChipTransforms();
      setIsReady(true);

      let drag:
        | {
            body: Matter.Body;
            constraint: Matter.Constraint;
          }
        | null = null;
      let containmentEnabled = false;
      let simulationRunning = false;
      let previousFrameTime = 0;

      const runSimulation = (time: number) => {
        const delta = Math.min(time - previousFrameTime, 1000 / 30);
        previousFrameTime = time;

        bodies.forEach((body) => {
          const speed = Math.hypot(body.velocity.x, body.velocity.y);

          if (speed > 26) {
            Body.setVelocity(body, {
              x: (body.velocity.x / speed) * 26,
              y: (body.velocity.y / speed) * 26,
            });
          }
        });

        Engine.update(engine, delta);

        if (containmentEnabled) {
          bodies.forEach((body) => {
            const { bounds } = body;
            let correctionX = 0;
            let correctionY = 0;

            if (bounds.min.x < 0) {
              correctionX = -bounds.min.x;
            } else if (bounds.max.x > containerWidth) {
              correctionX = containerWidth - bounds.max.x;
            }

            if (bounds.min.y < 0) {
              correctionY = -bounds.min.y;
            } else if (bounds.max.y > containerHeight) {
              correctionY = containerHeight - bounds.max.y;
            }

            if (correctionX !== 0 || correctionY !== 0) {
              Body.translate(body, {
                x: correctionX,
                y: correctionY,
              });
              Body.setVelocity(body, {
                x: correctionX === 0 ? body.velocity.x : 0,
                y: correctionY === 0 ? body.velocity.y : 0,
              });
            }
          });
        }

        bodies.forEach((body) => {
          const { x, y } = body.position;

          if (
            y > containerHeight + 140 ||
            y < -700 ||
            x < -140 ||
            x > containerWidth + 140
          ) {
            Body.setPosition(body, {
              x: 20 + Math.random() * Math.max(1, containerWidth - 40),
              y: -40,
            });
            Body.setVelocity(body, { x: 0, y: 0 });
            Body.setAngularVelocity(body, 0);
          }
        });

        syncChipTransforms();

        if (!drag && bodies.every((body) => body.isSleeping)) {
          simulationRunning = false;
          return;
        }

        animationFrame = window.requestAnimationFrame(runSimulation);
      };

      const startSimulation = () => {
        if (!simulationRunning && !cancelled) {
          simulationRunning = true;
          previousFrameTime = performance.now();
          animationFrame = window.requestAnimationFrame(runSimulation);
        }
      };

      startSimulation();

      const sleepingTimer = window.setTimeout(() => {
        containmentEnabled = true;
        engine.enableSleeping = true;
        startSimulation();
      }, 3000);
      cleanupTasks.push(() => window.clearTimeout(sleepingTimer));

      let previousScrollY = window.scrollY;
      const handleScroll = () => {
        const nextScrollY = window.scrollY;
        const impulseY = Math.max(
          -4,
          Math.min(4, -(nextScrollY - previousScrollY) * 0.1),
        );
        previousScrollY = nextScrollY;

        if (Math.abs(impulseY) < 0.3) {
          return;
        }

        bodies.forEach((body) => {
          Sleeping.set(body, false);
          Body.setVelocity(body, {
            x: body.velocity.x + (Math.random() - 0.5) * 0.6,
            y: body.velocity.y + impulseY,
          });
          Body.setAngularVelocity(
            body,
            body.angularVelocity + (Math.random() - 0.5) * 0.02,
          );
        });
        startSimulation();
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      cleanupTasks.push(() =>
        window.removeEventListener("scroll", handleScroll),
      );

      const pointInContainer = (event: PointerEvent) => {
        const bounds = container.getBoundingClientRect();
        return {
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        };
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (!drag) {
          return;
        }

        drag.constraint.pointA = pointInContainer(event);
        Sleeping.set(drag.body, false);
      };

      const finishDrag = () => {
        if (!drag) {
          return;
        }

        Composite.remove(engine.world, drag.constraint);
        drag = null;
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", finishDrag);
      window.addEventListener("pointercancel", finishDrag);
      cleanupTasks.push(() => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", finishDrag);
        window.removeEventListener("pointercancel", finishDrag);
      });

      chips.forEach((chip, index) => {
        const handlePointerDown = (event: PointerEvent) => {
          finishDrag();

          const body = bodies[index];
          const point = pointInContainer(event);
          const constraint = Constraint.create({
            pointA: point,
            bodyB: body,
            pointB: {
              x: point.x - body.position.x,
              y: point.y - body.position.y,
            },
            stiffness: 0.16,
            damping: 0.18,
            length: 0,
          });

          Sleeping.set(body, false);
          Composite.add(engine.world, constraint);
          drag = { body, constraint };
          startSimulation();

          try {
            chip.setPointerCapture(event.pointerId);
          } catch {
            // Pointer capture is an enhancement; the window listeners still drag.
          }
        };

        chip.addEventListener("pointerdown", handlePointerDown);
        cleanupTasks.push(() =>
          chip.removeEventListener("pointerdown", handlePointerDown),
        );
      });

      const resizeObserver = new ResizeObserver(() => {
        const nextWidth = container.clientWidth;
        const nextHeight = container.clientHeight;

        if (
          nextWidth < 1 ||
          nextHeight < 1 ||
          (nextWidth === containerWidth && nextHeight === containerHeight)
        ) {
          return;
        }

        containerWidth = nextWidth;
        containerHeight = nextHeight;
        Composite.remove(engine.world, boundaries);
        boundaries = createBoundaries();
        Composite.add(engine.world, boundaries);
        bodies.forEach((body) => Sleeping.set(body, false));
        startSimulation();
      });

      resizeObserver.observe(container);
      cleanupTasks.push(() => resizeObserver.disconnect());
      cleanupTasks.push(() => {
        finishDrag();
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      });
    })();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
      cleanupTasks.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <>
      <ul className="sr-only">
        {skillItems.map((skill) => (
          <li key={skill.label}>{skill.label}</li>
        ))}
      </ul>
      <div
        ref={containerRef}
        className="physics-skill-cloud"
        data-ready={isReady ? "true" : "false"}
        aria-hidden="true"
      >
        {skillItems.map((skill, index) => (
          <div
            ref={(chip) => {
              chipRefs.current[index] = chip;
            }}
            className="physics-skill-cloud__chip"
            key={skill.label}
            style={
              {
                "--skill-hue": skill.hue,
              } as ChipStyle
            }
          >
            {skill.label}
          </div>
        ))}
      </div>
    </>
  );
}
