"use client";

import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";

type VideoLightboxProps = {
  src: string;
  poster: string;
  label?: string;
};

export function VideoLightbox({
  src,
  poster,
  label = "Assistir",
}: VideoLightboxProps) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const currentVideo = videoRef.current;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    currentVideo?.play().catch(() => undefined);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      currentVideo?.pause();
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="watch-button"
        data-magnetic
        data-cursor="PLAY"
        onClick={() => setOpen(true)}
      >
        <Play aria-hidden="true" size={15} fill="currentColor" />
        <span>{label}</span>
      </button>

      {open ? (
        <div
          className="video-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Vídeo da experiência"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <button
            type="button"
            className="video-modal__close"
            aria-label="Fechar vídeo"
            onClick={() => setOpen(false)}
          >
            <X aria-hidden="true" size={24} />
          </button>
          <video
            ref={videoRef}
            className="video-modal__player"
            src={src}
            poster={poster}
            controls
            playsInline
            preload="metadata"
          />
        </div>
      ) : null}
    </>
  );
}
