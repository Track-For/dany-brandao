"use client";

import { useCallback, useRef, useState } from "react";
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
  "",
  "",
];

const upperPhrase = "Antes de produzir, precisamos entender.";
const lowerPhrase = "O cuidado transforma estratégia em experiência.";

export function PortraitHero() {
  const root = useRef<HTMLElement>(null);
  const [showProfessional, setShowProfessional] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [effectReady, setEffectReady] = useState(false);
  const handleEffectReady = useCallback(() => setEffectReady(true), []);

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
          const marquee = gsap.timeline({ repeat: -1 });

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

          setWillChange();

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
              onEnter: resumeScene,
              onEnterBack: resumeScene,
              onLeave: pauseScene,
              onLeaveBack: pauseScene,
              onUpdate: (self) => {
                const nextClosingState = self.progress > 0.03;
                if (nextClosingState === closingActive) return;
                closingActive = nextClosingState;
                setIsClosing(nextClosingState);
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
      data-revealed="true"
      data-portrait-hero
      data-cursor="REVELAR"
      aria-labelledby="hero-title"
    >
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

      <div className="portrait-hero__frame" data-hero-frame data-effect-ready={effectReady}>
        <LorenzoInteractivePortrait
          revealImageUrl="/images/Dany Profissional.png"
          forceReveal={showProfessional || isClosing}
          imageTargetSelector="[data-portrait-stage]"
          imageOffsetY={0.012}
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
                <strong>Experiências corporativas, do briefing à execução</strong>
                <span>Dany planeja, produz e coordena cada etapa para a marca receber seus convidados com tranquilidade</span>
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

              <div className="portrait-hero__fallback" aria-hidden="true">
                <Image
                  src="/images/Dany Profissional.png"
                  alt=""
                  fill
                  sizes="(max-width: 1023px) 94vw, 48vw"
                  className="portrait-hero__fallback-photo"
                  loading="eager"
                  unoptimized
                />
              </div>

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
