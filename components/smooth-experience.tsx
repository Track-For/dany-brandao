"use client";

import { ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type SmoothExperienceProps = { children: ReactNode };

export function SmoothExperience({ children }: SmoothExperienceProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const pointerFine = window.matchMedia("(pointer: fine)").matches;
      let lenis: Lenis | null = null;
      let ticker: ((time: number) => void) | null = null;
      let responsive: ReturnType<typeof gsap.matchMedia> | null = null;
      let hashCorrection: number | undefined;
      let cancelled = false;

      if (!reducedMotion) {
        lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
        lenis.on("scroll", ScrollTrigger.update);
        ticker = (time: number) => lenis?.raf(time * 1000);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
      } else {
        document.querySelectorAll<HTMLVideoElement>("video").forEach((video) => video.pause());
      }

      const lazyVideos = Array.from(document.querySelectorAll<HTMLVideoElement>("[data-lazy-video]"));
      const videoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target as HTMLVideoElement;
            if (entry.isIntersecting && !reducedMotion) video.play().catch(() => undefined);
            else video.pause();
          });
        },
        { rootMargin: "180px 0px", threshold: 0.12 },
      );
      lazyVideos.forEach((video) => videoObserver.observe(video));

      if (!reducedMotion) {
        gsap.from("[data-hero-reveal]", {
          y: 26,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.1,
          delay: 0.12,
          ease: "power4.out",
        });

        gsap.utils.toArray<HTMLElement>("[data-title-reveal]").forEach((heading) => {
          const lines = heading.querySelectorAll<HTMLElement>(".reveal-line > span");
          if (!lines.length) return;
          gsap.from(lines, {
            yPercent: 105,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.07,
            ease: "power4.out",
            scrollTrigger: { trigger: heading, start: "top 84%", once: true },
          });
        });

        ScrollTrigger.batch("[data-reveal]", {
          start: "top 88%",
          once: true,
          onEnter: (items) =>
            gsap.from(items, {
              y: 28,
              autoAlpha: 0,
              duration: 0.72,
              stagger: 0.07,
              ease: "power3.out",
            }),
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((image) => {
          gsap.fromTo(
            image,
            { yPercent: -4 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: 0.8 },
            },
          );
        });

        const partnersSection = document.querySelector<HTMLElement>("[data-partners-section]");
        if (partnersSection) {
          const tracks = gsap.utils.toArray<HTMLElement>("[data-partners-track]").map((track) => {
            const cards = Array.from(track.querySelectorAll<HTMLElement>(".partner-card"));
            const firstCard = cards[0];
            const duplicateStart = cards[Math.floor(cards.length / 2)];
            const setX = gsap.quickSetter(track, "x", "px");

            return {
              track,
              movesRight: track.dataset.direction === "right",
              repeatWidth: () => duplicateStart.offsetLeft - firstCard.offsetLeft,
              setX,
            };
          });

          const updatePartnerTracks = (scrollPosition: number) => {
            tracks.forEach(({ movesRight, repeatWidth, setX }) => {
              const width = repeatWidth();
              const offset = gsap.utils.wrap(0, width, scrollPosition * 0.22);
              setX(movesRight ? -width + offset : -offset);
            });
          };

          ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: (self) => updatePartnerTracks(self.scroll()),
            onRefresh: (self) => updatePartnerTracks(self.scroll()),
          });

          updatePartnerTracks(window.scrollY);
        }

        const motionMedia = gsap.matchMedia();
        responsive = motionMedia;

        motionMedia.add("(min-width: 1024px)", () => {
          const hero = document.querySelector<HTMLElement>("[data-hero-pin]");
          if (hero) {
            const heroMedia = hero.querySelector<HTMLElement>("[data-hero-media]");
            const heroCopy = hero.querySelector<HTMLElement>("[data-hero-copy]");
            const heroFinal = hero.querySelector<HTMLElement>("[data-hero-final]");
            gsap.timeline({
              scrollTrigger: { trigger: hero, start: "top top", end: "+=135%", pin: true, scrub: 0.85 },
            })
              .to(heroMedia, { scale: 1.045, ease: "none" }, 0)
              .to(heroCopy, { yPercent: -12, autoAlpha: 0, ease: "none" }, 0.12)
              .fromTo(heroFinal, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: "power2.out" }, 0.62);
          }

          const language = document.querySelector<HTMLElement>("[data-language-section]");
          const languagePin = document.querySelector<HTMLElement>("[data-language-pin]");
          const popImage = document.querySelector<HTMLElement>("[data-language-pop]");
          const composition = document.querySelector<HTMLElement>("[data-language-composition]");
          const first = document.querySelector<HTMLElement>("[data-language-first]");
          const last = document.querySelector<HTMLElement>("[data-language-last]");
          if (language && languagePin && popImage && composition && first && last) {
            gsap.timeline({
              scrollTrigger: { trigger: language, start: "top top", end: "+=180%", pin: languagePin, scrub: 0.9 },
            })
              .to(popImage, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
              .to(composition, { scale: 1.12, ease: "none" }, 0)
              .to(languagePin, { backgroundColor: "#00A0DC", color: "#F0EBE1", ease: "none" }, 0)
              .to(first, { xPercent: -8, autoAlpha: 0, duration: 0.35, ease: "none" }, 0.12)
              .fromTo(last, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out" }, 0.5)
              .fromTo(".language__state--pop, .language__yellow-mark", { autoAlpha: 0 }, { autoAlpha: 1 }, 0.45);
          }

          const zoom = document.querySelector<HTMLElement>("[data-zoom-section]");
          const zoomMedia = document.querySelector<HTMLElement>("[data-zoom-media]");
          if (zoom && zoomMedia) {
            const coverViewport = () => Math.max(
              window.innerWidth / zoomMedia.offsetWidth,
              window.innerHeight / zoomMedia.offsetHeight,
            ) * 1.02;

            gsap.timeline({ scrollTrigger: { trigger: zoom, start: "top top", end: "+=130%", pin: true, scrub: 0.85 } })
              .fromTo(zoomMedia, { clipPath: "inset(12%)", scale: 1 }, { clipPath: "inset(0%)", scale: coverViewport, duration: 1.2, ease: "none" }, 0)
              .fromTo(zoomMedia.querySelector("img"), { scale: 1.14 }, { scale: 1, duration: 1.2, ease: "none" }, 0)
              .to("[data-zoom-left]", { xPercent: -38, autoAlpha: 0, duration: 0.7, ease: "none" }, 0)
              .to("[data-zoom-right]", { xPercent: 38, autoAlpha: 0, duration: 0.7, ease: "none" }, 0);
          }

          const methodPin = document.querySelector<HTMLElement>("[data-method-pin]");
          if (methodPin) {
            const chapters = gsap.utils.toArray<HTMLElement>("[data-method-chapter]");
            const visuals = gsap.utils.toArray<HTMLElement>("[data-method-visual]");
            const numbers = gsap.utils.toArray<HTMLElement>("[data-method-number]");
            const markers = gsap.utils.toArray<HTMLElement>("[data-method-marker]");
            const progress = document.querySelector<HTMLElement>("[data-method-progress]");
            gsap.set([...chapters.slice(1), ...visuals.slice(1), ...numbers.slice(1)], { autoAlpha: 0 });
            gsap.set(visuals.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
            const methodTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: methodPin,
                start: "top top",
                end: "+=330%",
                pin: true,
                scrub: 0.9,
                onUpdate: (self) => {
                  const active = Math.min(5, Math.round(self.progress * 5));
                  markers.forEach((marker, index) => marker.classList.toggle("is-active", index <= active));
                },
              },
            });
            if (progress) methodTimeline.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: 6, ease: "none" }, 0);
            for (let index = 1; index < chapters.length; index += 1) {
              const at = index;
              methodTimeline
                .to(chapters[index - 1], { y: -30, autoAlpha: 0, duration: 0.35 }, at)
                .fromTo(chapters[index], { y: 38, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.52, ease: "power3.out" }, at + 0.14)
                .to(numbers[index - 1], { yPercent: -100, autoAlpha: 0, duration: 0.3 }, at)
                .fromTo(numbers[index], { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45 }, at + 0.1)
                .to(visuals[index - 1], { scale: 0.96, autoAlpha: 0.16, duration: 0.45 }, at)
                .fromTo(visuals[index], { clipPath: "inset(100% 0% 0% 0%)", scale: 1.02, autoAlpha: 1 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.62, ease: "power3.out" }, at + 0.08);
            }
          }

          const showcasePin = document.querySelector<HTMLElement>("[data-showcase-pin]");
          const showcaseTrack = document.querySelector<HTMLElement>("[data-showcase-track]");
          if (showcasePin && showcaseTrack) {
            const distance = () => Math.max(0, showcaseTrack.scrollWidth - window.innerWidth + 48);
            gsap.to(showcaseTrack, {
              x: () => -distance(),
              ease: "none",
              scrollTrigger: { trigger: showcasePin, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
            });
          }

          const complexityPin = document.querySelector<HTMLElement>("[data-complexity-pin]");
          const words = gsap.utils.toArray<HTMLElement>("[data-complexity-word]");
          const result = document.querySelector<HTMLElement>("[data-complexity-result]");
          if (complexityPin && result && words.length) {
            const targets = [[-230, -110], [0, -110], [230, -110], [-230, 0], [0, 0], [230, 0], [-230, 110], [0, 110], [230, 110], [0, 210]];
            gsap.timeline({ scrollTrigger: { trigger: complexityPin, start: "top top", end: "+=190%", pin: true, scrub: 0.9 } })
              .to(words, { x: (index) => targets[index][0], y: (index) => targets[index][1], scale: 0.78, color: "#418A90", duration: 1.15, stagger: 0.025, ease: "power2.inOut" })
              .to(words, { x: 0, y: 0, scale: 0.22, autoAlpha: 0, duration: 1.2, stagger: 0.025, ease: "power3.in" })
              .fromTo(result, { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.75, ease: "power3.out" }, "-=0.42");
          }

          const manifestoPin = document.querySelector<HTMLElement>("[data-manifesto-pin]");
          const manifestoVideo = document.querySelector<HTMLElement>("[data-manifesto-video]");
          const manifestoLines = gsap.utils.toArray<HTMLElement>("[data-manifesto-line]");
          if (manifestoPin && manifestoVideo && manifestoLines.length) {
            gsap.timeline({ scrollTrigger: { trigger: manifestoPin, start: "top top", end: "+=160%", pin: true, scrub: 0.9 } })
              .fromTo(manifestoVideo, { scale: 1.035 }, { scale: 1, ease: "none" }, 0)
              .fromTo(manifestoLines[0], { opacity: 0.12 }, { opacity: 1, duration: 0.55 }, 0.08)
              .fromTo(manifestoLines[1], { opacity: 0.12 }, { opacity: 1, duration: 0.55 }, 0.5);
          }

          return () => undefined;
        });

        motionMedia.add("(max-width: 1023px)", () => {
          const popImage = document.querySelector<HTMLElement>("[data-language-pop]");
          const language = document.querySelector<HTMLElement>("[data-language-section]");
          if (popImage && language) {
            gsap.to(popImage, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: language, start: "top 72%", end: "bottom 38%", scrub: 0.75 } });
          }
          const zoom = document.querySelector<HTMLElement>("[data-zoom-section]");
          const zoomMedia = document.querySelector<HTMLElement>("[data-zoom-media]");
          if (zoom && zoomMedia) {
            gsap.fromTo(
              zoomMedia,
              { scale: 1 },
              {
                scale: () => Math.max(
                  window.innerWidth / zoomMedia.offsetWidth,
                  window.innerHeight / zoomMedia.offsetHeight,
                ) * 1.02,
                ease: "none",
                scrollTrigger: {
                  trigger: zoom,
                  start: "top 78%",
                  end: "bottom 22%",
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              },
            );
          }
          gsap.from("[data-method-chapter], [data-method-visual]", { y: 24, autoAlpha: 0, stagger: 0.04, duration: 0.65, scrollTrigger: { trigger: "[data-method-pin]", start: "top 80%" } });
        });

        const orbit = document.querySelector<HTMLElement>("[data-system-orbit]");
        if (orbit) gsap.fromTo(orbit, { rotate: -4 }, { rotate: 8, ease: "none", scrollTrigger: { trigger: orbit, start: "top bottom", end: "bottom top", scrub: 1 } });

        const aboutImage = document.querySelector<HTMLElement>("[data-about-image]");
        if (aboutImage) gsap.fromTo(aboutImage, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: "power4.out", scrollTrigger: { trigger: aboutImage, start: "top 82%", once: true } });

        if (pointerFine && window.innerWidth >= 1024) {
          const cursor = document.querySelector<HTMLElement>("[data-cursor-ui]");
          const cursorLabel = cursor?.querySelector<HTMLElement>("span");
          if (cursor && cursorLabel) {
            document.documentElement.classList.add("has-custom-cursor");
            gsap.set(cursor, { xPercent: -50, yPercent: -50 });
            const cursorX = gsap.quickTo(cursor, "x", { duration: 0.32, ease: "power3" });
            const cursorY = gsap.quickTo(cursor, "y", { duration: 0.32, ease: "power3" });
            const moveCursor = (event: PointerEvent) => { cursorX(event.clientX); cursorY(event.clientY); };
            const updateCursor = (event: PointerEvent) => {
              const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
              const label = target?.dataset.cursor ?? "";
              cursorLabel.textContent = label;
              cursor.classList.toggle("is-contextual", Boolean(label));
            };
            window.addEventListener("pointermove", moveCursor);
            document.addEventListener("pointerover", updateCursor);
            motionMedia.add("all", () => () => {
              window.removeEventListener("pointermove", moveCursor);
              document.removeEventListener("pointerover", updateCursor);
              document.documentElement.classList.remove("has-custom-cursor");
            });
          }

          gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((button) => {
            const inner = button.querySelector<HTMLElement>("span");
            const move = (event: PointerEvent) => {
              const rect = button.getBoundingClientRect();
              const x = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
              const y = ((event.clientY - rect.top) / rect.height - 0.5) * 16;
              gsap.to(button, { x, y, duration: 0.25, ease: "power2.out" });
              if (inner) gsap.to(inner, { x: x * 0.5, y: y * 0.5, duration: 0.25, ease: "power2.out" });
            };
            const leave = () => {
              gsap.to(button, { x: 0, y: 0, duration: 0.4, ease: "power3.out" });
              if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.4, ease: "power3.out" });
            };
            button.addEventListener("pointermove", move);
            button.addEventListener("pointerleave", leave);
            motionMedia.add("all", () => () => { button.removeEventListener("pointermove", move); button.removeEventListener("pointerleave", leave); });
          });
        }

      }

      const anchorLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]'));
      const handleAnchor = (event: Event) => {
        const link = event.currentTarget as HTMLAnchorElement;
        const href = link.getAttribute("href");
        const hash = href?.includes("#") ? `#${href.split("#")[1]}` : "";
        if (!hash || hash === "#") return;
        const target = document.querySelector<HTMLElement>(hash);
        if (!target) return;
        event.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: -92 });
        else target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      };
      anchorLinks.forEach((link) => link.addEventListener("click", handleAnchor));

      document.fonts.ready.then(() => {
        if (cancelled) return;
        ScrollTrigger.refresh();
        lenis?.resize();
        const hashTarget = window.location.hash ? document.querySelector<HTMLElement>(window.location.hash) : null;
        if (!hashTarget) return;
        if (lenis) {
          lenis.scrollTo(hashTarget, { immediate: true, offset: -92 });
          hashCorrection = window.setTimeout(() => {
            const correction = hashTarget.getBoundingClientRect().top - 92;
            lenis?.scrollTo(window.scrollY + correction, { immediate: true });
          }, 180);
        } else hashTarget.scrollIntoView();
      });

      return () => {
        cancelled = true;
        anchorLinks.forEach((link) => link.removeEventListener("click", handleAnchor));
        videoObserver.disconnect();
        responsive?.revert();
        if (hashCorrection) window.clearTimeout(hashCorrection);
        if (ticker) gsap.ticker.remove(ticker);
        lenis?.destroy();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {children}
      <div className="context-cursor" data-cursor-ui aria-hidden="true"><span /></div>
    </div>
  );
}
