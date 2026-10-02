"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { LorenzoInteractivePortrait } from "@/components/lorenzo-interactive-portrait";

const identities = [
  {
    id: "casual",
    title: "Dany casual",
    essence: "Escuta, repertório e proximidade para compreender pessoas, marcas e contextos",
  },
  {
    id: "professional",
    title: "Dany profissional",
    essence: "Direção, estratégia e presença para transformar intenção em uma entrega precisa",
  },
] as const;

export function PortraitHero() {
  const [showProfessional, setShowProfessional] = useState(false);
  const [effectReady, setEffectReady] = useState(false);
  const handleEffectReady = useCallback(() => setEffectReady(true), []);

  return (
    <section className="dany-essence" id="sobre" aria-labelledby="about-title">
      <div className="container dany-essence__layout">
        <div className="dany-essence__copy">
          <p className="section-label">Sobre Dany</p>
          <h2 id="about-title">A essência é uma só <br/><span className="details__title-secondary">O contexto muda</span></h2>
          <p className="dany-essence__lead" data-reveal>
            A sensibilidade da Dany casual encontra a clareza da Dany profissional. É dessa combinação que nasce cada experiência
          </p>

          <div className="dany-essence__modes" role="group" aria-label="Conheça as duas dimensões de Dany Brandão">
            {identities.map((identity, index) => {
              const active = index === 1 ? showProfessional : !showProfessional;
              return (
                <button
                  key={identity.id}
                  type="button"
                  className="dany-essence__mode"
                  data-active={active}
                  aria-pressed={active}
                  onClick={() => setShowProfessional(index === 1)}
                >
                  <span>{identity.title}</span>
                  <small>{identity.essence}</small>
                </button>
              );
            })}
          </div>

          <p className="dany-essence__summary" data-reveal>
            Em qualquer linguagem, permanecem o mesmo olhar atento, o cuidado com as relações e a responsabilidade por cada detalhe
          </p>

          <a
            className="dany-essence__social"
            href="https://www.linkedin.com/in/dany-brandão-b10a5ab7/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="dany-essence__social-mark" aria-hidden="true">in</span>
            <span>Conhecer o LinkedIn da Dany</span>
            <ArrowUpRight aria-hidden="true" size={16} />
          </a>
        </div>

        <figure className="dany-essence__portrait" data-effect-ready={effectReady}>
          <div className="dany-essence__stage" data-portrait-stage>
            <Image
              src="/images/Dany casual.png"
              alt="Dany Brandão em um retrato casual"
              fill
              sizes="(max-width: 767px) 94vw, 48vw"
              className="dany-essence__photo"
            />
            <LorenzoInteractivePortrait
              revealImageUrl="/images/Dany profissional.png"
              forceReveal={showProfessional}
              imageTargetSelector="[data-portrait-stage]"
              imageOffsetY={0.096}
              onReady={handleEffectReady}
            />
          </div>
          <figcaption>
            <span>{showProfessional ? "Direção e decisão" : "Proximidade e escuta"}</span>
            <span>Uma Dany, duas dimensões</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
