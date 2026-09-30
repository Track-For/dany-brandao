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
      const responsive = gsap.matchMedia();
      let lenis: Lenis | null = null;
      let ticker: ((time: number) => void) | null = null;
      let heroVideo: HTMLVideoElement | null = null;
      let syncHeroVideo: (() => void) | null = null;
      const interactionCleanups: Array<() => void> = [];

      if (!reducedMotion && pointerFine && window.innerWidth >= 1024) {
        lenis = new Lenis({ duration: 1.05, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        ticker = (time: number) => lenis?.raf(time * 1000);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
      }

      if (!reducedMotion) {
        const hero = document.querySelector<HTMLElement>("[data-hero-section]");
        heroVideo = document.querySelector<HTMLVideoElement>("[data-hero-video]");
        const heroChapters = gsap.utils.toArray<HTMLElement>("[data-hero-chapter]");
        const heroProgress = gsap.utils.toArray<HTMLElement>("[data-hero-progress] i");
        const heroVeil = document.querySelector<HTMLElement>("[data-hero-veil]");
        if (hero && heroVideo && heroChapters.length) {
          const duration = Number(hero.dataset.heroDuration) || 4.58;
          const playhead = { time: 0 };
          syncHeroVideo = () => {
            if (!heroVideo || heroVideo.readyState < 1) return;
            const target = Math.min(Math.max(0, playhead.time), Math.max(0, heroVideo.duration - 0.03));
            if (Math.abs(heroVideo.currentTime - target) > 0.012) heroVideo.currentTime = target;
          };

          heroVideo.pause();
          heroVideo.addEventListener("loadedmetadata", syncHeroVideo);
          gsap.set(heroChapters, { y: 32, autoAlpha: 0 });
          gsap.set(heroChapters[0], { y: 0, autoAlpha: 1 });
          gsap.set(heroProgress, { scaleX: 0 });

          const heroTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: () => `+=${Math.max(window.innerHeight, hero.offsetHeight - window.innerHeight * 2)}`,
              scrub: 1.35,
              invalidateOnRefresh: true,
              onEnter: () => heroVideo?.pause(),
              onEnterBack: () => heroVideo?.pause(),
            },
          });

          heroTimeline
            .to(playhead, { time: duration, duration: 6, ease: "none", onUpdate: syncHeroVideo }, 0)
            .to(heroVideo, { scale: 1, duration: 6, ease: "none" }, 0);
          if (heroVeil) heroTimeline.to(heroVeil, { opacity: 0.72, duration: 6, ease: "none" }, 0);

          heroProgress.forEach((bar, index) => {
            heroTimeline.to(bar, { scaleX: 1, duration: 0.88, ease: "none" }, index);
          });
          heroChapters.forEach((chapter, index) => {
            if (index < heroChapters.length - 1) {
              heroTimeline.to(chapter, { y: -26, autoAlpha: 0, duration: 0.16, ease: "power2.in" }, index + 0.82);
            }
            if (index > 0) {
              heroTimeline.fromTo(chapter, { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.2, ease: "power3.out", immediateRender: false }, index - 0.02);
            }
          });
        }

        const sectionTitles = gsap.utils.toArray<HTMLElement>(
          ".partners__header h2, .details__header h2, .showcase__header h2, .system h2, .about__copy h2, .contact__headline h2, [data-title-reveal]",
        );
        sectionTitles.forEach((title) => {
          gsap.fromTo(title, { yPercent: 24, clipPath: "inset(0 0 100% 0)", autoAlpha: 0 }, { yPercent: 0, clipPath: "inset(0 0 0% 0)", autoAlpha: 1, duration: 1.05, ease: "power4.out", scrollTrigger: { trigger: title, start: "top 88%", once: true } });
        });

        ScrollTrigger.batch("[data-reveal]", {
          start: "top 90%",
          once: true,
          onEnter: (elements) => gsap.from(elements, { y: 24, autoAlpha: 0, stagger: 0.07, duration: 0.7, ease: "power3.out" }),
        });

        const projectHeroItems = gsap.utils.toArray<HTMLElement>("[data-hero-reveal]");
        if (projectHeroItems.length) gsap.from(projectHeroItems, { y: 34, autoAlpha: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((image) => {
          gsap.fromTo(image, { yPercent: -3, scale: 1.05 }, { yPercent: 3, scale: 1, ease: "none", scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: 0.8 } });
        });

        const tracks = gsap.utils.toArray<HTMLElement>("[data-partners-track]").map((track) => {
          const cards = Array.from(track.querySelectorAll<HTMLElement>(".partner-card"));
          const first = cards[0];
          const duplicate = cards[Math.floor(cards.length / 2)];
          return { track, first, duplicate, direction: track.dataset.direction, setX: gsap.quickSetter(track, "x", "px") };
        }).filter((item) => item.first && item.duplicate);

        if (tracks.length) {
          const updatePartners = (scroll: number) => tracks.forEach(({ first, duplicate, direction, setX }) => {
            const width = duplicate.offsetLeft - first.offsetLeft;
            if (!width) return;
            const offset = gsap.utils.wrap(0, width, scroll * 0.18);
            setX(direction === "right" ? -width + offset : -offset);
          });
          ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => updatePartners(self.scroll()), onRefresh: (self) => updatePartners(self.scroll()) });
          updatePartners(window.scrollY);
        }

        const language = document.querySelector<HTMLElement>("[data-language-section]");
        const languageTrack = document.querySelector<HTMLElement>("[data-language-track]");
        const languageProgress = document.querySelector<HTMLElement>("[data-language-progress]");
        const popFilms = gsap.utils.toArray<HTMLElement>(".language__film--one, .language__film--two");

        if (language && languageTrack) {
          gsap.set(popFilms[0], { clipPath: "inset(0% 0% 100% 0%)" });
          gsap.set(popFilms[1], { clipPath: "inset(100% 0% 0% 0%)" });
          const distance = () => Math.max(0, languageTrack.scrollWidth - window.innerWidth);
          const languageTl = gsap.timeline({ scrollTrigger: { trigger: language, start: "top top", end: "bottom bottom", scrub: 0.85, invalidateOnRefresh: true } });
          if (languageProgress) languageTl.fromTo(languageProgress, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, 0);
          languageTl
            .to(languageTrack, { x: () => -distance(), duration: 1, ease: "none" }, 0)
            .to(".language-panel__classic-media img", { scale: 1.1, xPercent: -3, duration: 0.34, ease: "none" }, 0)
            .fromTo(".language-panel__transform-media", { clipPath: "inset(10% 14%)", scale: 0.92 }, { clipPath: "inset(0% 0%)", scale: 1, duration: 0.32, ease: "power2.inOut" }, 0.28)
            .to(popFilms, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.3, stagger: 0.05, ease: "power3.inOut" }, 0.62)
            .fromTo(".language-panel__pop-copy", { y: 38, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.23, ease: "power3.out" }, 0.7);
        }

        const handoff = document.querySelector<HTMLElement>("[data-language-handoff]");
        if (handoff) gsap.fromTo(handoff, { yPercent: 18 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: handoff, start: "top bottom", end: "top 68%", scrub: 0.7 } });

        const zoom = document.querySelector<HTMLElement>("[data-zoom-section]");
        const zoomMedia = document.querySelector<HTMLElement>("[data-zoom-media]");
        if (zoom && zoomMedia) {
          const zoomImage = zoomMedia.querySelector<HTMLElement>("img");
          const zoomFrame = zoomMedia.querySelector<HTMLElement>("[data-zoom-frame]");
          const coverViewport = () => Math.max(window.innerWidth / zoomMedia.offsetWidth, window.innerHeight / zoomMedia.offsetHeight) * 1.035;
          const zoomTimeline = gsap.timeline({ scrollTrigger: { trigger: zoom, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true } })
            .fromTo(zoomMedia, { xPercent: -50, yPercent: -50, clipPath: "inset(6% 8%)", scale: 0.94 }, { xPercent: -50, yPercent: -50, clipPath: "inset(0% 0%)", scale: coverViewport, duration: 1, ease: "none" }, 0)
            .to("[data-zoom-left]", { xPercent: -58, autoAlpha: 0, duration: 0.5, ease: "none" }, 0.04)
            .to("[data-zoom-right]", { xPercent: 58, autoAlpha: 0, duration: 0.5, ease: "none" }, 0.04);
          if (zoomImage) zoomTimeline.fromTo(zoomImage, { scale: 1.16 }, { scale: 1.01, duration: 1, ease: "none" }, 0);
          if (zoomFrame) zoomTimeline.to(zoomFrame, { autoAlpha: 0, duration: 0.28, ease: "none" }, 0.12);
        }

        responsive.add("(min-width: 1024px)", () => {
          const methodPin = document.querySelector<HTMLElement>("[data-method-pin]");
          if (methodPin) {
            const chapters = gsap.utils.toArray<HTMLElement>("[data-method-chapter]");
            const visuals = gsap.utils.toArray<HTMLElement>("[data-method-visual]");
            const numbers = gsap.utils.toArray<HTMLElement>("[data-method-number]");
            const markers = gsap.utils.toArray<HTMLElement>("[data-method-marker]");
            const progress = document.querySelector<HTMLElement>("[data-method-progress]");
            gsap.set([...chapters.slice(1), ...visuals.slice(1), ...numbers.slice(1)], { autoAlpha: 0 });
            gsap.set(visuals.slice(1), { clipPath: "inset(100% 0 0 0)" });
            markers[0]?.classList.add("is-active");
            const methodTl = gsap.timeline({ scrollTrigger: { trigger: methodPin, start: "top top", end: "+=300%", pin: true, scrub: 0.85, onUpdate: (self) => { const active = Math.min(5, Math.round(self.progress * 5)); markers.forEach((marker, index) => marker.classList.toggle("is-active", index <= active)); } } });
            if (progress) methodTl.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: 6, ease: "none" }, 0);
            for (let index = 1; index < chapters.length; index += 1) {
              methodTl.to(chapters[index - 1], { y: -28, autoAlpha: 0, duration: 0.34 }, index)
                .fromTo(chapters[index], { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.48, ease: "power3.out" }, index + 0.12)
                .to(numbers[index - 1], { yPercent: -100, autoAlpha: 0, duration: 0.28 }, index)
                .fromTo(numbers[index], { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.42 }, index + 0.08)
                .to(visuals[index - 1], { scale: 0.96, autoAlpha: 0.1, duration: 0.4 }, index)
                .fromTo(visuals[index], { clipPath: "inset(100% 0 0 0)", scale: 1.03, autoAlpha: 1 }, { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 0.58, ease: "power3.out" }, index + 0.06);
            }
          }

          const detailsPin = document.querySelector<HTMLElement>("[data-details-pin]");
          const detailsTrack = document.querySelector<HTMLElement>("[data-details-track]");
          if (detailsPin && detailsTrack) {
            const curtains = gsap.utils.toArray<HTMLElement>("[data-detail-curtain]");
            const detailsProgress = document.querySelector<HTMLElement>("[data-details-progress]");
            const distance = () => Math.max(0, detailsTrack.scrollWidth - window.innerWidth);
            gsap.set(curtains, { clipPath: "inset(0% 0% 100% 0%)" });
            const detailsTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: detailsPin,
                start: "top top",
                end: () => `+=${Math.max(window.innerWidth * 2, distance() * 1.08)}`,
                pin: true,
                scrub: 1.1,
                invalidateOnRefresh: true,
              },
            });
            detailsTimeline.to(detailsTrack, { x: () => -distance(), duration: 1, ease: "none" }, 0);
            if (detailsProgress) detailsTimeline.fromTo(detailsProgress, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, 0);
            curtains.forEach((curtain, index) => {
              detailsTimeline.to(curtain, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.16, ease: "power3.inOut" }, 0.03 + index * 0.22);
            });
          }

          const showcasePin = document.querySelector<HTMLElement>("[data-showcase-pin]");
          const showcaseTrack = document.querySelector<HTMLElement>("[data-showcase-track]");
          if (showcasePin && showcaseTrack) {
            const distance = () => Math.max(0, showcaseTrack.scrollWidth - window.innerWidth + 64);
            gsap.to(showcaseTrack, { x: () => -distance(), ease: "none", scrollTrigger: { trigger: showcasePin, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true } });
          }
        });

        responsive.add("(max-width: 1023px)", () => {
          const current = document.querySelector<HTMLElement>("[data-method-current]");
          const currentTitle = document.querySelector<HTMLElement>("[data-method-current-title]");
          const mobileProgress = document.querySelector<HTMLElement>("[data-method-mobile-progress]");
          const chapters = gsap.utils.toArray<HTMLElement>("[data-method-chapter]");
          const updateMethod = (index: number) => {
            if (current) current.textContent = String(index + 1).padStart(2, "0");
            if (currentTitle) {
              currentTitle.textContent = chapters[index]?.querySelector("h3")?.textContent ?? "";
              currentTitle.style.color = index >= 4 ? "#ee3d96" : "";
            }
            if (mobileProgress) gsap.to(mobileProgress, { scaleY: (index + 1) / chapters.length, duration: 0.35, overwrite: true });
          };
          chapters.forEach((chapter, index) => {
            gsap.from(chapter.querySelectorAll("h3, .method__copy, .method__mobile-visual"), { y: 28, autoAlpha: 0, stagger: 0.08, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: chapter, start: "top 75%", once: true } });
            ScrollTrigger.create({ trigger: chapter, start: "top 38%", end: "bottom 38%", onEnter: () => updateMethod(index), onEnterBack: () => updateMethod(index) });
          });

          gsap.utils.toArray<HTMLElement>("[data-detail-curtain]").forEach((media) => {
            gsap.fromTo(media, { clipPath: "inset(0% 0% 100% 0%)", y: 22 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: media, start: "top 82%", once: true } });
          });

          gsap.utils.toArray<HTMLElement>(".showcase-card").forEach((card) => {
            const media = card.querySelector<HTMLElement>(".showcase-card__media");
            const meta = card.querySelector<HTMLElement>(".showcase-card__meta");
            if (!media || !meta) return;
            gsap.timeline({ scrollTrigger: { trigger: card, start: "top 82%", once: true } })
              .from(media, { clipPath: "inset(0 0 100% 0)", duration: 0.85, ease: "power4.out" })
              .from(meta, { y: 20, autoAlpha: 0, duration: 0.5, ease: "power3.out" }, "-=0.38");
          });
        });

        // These triggers follow pinned desktop sections, so they must be created
        // after those pins for ScrollTrigger to calculate their real positions.
        const complexity = document.querySelector<HTMLElement>("[data-complexity-section]");
        const complexityWords = gsap.utils.toArray<HTMLElement>("[data-complexity-word]");
        const complexityResult = document.querySelector<HTMLElement>("[data-complexity-result]");
        if (complexity && complexityWords.length && complexityResult) {
          const isMobile = window.innerWidth < 1024;
          const activeWords = isMobile ? complexityWords.slice(0, 5) : complexityWords;
          const inactiveWords = isMobile ? complexityWords.slice(5) : [];
          const scatter = isMobile
            ? [[-112, -224], [92, -154], [-96, -48], [102, 66], [-24, 184]]
            : [[-520, -260], [-180, -310], [220, -275], [500, -120], [-430, -65], [330, 30], [-320, 145], [30, 210], [390, 250], [-100, 315]];
          const systemSource = document.querySelector<HTMLElement>("[data-system-orbit]");
          const systemSourceSteps = systemSource ? gsap.utils.toArray<HTMLElement>("[data-system-step]", systemSource) : [];
          const systemSourceCore = systemSource?.querySelector<HTMLElement>("[data-system-core]");
          const systemSourceGuide = systemSource?.querySelector<HTMLElement>(".system__orbit-scene");
          const complexityPin = complexity.querySelector<HTMLElement>("[data-complexity-pin]");
          const hasHandoff = Boolean(systemSource && systemSourceSteps.length && complexityPin);

          gsap.set(activeWords, { xPercent: -50, yPercent: -50, x: (index) => scatter[index][0], y: (index) => scatter[index][1], rotate: (index) => (index % 2 ? 4 : -4), autoAlpha: hasHandoff ? 0 : 1 });
          if (inactiveWords.length) gsap.set(inactiveWords, { autoAlpha: 0 });
          gsap.set(complexityResult, { scale: 0.82, autoAlpha: 0 });
          let animatedComplexityWords = activeWords;
          let usesHandoffLayer = false;

          if (hasHandoff && systemSource && complexityPin) {
            const handoffLayer = document.createElement("div");
            handoffLayer.className = "system-handoff-layer";
            handoffLayer.setAttribute("aria-hidden", "true");
            root.current?.appendChild(handoffLayer);

            const targetIndexes = isMobile ? [3, 0, 4, 1, 2] : [6, 0, 5, 4, 7, 1, 2, 8];
            const sourceIndexes = isMobile ? [0, 1, 3, 5, 6] : systemSourceSteps.map((_, index) => index);
            const handoffPairs = sourceIndexes.map((sourceIndex, pairIndex) => {
              const source = systemSourceSteps[sourceIndex];
              const target = activeWords[targetIndexes[pairIndex]];
              const word = document.createElement("span");
              word.className = "system-handoff-word";
              word.textContent = source.textContent;
              word.style.fontSize = window.getComputedStyle(source).fontSize;
              handoffLayer.appendChild(word);
              return { source, target, word };
            }).filter((pair) => pair.source && pair.target);
            const handoffWords = handoffPairs.map((pair) => pair.word);
            animatedComplexityWords = handoffWords;
            usesHandoffLayer = true;

            const contentRect = (element: HTMLElement) => {
              const range = document.createRange();
              range.selectNodeContents(element);
              const rect = range.getBoundingClientRect();
              return rect.width > 0 ? rect : element.getBoundingClientRect();
            };
            const handoffStart = () => {
              const scoreRect = systemSource.getBoundingClientRect();
              return scoreRect.bottom + window.scrollY - window.innerHeight * 0.94;
            };
            const sourceX = (index: number) => contentRect(handoffPairs[index].source).left;
            const sourceY = (index: number) => {
              const rect = contentRect(handoffPairs[index].source);
              return rect.top + window.scrollY - handoffStart();
            };
            const targetX = (index: number) => {
              const pinRect = complexityPin.getBoundingClientRect();
              const targetRect = handoffPairs[index].target.getBoundingClientRect();
              return targetRect.left - pinRect.left;
            };
            const targetY = (index: number) => {
              const pinRect = complexityPin.getBoundingClientRect();
              const targetRect = handoffPairs[index].target.getBoundingClientRect();
              return targetRect.top - pinRect.top;
            };
            const targetScale = (index: number) => {
              const sourceRect = contentRect(handoffPairs[index].source);
              const targetRect = handoffPairs[index].target.getBoundingClientRect();
              return gsap.utils.clamp(0.82, 1.9, targetRect.height / Math.max(sourceRect.height, 1));
            };
            const activateHandoff = () => {
              gsap.set(handoffLayer, { autoAlpha: 1 });
              gsap.set(handoffWords, { autoAlpha: 1, willChange: "transform, opacity" });
              gsap.set(systemSourceSteps, { autoAlpha: 0 });
              gsap.set([systemSourceCore, systemSourceGuide].filter(Boolean), { autoAlpha: 0 });
              gsap.set(activeWords, { autoAlpha: 0 });
            };
            const deactivateHandoff = () => {
              gsap.set(handoffLayer, { autoAlpha: 0 });
              gsap.set(handoffWords, { autoAlpha: 0, willChange: "auto" });
            };

            gsap.set(handoffLayer, { autoAlpha: 0 });

            const handoffTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: systemSource,
                start: "bottom 94%",
                endTrigger: complexity,
                end: "top top",
                scrub: 0.8,
                invalidateOnRefresh: true,
                onEnter: activateHandoff,
                onLeave: () => {
                  activateHandoff();
                  gsap.set(systemSourceSteps, { autoAlpha: 0 });
                  gsap.set(activeWords, { autoAlpha: 0 });
                },
                onEnterBack: activateHandoff,
                onLeaveBack: () => {
                  deactivateHandoff();
                  gsap.set(systemSourceSteps, { autoAlpha: 1 });
                  gsap.set([systemSourceCore, systemSourceGuide].filter(Boolean), { autoAlpha: 1 });
                  gsap.set(activeWords, { autoAlpha: 0 });
                },
              },
            });

            const flowOffsets = isMobile ? [0, 0.035, 0.07, 0.02, 0.055] : [0, 0.06, 0.025, 0.085, 0.04, 0.105, 0.015, 0.075];
            handoffPairs.forEach((_, index) => {
              const direction = index % 2 === 0 ? -1 : 1;
              const offset = flowOffsets[index] ?? index * 0.02;
              handoffTimeline
                .fromTo(handoffWords[index], { x: () => sourceX(index), y: () => sourceY(index), scale: 1, rotation: 0, color: "#f0ebe1", force3D: true }, { x: () => sourceX(index) + (targetX(index) - sourceX(index)) * 0.16 + direction * 22, y: () => sourceY(index) + (targetY(index) - sourceY(index)) * 0.12 - 28, scale: 1.045, rotation: direction * 2.2, duration: 0.24, ease: "power2.out", force3D: true }, offset)
                .to(handoffWords[index], { x: () => targetX(index), y: () => targetY(index), scale: () => targetScale(index), rotation: targetIndexes[index] % 2 ? 4 : -4, color: "#418a90", duration: 0.76, ease: "power3.inOut", force3D: true }, offset + 0.24);
            });

            interactionCleanups.push(() => handoffLayer.remove());
          }

          const pause = { progress: 0 };
          const assembledX = (index: number) => usesHandoffLayer ? window.innerWidth / 2 - animatedComplexityWords[index].offsetWidth / 2 : 0;
          const assembledY = (index: number) => usesHandoffLayer ? window.innerHeight / 2 - animatedComplexityWords[index].offsetHeight / 2 : 0;
          gsap.timeline({ scrollTrigger: { trigger: complexity, start: "top top", end: "bottom bottom", scrub: 0.75, invalidateOnRefresh: true } })
            .to(pause, { progress: 1, duration: 0.34, ease: "none" })
            .to(animatedComplexityWords, { x: assembledX, y: assembledY, rotate: 0, scale: 0.82, color: "#418a90", duration: 0.68, stagger: 0.018, ease: "power2.inOut" })
            .to(pause, { progress: 2, duration: 0.18, ease: "none" })
            .to(animatedComplexityWords, { scale: 0.08, autoAlpha: 0, duration: 0.3, stagger: 0.012, ease: "power3.in" })
            .fromTo(complexityResult, { scale: 0.82, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: "power3.out" }, "-=0.04");
        }

        const manifesto = document.querySelector<HTMLElement>("[data-manifesto-section]");
        const manifestoFilm = document.querySelector<HTMLElement>(".manifesto__film");
        const manifestoLines = gsap.utils.toArray<HTMLElement>("[data-manifesto-line]");
        if (manifesto && manifestoFilm && manifestoLines.length) {
          gsap.timeline({ scrollTrigger: { trigger: manifesto, start: "top 70%", end: "bottom 45%", scrub: 0.8 } })
            .fromTo(manifestoFilm, { scale: 1.07, clipPath: "inset(8% 8%)" }, { scale: 1, clipPath: "inset(0% 0%)", duration: 1, ease: "none" }, 0)
            .fromTo(manifestoLines, { y: 28, opacity: 0.12 }, { y: 0, opacity: 1, stagger: 0.25, duration: 0.5, ease: "power2.out" }, 0.15);
        }

        const systemScore = document.querySelector<HTMLElement>("[data-system-orbit]");
        if (systemScore) {
          const scoreGuide = systemScore.querySelector<HTMLElement>(".system__orbit-scene");
          const scoreCore = systemScore.querySelector<HTMLElement>("[data-system-core]");
          const scoreSteps = gsap.utils.toArray<HTMLElement>("[data-system-step]", systemScore);
          const scoreTimeline = gsap.timeline({
            scrollTrigger: { trigger: systemScore, start: "top 82%", once: true },
          });

          if (scoreGuide) scoreTimeline.fromTo(scoreGuide, { scaleY: 0 }, { scaleY: 1, duration: 1.35, ease: "power3.inOut" }, 0);
          if (scoreCore) scoreTimeline.fromTo(scoreCore, { y: 24, clipPath: "inset(0 100% 0 0)" }, { y: 0, clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power4.out" }, 0.08);
          scoreTimeline.fromTo(
            scoreSteps,
            { x: (index) => index % 2 === 0 ? -34 : 34, autoAlpha: 0, clipPath: (index) => index % 2 === 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" },
            { x: 0, autoAlpha: 1, clipPath: "inset(0 0% 0 0)", duration: 0.72, stagger: 0.075, ease: "power3.out", clearProps: "transform,opacity,visibility,clipPath" },
            0.22,
          );
        }

        const aboutImage = document.querySelector<HTMLElement>("[data-about-image]");
        if (aboutImage) gsap.fromTo(aboutImage, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)", duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: aboutImage, start: "top 84%", once: true } });

        if (pointerFine && window.innerWidth >= 1024) {
          const cinematicLight = document.querySelector<HTMLElement>("[data-cinematic-light]");
          if (cinematicLight) {
            gsap.set(cinematicLight, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
            const lightX = gsap.quickTo(cinematicLight, "x", { duration: 0.85, ease: "power3" });
            const lightY = gsap.quickTo(cinematicLight, "y", { duration: 0.85, ease: "power3" });
            const moveLight = (event: PointerEvent) => { lightX(event.clientX); lightY(event.clientY); };
            window.addEventListener("pointermove", moveLight);
            interactionCleanups.push(() => window.removeEventListener("pointermove", moveLight));
          }

          gsap.utils.toArray<HTMLElement>(".showcase-card, .about__portrait").forEach((scene) => {
            const visual = scene.querySelector<HTMLElement>("img");
            if (!visual) return;

            gsap.set(scene, { transformPerspective: 1100, transformStyle: "preserve-3d", transformOrigin: "50% 50%" });
            const moveScene = (event: PointerEvent) => {
              const bounds = scene.getBoundingClientRect();
              const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
              const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
              gsap.to(scene, { rotationY: x * 3.4, rotationX: y * -3.4, scale: 1.008, duration: 0.55, ease: "power3.out", overwrite: "auto", force3D: true });
              gsap.to(visual, { xPercent: x * 1.8, yPercent: y * 1.4, scale: 1.055, duration: 0.75, ease: "power3.out", overwrite: "auto", force3D: true });
            };
            const leaveScene = () => {
              gsap.to(scene, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.9, ease: "power3.out", overwrite: "auto" });
              gsap.to(visual, { xPercent: 0, yPercent: 0, scale: 1, duration: 1, ease: "power3.out", overwrite: "auto" });
            };

            scene.addEventListener("pointermove", moveScene);
            scene.addEventListener("pointerleave", leaveScene);
            interactionCleanups.push(() => {
              scene.removeEventListener("pointermove", moveScene);
              scene.removeEventListener("pointerleave", leaveScene);
            });
          });

          gsap.utils.toArray<HTMLElement>(".partner-card").forEach((card) => {
            const enterCard = () => gsap.to(card, { y: -10, scale: 1.025, duration: 0.42, ease: "power3.out", overwrite: "auto", force3D: true });
            const leaveCard = () => gsap.to(card, { y: 0, scale: 1, duration: 0.7, ease: "power3.out", overwrite: "auto" });
            card.addEventListener("pointerenter", enterCard);
            card.addEventListener("pointerleave", leaveCard);
            interactionCleanups.push(() => {
              card.removeEventListener("pointerenter", enterCard);
              card.removeEventListener("pointerleave", leaveCard);
            });
          });

          const cursor = document.querySelector<HTMLElement>("[data-cursor-ui]");
          const label = cursor?.querySelector<HTMLElement>("span");
          if (cursor && label) {
            document.documentElement.classList.add("has-custom-cursor");
            gsap.set(cursor, { xPercent: -50, yPercent: -50 });
            const cursorX = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3" });
            const cursorY = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3" });
            const moveCursor = (event: PointerEvent) => { cursorX(event.clientX); cursorY(event.clientY); };
            const updateCursor = (event: PointerEvent) => { const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor]"); label.textContent = target?.dataset.cursor ?? ""; cursor.classList.toggle("is-contextual", Boolean(target)); };
            window.addEventListener("pointermove", moveCursor);
            document.addEventListener("pointerover", updateCursor);
            responsive.add("all", () => () => { window.removeEventListener("pointermove", moveCursor); document.removeEventListener("pointerover", updateCursor); document.documentElement.classList.remove("has-custom-cursor"); });
          }

          gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((button) => {
            const inner = button.querySelector<HTMLElement>("span");
            const move = (event: PointerEvent) => { const rect = button.getBoundingClientRect(); const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14; const y = ((event.clientY - rect.top) / rect.height - 0.5) * 14; gsap.to(button, { x, y, duration: 0.24, ease: "power2.out" }); if (inner) gsap.to(inner, { x: x * 0.45, y: y * 0.45, duration: 0.24, ease: "power2.out" }); };
            const leave = () => { gsap.to(button, { x: 0, y: 0, duration: 0.4, ease: "power3.out" }); if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.4, ease: "power3.out" }); };
            button.addEventListener("pointermove", move);
            button.addEventListener("pointerleave", leave);
            responsive.add("all", () => () => { button.removeEventListener("pointermove", move); button.removeEventListener("pointerleave", leave); });
          });
        }
      }

      const anchorLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]'));
      const handleAnchor = (event: Event) => {
        const href = (event.currentTarget as HTMLAnchorElement).getAttribute("href");
        const hash = href?.includes("#") ? `#${href.split("#")[1]}` : "";
        const target = hash ? document.querySelector<HTMLElement>(hash) : null;
        if (!target) return;
        event.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: -76 });
        else target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      };
      anchorLinks.forEach((link) => link.addEventListener("click", handleAnchor));

      document.fonts.ready.then(() => ScrollTrigger.refresh());

      return () => {
        anchorLinks.forEach((link) => link.removeEventListener("click", handleAnchor));
        interactionCleanups.forEach((cleanup) => cleanup());
        if (heroVideo && syncHeroVideo) heroVideo.removeEventListener("loadedmetadata", syncHeroVideo);
        responsive.revert();
        if (ticker) gsap.ticker.remove(ticker);
        lenis?.destroy();
      };
    },
    { scope: root },
  );

  return <div ref={root} className="cinematic-shell">{children}<div className="cinematic-light" data-cinematic-light aria-hidden="true" /><div className="cinematic-texture" aria-hidden="true" /><div className="context-cursor" data-cursor-ui aria-hidden="true"><span /></div></div>;
}
