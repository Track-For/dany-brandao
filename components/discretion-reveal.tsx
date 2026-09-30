"use client";

import { useEffect, useRef, useState } from "react";

const lines = [
  "Algumas experiências",
  "são feitas para",
  "serem vividas,",
  "não publicadas",
];

export function DiscretionReveal() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const title = titleRef.current;

    if (!title) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsRevealed(true);
        observer.disconnect();
      },
      { threshold: 0.34 },
    );

    observer.observe(title);
    return () => observer.disconnect();
  }, []);

  return (
    <h2
      ref={titleRef}
      id="discretion-title"
      className="discretion__quote"
      data-revealed={isRevealed}
    >
      {lines.map((line) => (
        <span className="discretion__line" key={line}>
          <span className="discretion__text">{line}</span>
          <span className="discretion__cover" aria-hidden="true" />
        </span>
      ))}
    </h2>
  );
}
