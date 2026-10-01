"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Allura } from "next/font/google";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LorenzoInteractivePortrait } from "@/components/lorenzo-interactive-portrait";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const signatureFont = Allura({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-signature",
});

const impactLines = [
  "Entendemos sua marca",
  "Traduzimos em experiência",
];

const upperPhrase = "Antes de produzir, precisamos entender.";
const lowerPhrase = "O cuidado transforma estratégia em experiência.";

export function PortraitHero() {
  const root = useRef<HTMLElement>(null);
  const vignette = useRef<HTMLDivElement>(null);
  const vignetteStartedAt = useRef<number | null>(null);
  const [showProfessional, setShowProfessional] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [effectReady, setEffectReady] = useState(false);
  const [vignetteLogoReady, setVignetteLogoReady] = useState(false);
  const [showVignette, setShowVignette] = useState(true);
  const handleEffectReady = useCallback(() => setEffectReady(true), []);

  useEffect(() => {
    if (!showVignette) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showVignette]);

  useGSAP(
    () => {
      const overlay = vignette.current;
      if (!overlay || !vignetteLogoReady) return;

      vignetteStartedAt.current = performance.now();

      const copy = overlay.querySelectorAll<HTMLElement>("[data-vignette-copy]");
      const logo = overlay.querySelector<HTMLElement>("[data-vignette-logo]");
      const logoCurtain = overlay.querySelector<HTMLElement>("[data-vignette-logo-curtain]");
      const pieces = Array.from(overlay.querySelectorAll<HTMLElement>("[data-vignette-piece]"));
      const sequence = overlay.querySelectorAll<HTMLElement>("[data-vignette-step]");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        gsap.set([copy, logo, pieces, sequence], { autoAlpha: 1, clearProps: "transform" });
        gsap.set(logoCurtain, { xPercent: 102 });
        return;
      }

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .addLabel("assemble", 0)
        .from(pieces[0], { xPercent: -190, rotation: -48, scale: 0.58, autoAlpha: 0, duration: 1.05 }, "assemble")
        .from(pieces[1], { yPercent: -210, rotation: 72, scale: 0.52, autoAlpha: 0, duration: 1.12 }, "assemble+=0.05")
        .from(pieces[2], { yPercent: 220, rotation: -64, scale: 0.55, autoAlpha: 0, duration: 1.18 }, "assemble+=0.08")
        .from(pieces[3], { xPercent: 210, rotation: 54, scale: 0.6, autoAlpha: 0, duration: 1.08 }, "assemble+=0.12")
        .from(logo, { scale: 0.94, duration: 0.46 }, "assemble+=0.18")
        .to(logoCurtain, { xPercent: 102, duration: 0.82, ease: "power4.inOut" }, "assemble+=0.22")
        .from(copy, { y: 22, autoAlpha: 0, duration: 0.62, stagger: 0.08 }, "assemble+=0.48")
        .from(sequence, { scaleX: 0, autoAlpha: 0, duration: 0.46, stagger: 0.09, transformOrigin: "left center" }, "assemble+=0.72");

      return () => {
        intro.kill();
      };
    },
    { scope: vignette, dependencies: [vignetteLogoReady], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      const overlay = vignette.current;
      if (!effectReady || !vignetteLogoReady || !showVignette || !overlay) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const elapsed = performance.now() - (vignetteStartedAt.current ?? performance.now());
      const minimumDisplay = Math.max(0, (1320 - elapsed) / 1000);
      const copy = overlay.querySelectorAll<HTMLElement>("[data-vignette-copy]");
      const logo = overlay.querySelector<HTMLElement>("[data-vignette-logo]");
      const pieces = overlay.querySelectorAll<HTMLElement>("[data-vignette-piece]");
      const panels = overlay.querySelectorAll<HTMLElement>("[data-vignette-panel]");
      const headerLogo = document.querySelector<HTMLElement>(".brand-signature--header");

      gsap.killTweensOf([copy, logo, pieces]);

      if (reducedMotion) {
        const hide = gsap.delayedCall(0, () => setShowVignette(false));
        return () => hide.kill();
      }

      const logoBounds = logo?.getBoundingClientRect();
      const headerBounds = headerLogo?.getBoundingClientRect();
      const targetX = logoBounds && headerBounds
        ? headerBounds.left + headerBounds.width / 2 - (logoBounds.left + logoBounds.width / 2)
        : 0;
      const targetY = logoBounds && headerBounds
        ? headerBounds.top + headerBounds.height / 2 - (logoBounds.top + logoBounds.height / 2)
        : -window.innerHeight * 0.42;
      const targetScale = logoBounds && headerBounds ? headerBounds.width / logoBounds.width : 0.34;

      const outro = gsap.timeline({
        delay: minimumDisplay,
        defaults: { ease: "power3.inOut" },
        onComplete: () => setShowVignette(false),
      });

      outro
        .addLabel("collapse", 0)
        .to(copy, { y: -18, autoAlpha: 0, duration: 0.35, stagger: 0.035 }, "collapse")
        .to(pieces, { x: 0, y: 0, scale: 0.18, rotation: 0, autoAlpha: 0, duration: 0.58, stagger: 0.03 }, "collapse")
        .to(
          logo,
          { x: targetX, y: targetY, scale: targetScale, duration: 0.86, ease: "power4.inOut" },
          "collapse+=0.06",
        )
        .addLabel("reveal", "collapse+=0.52")
        .to(panels[0], { xPercent: -102, duration: 0.92, ease: "power4.inOut" }, "reveal")
        .to(panels[1], { xPercent: 102, duration: 0.92, ease: "power4.inOut" }, "reveal")
        .to(logo, { autoAlpha: 0, duration: 0.12 }, "reveal+=0.7");

      return () => outro.kill();
    },
    { scope: vignette, dependencies: [effectReady, vignetteLogoReady, showVignette] },
  );

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const closing = section.querySelector<HTMLElement>("[data-hero-closing]");
      const frame = section.querySelector<HTMLElement>("[data-hero-frame]");
      const upperTrack = section.querySelector<HTMLElement>("[data-hero-upper]");
      const lowerTrack = section.querySelector<HTMLElement>("[data-hero-lower]");
      const signature = section.querySelector<SVGSVGElement>("[data-hero-signature]");
      const signatureStroke = section.querySelector<SVGTextElement>("[data-signature-stroke]");
      const signatureFill = section.querySelector<SVGTextElement>("[data-signature-fill]");

      if (!closing || !frame || !upperTrack || !lowerTrack || !signature || !signatureStroke || !signatureFill) {
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(frame, { clearProps: "transform,filter,borderRadius,willChange" });
        gsap.set([closing, signature], { autoAlpha: 0 });
        return;
      }

      const responsive = gsap.matchMedia();
      responsive.add(
        {
          desktop: "(min-width: 1024px)",
          compact: "(max-width: 1023px)",
        },
        (context) => {
          const compact = Boolean(context.conditions?.compact);
          const finalScale = compact ? 0.68 : 0.4;
          let closingActive = false;
          const animatedElements = [frame, upperTrack, lowerTrack, signature];
          const marquee = gsap.timeline({ repeat: -1, paused: true });

          marquee
            .fromTo(
              upperTrack,
              { xPercent: 0 },
              {
                xPercent: -50,
                duration: compact ? 16 : 21,
                ease: "none",
                force3D: true,
              },
              0,
            )
            .fromTo(
              lowerTrack,
              { xPercent: -50 },
              {
                xPercent: 0,
                duration: compact ? 18 : 24,
                ease: "none",
                force3D: true,
              },
              0,
            );

          const setWillChange = () => {
            gsap.set(frame, { willChange: "transform, filter" });
            gsap.set([upperTrack, lowerTrack], { willChange: "transform" });
            gsap.set(signature, { willChange: "transform, opacity" });
          };
          const releaseWillChange = () => gsap.set(animatedElements, { willChange: "auto" });
          const resumeScene = () => {
            setWillChange();
            marquee.resume();
          };
          const pauseScene = () => {
            marquee.pause();
            releaseWillChange();
          };

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${window.innerHeight * (compact ? 2.2 : 2.75)}`,
              pin: true,
              pinSpacing: true,
              scrub: 0.95,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onEnter: () => {
                if (closingActive) resumeScene();
              },
              onEnterBack: () => {
                if (closingActive) resumeScene();
              },
              onLeave: pauseScene,
              onLeaveBack: pauseScene,
              onUpdate: (self) => {
                const nextClosingState = self.progress > 0.03;
                if (nextClosingState === closingActive) return;
                closingActive = nextClosingState;
                setIsClosing(nextClosingState);
                if (nextClosingState) resumeScene();
                else pauseScene();
              },
            },
          });

          timeline
            .fromTo(closing, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.55 }, 0)
            .fromTo(
              frame,
              {
                scale: 1,
                filter: "grayscale(0) contrast(1) brightness(1)",
                borderRadius: 0,
              },
              {
                scale: finalScale,
                filter: "grayscale(1) contrast(0.93) brightness(0.72)",
                borderRadius: compact ? 20 : 12,
                duration: 1.65,
                ease: "power3.inOut",
              },
              0,
            )
            .fromTo(
              signature,
              { scale: 0.78, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 0.42, ease: "power3.out" },
              0.88,
            )
            .fromTo(
              signatureStroke,
              { strokeDashoffset: 2200, autoAlpha: 1 },
              { strokeDashoffset: 0, duration: 1.25, ease: "power2.inOut" },
              0.96,
            )
            .to(signatureFill, { autoAlpha: 1, duration: 0.52, ease: "power2.out" }, 1.7)
            .to(signatureStroke, { autoAlpha: 0.3, duration: 0.38 }, 1.9)
            .to(frame, { scale: finalScale * 0.96, duration: 0.72, ease: "power2.inOut" }, 2.4);

          return () => {
            marquee.kill();
            releaseWillChange();
          };
        },
      );

      return () => responsive.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="portrait-hero"
      data-revealed={!showVignette}
      data-portrait-hero
      data-cursor="REVELAR"
      aria-labelledby="hero-title"
    >
      {showVignette && (
        <div
          ref={vignette}
          className="portrait-vignette"
          role="status"
          aria-live="polite"
          aria-label="Preparando a experiência Dany Brandão"
          data-logo-ready={vignetteLogoReady}
        >
          <div className="portrait-vignette__panel portrait-vignette__panel--left" data-vignette-panel aria-hidden="true" />
          <div className="portrait-vignette__panel portrait-vignette__panel--right" data-vignette-panel aria-hidden="true" />

          <div className="portrait-vignette__pieces" aria-hidden="true">
            <i className="portrait-vignette__piece portrait-vignette__piece--d" data-vignette-piece />
            <i className="portrait-vignette__piece portrait-vignette__piece--triangle" data-vignette-piece />
            <i className="portrait-vignette__piece portrait-vignette__piece--base" data-vignette-piece />
            <i className="portrait-vignette__piece portrait-vignette__piece--n" data-vignette-piece />
          </div>

          <div className="portrait-vignette__top" data-vignette-copy>
            <span>DB Experience</span>
            <span>Da estratégia à entrega</span>
          </div>

          <div className="portrait-vignette__lockup">
            <div className="portrait-vignette__logo" data-vignette-logo>
              <Image
                src="/images/Logo_Fundo_Branco-removebg-preview.png"
                alt="Dany Brandão"
                width={547}
                height={184}
                className="portrait-vignette__logo-image"
                preload
                onLoad={(event) => {
                  void event.currentTarget
                    .decode()
                    .catch(() => undefined)
                    .finally(() => setVignetteLogoReady(true));
                }}
                onError={() => setVignetteLogoReady(true)}
              />
              <span className="portrait-vignette__logo-curtain" data-vignette-logo-curtain aria-hidden="true" />
            </div>
            <p className="portrait-vignette__promise" data-vignette-copy>
              Entender a marca para dar forma à experiência.
            </p>
          </div>

          <div className="portrait-vignette__sequence" data-vignette-copy aria-hidden="true">
            <span data-vignette-step>Entender</span>
            <i data-vignette-step />
            <span data-vignette-step>Planejar</span>
            <i data-vignette-step />
            <span data-vignette-step>Realizar</span>
          </div>
        </div>
      )}

      <div className="portrait-hero__closing" data-hero-closing aria-hidden="true">
        <p className="portrait-hero__closing-label">Dany Brandão / experiências que fazem sentido</p>

        <div className="portrait-hero__marquees">
          <div className="portrait-hero__marquee portrait-hero__marquee--upper">
            <div className="portrait-hero__marquee-track" data-hero-upper>
              <span>{upperPhrase}</span>
              <span>{upperPhrase}</span>
            </div>
          </div>
          <div className="portrait-hero__marquee portrait-hero__marquee--lower">
            <div className="portrait-hero__marquee-track" data-hero-lower>
              <span>{lowerPhrase}</span>
              <span>{lowerPhrase}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="portrait-hero__frame" data-hero-frame data-effect-ready={effectReady} inert={showVignette}>
        <LorenzoInteractivePortrait
          revealImageUrl="/images/Dany Profissional.png"
          forceReveal={showProfessional || isClosing}
          imageTargetSelector="[data-portrait-stage]"
          imageOffsetY={0.012}
          active={!showVignette}
          onReady={handleEffectReady}
        />

        <div className="portrait-hero__layout">
          <div className="portrait-hero__copy">
            <p className="portrait-hero__eyebrow">Planejamento / produção / hospitalidade / execução</p>

            <h1 id="hero-title" className="portrait-hero__quote">
              {impactLines.map((line, index) => (
                <span className="portrait-hero__line" key={line}>
                  <span className="portrait-hero__text">{line}</span>
                  <span
                    className={`portrait-hero__cover portrait-hero__cover--${index + 1}`}
                    aria-hidden="true"
                  />
                </span>
              ))}
            </h1>

            <div className="portrait-hero__intro">
              <p>
                <strong>Antes de produzir, entendemos a marca, o produto e quem será recebido</strong>
                <span>Depois coordenamos cada detalhe, do briefing à execução, para que o cliente perceba apenas tranquilidade</span>
              </p>
              <a href="#contato" className="button portrait-hero__cta">
                <span>Conversar sobre um projeto</span>
                <ArrowUpRight aria-hidden="true" size={17} />
              </a>
            </div>
          </div>

          <div className="portrait-hero__visual">
            <div
              className="portrait-hero__stage"
              data-portrait-stage
              tabIndex={0}
              role="button"
              aria-pressed={showProfessional}
              aria-label={showProfessional ? "Voltar ao retrato casual de Dany Brandão" : "Revelar o retrato profissional de Dany Brandão"}
              onClick={() => setShowProfessional((value) => !value)}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                setShowProfessional((value) => !value);
              }}
            >
              <div className="portrait-hero__image portrait-hero__image--casual">
                <Image
                  src="/images/Dany Casual.png"
                  alt="Dany Brandão em um retrato casual"
                  fill
                  sizes="(max-width: 1023px) 94vw, 48vw"
                  className="portrait-hero__photo"
                  preload
                />
              </div>

              <div className="portrait-hero__fallback" aria-hidden="true" />

              <span className="portrait-hero__mode portrait-hero__mode--casual" aria-hidden="true">Dany / casual</span>
              <span className="portrait-hero__mode portrait-hero__mode--professional" aria-hidden="true">Dany / profissional</span>
            </div>

            <button
              type="button"
              className="portrait-hero__toggle"
              aria-pressed={showProfessional}
              onClick={() => setShowProfessional((value) => !value)}
            >
              <span>{showProfessional ? "Voltar ao retrato casual" : "Ver Dany profissional"}</span>
              <span aria-hidden="true">{showProfessional ? "←" : "→"}</span>
            </button>
          </div>
        </div>
      </div>

      <svg
        className={`${signatureFont.variable} portrait-hero__signature`}
        data-hero-signature
        viewBox="0 0 1200 420"
        role="img"
        aria-label="Assinatura Dany Brandão"
      >
        <text
          className="portrait-hero__signature-stroke"
          data-signature-stroke
          x="600"
          y="248"
          textAnchor="middle"
        >
          Dany Brandão
        </text>
        <text
          className="portrait-hero__signature-fill"
          data-signature-fill
          x="600"
          y="248"
          textAnchor="middle"
        >
          Dany Brandão
        </text>
      </svg>
    </section>
  );
}
