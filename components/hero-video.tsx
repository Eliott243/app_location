"use client";

import { useEffect, useRef, useState } from "react";

interface HeroVideoProps {
  /** Path to the poster image (shown before video loads & for reduced motion) */
  poster?: string;
  /** Path to the MP4 source */
  mp4?: string;
  /** Path to the WebM source */
  webm?: string;
  className?: string;
}

/**
 * Hero background video component.
 * - Respects prefers-reduced-motion: shows poster only.
 * - Shows poster immediately for LCP; video loads lazily behind it.
 * - Muted, looped, no audio, playsInline.
 */
export function HeroVideo({
  poster = "/media/agency-hero-poster.svg",
  mp4,
  webm,
  className = "",
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const hasVideo = Boolean(mp4 || webm);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Poster — always visible, ensures LCP is fast */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
        style={{
          opacity: videoReady && hasVideo && !reducedMotion ? 0 : 1,
          transition: "opacity 0.6s",
        }}
      />

      {/* Video — only when sources exist and motion is allowed */}
      {hasVideo && !reducedMotion && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: videoReady ? 1 : 0, transition: "opacity 0.6s" }}
          onCanPlay={() => setVideoReady(true)}
        >
          {webm ? <source src={webm} type="video/webm" /> : null}
          {mp4 ? <source src={mp4} type="video/mp4" /> : null}
        </video>
      )}
    </div>
  );
}
