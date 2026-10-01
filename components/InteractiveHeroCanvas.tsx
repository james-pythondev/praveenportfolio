"use client";

import { useRef, useCallback, useEffect } from "react";

export default function InteractiveHeroCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const timeRef = useRef(0);

  const createParticles = useCallback((w, h) => {
    const particles = [];
    const count = Math.min(Math.floor((w * h) / 18000), 60);
    for (let i = 0; i < count; i++) {
      const type = Math.random();
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        baseX: Math.random() * w,
        baseY: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: type < 0.3 ? Math.random() * 3 + 1 : (type < 0.6 ? Math.random() * 18 + 8 : Math.random() * 40 + 20),
        opacity: Math.random() * 0.15 + 0.03,
        baseOpacity: Math.random() * 0.15 + 0.03,
        type: type < 0.3 ? "dot" : (type < 0.5 ? "ring" : (type < 0.7 ? "line" : (type < 0.85 ? "aperture" : "cross"))),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        phase: Math.random() * Math.PI * 2,
        driftRadius: Math.random() * 30 + 10,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = createParticles(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const drawAperture = (ctx, x, y, size, rotation) => {
      const blades = 6;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      for (let i = 0; i < blades; i++) {
        const angle = (i / blades) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * size * 0.4, Math.sin(angle) * size * 0.4, size * 0.5, angle - 0.5, angle + 0.5);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawCross = (ctx, x, y, size, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      ctx.lineTo(size, 0);
      ctx.moveTo(0, -size);
      ctx.lineTo(0, size);
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      timeRef.current += 0.008;
      const t = timeRef.current;
      ctx.clearRect(0, 0, w, h);

      // Subtle animated gradient background
      const g = ctx.createRadialGradient(
        w * 0.5 + Math.sin(t * 0.3) * w * 0.15,
        h * 0.5 + Math.cos(t * 0.4) * h * 0.15,
        0,
        w * 0.5, h * 0.5, w * 0.8
      );
      g.addColorStop(0, "rgba(240, 235, 225, 0.5)");
      g.addColorStop(0.5, "rgba(245, 240, 232, 0.2)");
      g.addColorStop(1, "rgba(250, 250, 248, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particlesRef.current.forEach((p) => {
        // Organic drift
        p.x = p.baseX + Math.sin(t + p.phase) * p.driftRadius;
        p.y = p.baseY + Math.cos(t * 0.7 + p.phase) * p.driftRadius;

        // Base movement
        p.baseX += p.vx;
        p.baseY += p.vy;

        // Wrap around
        if (p.baseX < -50) p.baseX = w + 50;
        if (p.baseX > w + 50) p.baseX = -50;
        if (p.baseY < -50) p.baseY = h + 50;
        if (p.baseY > h + 50) p.baseY = -50;

        p.rotation += p.rotationSpeed;

        // Mouse interaction — magnetic glow and push
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 200;
        let pushX = 0, pushY = 0;
        let glowBoost = 0;

        if (dist < interactionRadius && mx > 0) {
          const force = (1 - dist / interactionRadius);
          pushX = (dx / dist) * force * 40;
          pushY = (dy / dist) * force * 40;
          glowBoost = force * 0.35;
        }

        const drawX = p.x + pushX;
        const drawY = p.y + pushY;
        const finalOpacity = Math.min(p.baseOpacity + glowBoost, 0.6);

        ctx.strokeStyle = `rgba(26, 26, 24, ${finalOpacity})`;
        ctx.fillStyle = `rgba(26, 26, 24, ${finalOpacity})`;
        ctx.lineWidth = 0.5;

        if (p.type === "dot") {
          ctx.beginPath();
          ctx.arc(drawX, drawY, p.size + glowBoost * 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "ring") {
          ctx.beginPath();
          ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
          ctx.stroke();
          if (glowBoost > 0.1) {
            ctx.strokeStyle = `rgba(26, 26, 24, ${glowBoost * 0.3})`;
            ctx.beginPath();
            ctx.arc(drawX, drawY, p.size + 4, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else if (p.type === "line") {
          ctx.save();
          ctx.translate(drawX, drawY);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          ctx.moveTo(-p.size / 2, 0);
          ctx.lineTo(p.size / 2, 0);
          ctx.stroke();
          ctx.restore();
        } else if (p.type === "aperture") {
          drawAperture(ctx, drawX, drawY, p.size * 0.4, p.rotation);
        } else if (p.type === "cross") {
          drawCross(ctx, drawX, drawY, p.size * 0.3, p.rotation);
        }
      });

      // Connection lines between nearby particles
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.04;
            ctx.strokeStyle = `rgba(26, 26, 24, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [createParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
      }}
    />
  );
}
