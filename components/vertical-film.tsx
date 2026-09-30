"use client";

import { useEffect, useRef, useState } from "react";

type VerticalFilmProps = {
  src: string;
  poster: string;
  label?: string;
  caption?: string;
  objectPosition?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  priority?: boolean;
  className?: string;
  ariaLabel?: string;
};

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

export function VerticalFilm({
  src,
  poster,
  label,
  caption,
  objectPosition = "center",
  autoplay = true,
  loop = true,
  muted = true,
  playsInline = true,
  priority = false,
  className = "",
  ariaLabel,
}: VerticalFilmProps) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [canLoad, setCanLoad] = useState(priority);

  useEffect(() => {
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData;
    if (saveData && !priority) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const element = video.current;
    const figure = root.current;
    if (!element || !figure) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCanLoad(true);
          if (autoplay && !media.matches) element.play().catch(() => undefined);
        } else {
          element.pause();
        }
      },
      { rootMargin: priority ? "0px" : "320px 0px", threshold: 0.18 },
    );

    observer.observe(figure);
    return () => observer.disconnect();
  }, [autoplay, priority]);

  useEffect(() => {
    if (!canLoad || !video.current) return;
    const element = video.current;
    element.load();
    if (autoplay && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.play().catch(() => undefined);
    }
  }, [autoplay, canLoad]);

  return (
    <figure
      ref={root}
      className={`vertical-film ${className}`.trim()}
      data-film-loaded={canLoad || undefined}
    >
      <video
        ref={video}
        autoPlay={priority && autoplay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload={priority ? "metadata" : "none"}
        poster={poster}
        aria-label={ariaLabel ?? caption ?? label}
        style={{ objectPosition }}
      >
        {canLoad ? <source src={src} type="video/mp4" /> : null}
      </video>
      {label ? <span className="vertical-film__label">{label}</span> : null}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
