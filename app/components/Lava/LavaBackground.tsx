"use client";

import { useEffect, useRef } from "react";
import styles from "./LavaBackground.module.css";

export default function LavaBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // ── Configuración de gotas ──
    type Blob = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseRadius: number;
      pulseSpeed: number;
      pulseOffset: number;
      color: "blue" | "green";
      opacity: number;
      opacitySpeed: number;
    };

    const NUM_BLOBS = 18;
    const blobs: Blob[] = [];

    const createBlob = (index: number): Blob => {
      const color = index % 3 === 0 ? "green" : "blue";
      const baseRadius = 60 + Math.random() * 120;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.35,
        radius: baseRadius,
        baseRadius,
        pulseSpeed: 0.008 + Math.random() * 0.012,
        pulseOffset: Math.random() * Math.PI * 2,
        color,
        opacity: 0.06 + Math.random() * 0.12,
        opacitySpeed: 0.003 + Math.random() * 0.004,
      };
    };

    for (let i = 0; i < NUM_BLOBS; i++) {
      blobs.push(createBlob(i));
    }

    let tick = 0;

    const drawBlob = (blob: Blob, t: number) => {
      const pulse = Math.sin(t * blob.pulseSpeed + blob.pulseOffset);
      const r = blob.baseRadius + pulse * (blob.baseRadius * 0.18);
      const opacityPulse = Math.sin(t * blob.opacitySpeed + blob.pulseOffset);
      const opacity = blob.opacity + opacityPulse * 0.04;

      const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, r);

      if (blob.color === "blue") {
        grad.addColorStop(0,   `rgba(30, 60, 255, ${opacity * 1.4})`);
        grad.addColorStop(0.3, `rgba(10, 30, 200, ${opacity})`);
        grad.addColorStop(0.7, `rgba(0, 10, 120, ${opacity * 0.5})`);
        grad.addColorStop(1,   `rgba(0, 5, 80, 0)`);
      } else {
        grad.addColorStop(0,   `rgba(0, 255, 130, ${opacity * 1.2})`);
        grad.addColorStop(0.3, `rgba(0, 180, 90, ${opacity})`);
        grad.addColorStop(0.7, `rgba(0, 80, 40, ${opacity * 0.5})`);
        grad.addColorStop(1,   `rgba(0, 30, 15, 0)`);
      }

      ctx.beginPath();
      ctx.arc(blob.x, blob.y, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    };

    // Función de mezcla metaball simplificada — fuerza de atracción visual
    const drawMetafield = () => {
      ctx.clearRect(0, 0, width, height);

      // Fondo base
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0,   "#0c0c12");
      bgGrad.addColorStop(0.5, "#080810");
      bgGrad.addColorStop(1,   "#020205");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Capa de composición para blend
      ctx.globalCompositeOperation = "screen";

      blobs.forEach((blob) => {
        drawBlob(blob, tick);

        // Movimiento físico
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Flotación vertical (lava lamp)
        blob.vy += Math.sin(tick * 0.004 + blob.pulseOffset) * 0.004;

        // Límites suaves — rebota con amortiguación
        if (blob.x < -blob.baseRadius) blob.x = width + blob.baseRadius;
        if (blob.x > width + blob.baseRadius) blob.x = -blob.baseRadius;
        if (blob.y < -blob.baseRadius) blob.y = height + blob.baseRadius;
        if (blob.y > height + blob.baseRadius) blob.y = -blob.baseRadius;

        // Cap velocidad
        blob.vx = Math.max(-0.6, Math.min(0.6, blob.vx));
        blob.vy = Math.max(-0.5, Math.min(0.5, blob.vy));
      });

      ctx.globalCompositeOperation = "source-over";

      // ── Grain noise overlay ──
      // (leve textura para darle profundidad)
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      // Solo aplicamos noise en un frame de cada 3 para no saturar CPU
      if (tick % 3 === 0) {
        for (let i = 0; i < data.length; i += 4 * 8) {
          const noise = (Math.random() - 0.5) * 10;
          data[i]     = Math.min(255, Math.max(0, data[i] + noise));
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);
      }

      tick++;
      animId = requestAnimationFrame(drawMetafield);
    };

    drawMetafield();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.lavaCanvas} />;
}