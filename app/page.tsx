import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { SiteHeader } from "@/components/site-header";
import { SmoothExperience } from "@/components/smooth-experience";
import { VerticalFilm } from "@/components/vertical-film";
import { VideoLightbox } from "@/components/video-lightbox";

const method = [
  { number: "01", title: "Marca", copy: "O que precisa permanecer reconhecível em qualquer expressão dessa empresa?", image: "/images/Logo Premium.png", alt: "Assinatura oficial Premium da marca Dany Brandão", logo: true },
  { number: "02", title: "Produto", copy: "O que está sendo apresentado, celebrado ou comunicado?", image: "/media/detail-material.jpg", alt: "Equipamentos e materiais preparados para uma experiência" },
  { number: "03", title: "Público", copy: "Quem estará presente e o que essas pessoas precisam perceber?", image: "/media/detail-arrival.jpg", alt: "Equipe recebendo convidados em um evento corporativo" },
  { number: "04", title: "Contexto", copy: "Por que esse encontro existe e que momento da marca ele representa?", image: "/media/detail-architecture.jpg", alt: "Detalhe arquitetônico observado durante a preparação de um evento" },
  { number: "05", title: "Experiência", copy: "Como transformar estratégia em ambiente, hospitalidade, ritmo e detalhe?", image: "/media/detail-audience.jpg", alt: "Convidados reunidos durante uma experiência corporativa" },
  { number: "06", title: "Execução", copy: "Como coordenar a complexidade sem transferi-la para o cliente?", image: "/media/detail-assembly.jpg", alt: "Equipe técnica trabalhando na montagem de uma experiência" },
];

const showcases = [
  { number: "01 / 03", title: "Jantar executivo", image: "/images/project-dinner.png", alt: "Convidados reunidos em um jantar executivo", scope: ["Hospitality", "Guest flow", "Production"] },
  { number: "02 / 03", title: "Plenária corporativa", image: "/images/project-plenary.png", alt: "Plenária corporativa pronta para receber o público", scope: ["Stage", "Content", "Operation"] },
  { number: "03 / 03", title: "Recepção e RSVP", image: "/images/project-rsvp.png", alt: "Equipe organizando recepção e credenciamento", scope: ["RSVP", "Reception", "Detail"] },
];

const partnerRows = [
  [
    { number: "01", segment: "Tecnologia", tone: "teal" },
    { number: "02", segment: "Saúde", tone: "aqua" },
    { number: "03", segment: "Educação", tone: "cream" },
    { number: "04", segment: "Cultura", tone: "pink" },
    { number: "05", segment: "Mobilidade", tone: "blue" },
    { number: "06", segment: "Serviços", tone: "yellow" },
  ],
  [
    { number: "07", segment: "Hospitalidade", tone: "yellow" },
    { number: "08", segment: "Indústria", tone: "blue" },
    { number: "09", segment: "Varejo", tone: "pink" },
    { number: "10", segment: "Bem-estar", tone: "cream" },
    { number: "11", segment: "Finanças", tone: "aqua" },
    { number: "12", segment: "Lifestyle", tone: "teal" },
  ],
];

const systemSteps = ["Briefing", "RSVP", "Fornecedores", "Credenciamento", "Hospitalidade", "Logística", "Produção", "Execução"];
const complexity = ["RSVP", "Logística", "Produção", "Montagem", "Credenciamento", "Fornecedores", "Cronograma", "Hospitalidade", "Operação", "Imprevistos"];

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  name: "Dany Brandão · DB Experience",
  description: "Planejamento, produção, hospitalidade e execução de experiências corporativas construídas a partir da identidade de cada marca.",
  areaServed: { "@type": "City", name: "São Paulo" },
  knowsAbout: ["Experiências corporativas", "Hospitalidade corporativa", "RSVP", "Credenciamento", "Produção de eventos", "Experiências de marca"],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }} />
      <SiteHeader />
      <SmoothExperience>
        <main id="conteudo">
          <section className="hero" data-hero-section aria-labelledby="hero-title">
            <div className="hero__grain" aria-hidden="true" />
            <div className="hero__vignette" data-hero-vignette aria-hidden="true">
              <div className="hero__vignette-frame" />
              <span>DB</span>
              <p>A marca abre a experiência</p>
            </div>
            <div className="container hero__stage">
              <p className="hero__label" data-hero-label>DB Experience</p>
              <div className="hero__microcopy" data-hero-microcopy><span>Corporate experiences</span><span>São Paulo</span></div>
              <h1 id="hero-title" className="hero__title" aria-label="A marca dá o tom. A experiência faz sentir.">
                <span className="hero__phrase hero__phrase--left" aria-hidden="true">
                  <span data-hero-left-line>A marca</span>
                  <span data-hero-left-line>dá o tom</span>
                </span>
                <span className="hero__phrase hero__phrase--right" aria-hidden="true">
                  <span data-hero-right-line>A experiência</span>
                  <span data-hero-right-line>faz sentir</span>
                </span>
              </h1>
              <div className="hero__film-wrap" data-hero-film data-cursor="PLAY">
                <VerticalFilm src="/media/hero-production.mp4" poster="/media/hero-production-poster.jpg" label="Reel 01 / Bastidores reais" caption="Experiências corporativas / São Paulo" objectPosition="center 44%" priority className="hero__film" ariaLabel="Bastidores reais da preparação de uma experiência corporativa" />
              </div>
              <span className="hero__accent-line" data-hero-accent aria-hidden="true" />
              <div className="hero__meta" data-hero-meta>
                <p>Estratégia, hospitalidade, produção e execução para marcas que querem ser sentidas.</p>
                <a href="#contato" className="button button--teal" data-magnetic><span>Conversar sobre um projeto</span><ArrowUpRight aria-hidden="true" size={17} /></a>
              </div>
              <a className="hero__scroll" href="#parceiros" aria-label="Continuar para parceiros"><span>Continuar</span><ArrowDownRight aria-hidden="true" size={17} /></a>
              <p className="hero__resolution" data-hero-resolution><span>Tudo começa</span><span>pela escuta</span></p>
            </div>
          </section>

          <section className="partners" id="parceiros" data-partners-section aria-labelledby="partners-title">
            <header className="container partners__header"><h2 id="partners-title">Parcerias também constroem a experiência</h2><p>Um espaço preparado para receber as marcas parceiras da DB. As identidades abaixo são provisórias</p></header>
            <div className="partners__rows" aria-label="Espaços provisórios para marcas parceiras">
              {partnerRows.map((row, rowIndex) => (
                <div className="partners__rail" key={`row-${rowIndex}`}>
                  <div className="partners__track" data-partners-track data-direction={rowIndex === 0 ? "right" : "left"}>
                    {[...row, ...row].map((partner, index) => (
                      <article className={`partner-card partner-card--${partner.tone}`} key={`${partner.number}-${index}`} aria-hidden={index >= row.length}>
                        <span className="partner-card__mark" aria-hidden="true" /><div><strong>Parceiro {partner.number}</strong><span>{partner.segment}</span></div><span className="partner-card__index">P/{partner.number}</span>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="language" id="linguagens" data-language-section aria-labelledby="language-title">
            <div className="language__pin" data-language-pin>
              <div className="language__track" data-language-track>
                <article className="language-panel language-panel--classic" data-language-panel>
                  <p className="language-panel__index">01 / Clássico</p>
                  <h2 id="language-title"><span>Clássico</span> não é parado</h2>
                  <p className="language-panel__lead">É saber o que deve permanecer</p>
                  <figure className="language-panel__classic-media" data-language-media><Image src="/media/detail-architecture.jpg" alt="Detalhe clássico de arquitetura observado em um projeto real" fill sizes="(max-width: 1023px) 74vw, 38vw" className="cover-image" /></figure>
                </article>

                <article className="language-panel language-panel--transform" data-language-panel>
                  <p className="language-panel__index">02 / Transformação</p>
                  <h3>A forma se move<br />A intenção permanece</h3>
                  <figure className="language-panel__transform-media" data-language-media><Image src="/images/project-plenary.png" alt="Cenografia de uma plenária corporativa" fill sizes="(max-width: 1023px) 82vw, 52vw" className="cover-image" /></figure>
                  <div className="language-panel__coordinates" aria-hidden="true"><span>Estratégia</span><span>Ritmo</span><span>Presença</span></div>
                </article>

                <article className="language-panel language-panel--contemporary" data-language-panel>
                  <p className="language-panel__index">03 / Contemporâneo</p>
                  <div className="language-panel__films">
                    <VerticalFilm src="/media/hero-production.mp4" poster="/media/hero-production-poster.jpg" label="Ritmo" objectPosition="center 42%" className="language__film language__film--one" ariaLabel="Montagem de uma experiência contemporânea" />
                    <VerticalFilm src="/media/dany-story.mp4" poster="/video/posters/dany-story.jpg" label="Presença" objectPosition="center 38%" className="language__film language__film--two" ariaLabel="Dany acompanhando uma experiência contemporânea" />
                  </div>
                  <div className="language-panel__pop-copy"><h3><span>Moderno</span> não é barulhento</h3><p>É saber quando a linguagem precisa mudar</p></div>
                  <span className="language__yellow-mark" aria-hidden="true" />
                </article>
              </div>
              <div className="language__progress" aria-hidden="true"><span data-language-progress /></div>
            </div>
          </section>

          <section className="language-handoff" data-language-handoff aria-label="Conclusão da transição de linguagem">
            <div className="container language-handoff__inner">
              <p>Uma marca / múltiplas linguagens</p>
              <h2><span>O estilo muda</span><span>O cuidado não</span></h2>
            </div>
          </section>

          <section className="zoom-bridge" data-zoom-section aria-label="Transição para o método">
            <div className="zoom-bridge__pin"><div className="zoom-bridge__copy" aria-hidden="true"><span data-zoom-left>Antes da experiência,</span><span data-zoom-right>vem o entendimento</span></div><figure className="zoom-bridge__media" data-zoom-media><Image src="/images/project-dinner.png" alt="Estrutura técnica organizada antes de uma experiência" fill sizes="100vw" className="cover-image" /></figure></div>
          </section>

          <section className="method" id="metodo" aria-labelledby="method-title">
            <div className="method__pin" data-method-pin>
              <header className="container method__header"><p className="section-label">Método DB</p><h2 id="method-title"><span>Antes de produzir,</span><span>precisamos entender</span></h2></header>
              <aside className="method__mobile-status" aria-hidden="true"><p><span data-method-current>01</span> / 06</p><strong data-method-current-title>Marca</strong><i><b data-method-mobile-progress /></i></aside>
              <div className="container method__stage">
                <div className="method__numbers" aria-hidden="true">{method.map((item) => <span key={item.number} data-method-number>{item.number}</span>)}</div>
                <div className="method__chapters">
                  {method.map((item) => (
                    <article key={item.number} data-method-chapter data-method-index={item.number}>
                      <p>{item.number} / 06</p><h3>{item.title}</h3><div className="method__copy">{item.copy}</div>
                      <figure className={item.logo ? "method__mobile-visual method__mobile-visual--logo" : "method__mobile-visual"}><Image src={item.image} alt={item.alt} fill sizes="(max-width: 1023px) 88vw, 1px" className={item.logo ? "contain-image" : "cover-image"} /></figure>
                    </article>
                  ))}
                </div>
                <div className="method__visuals">{method.map((item) => <figure key={item.number} className={item.logo ? "method__visual method__visual--logo" : "method__visual"} data-method-visual><Image src={item.image} alt={item.alt} fill sizes="34vw" className={item.logo ? "contain-image" : "cover-image"} /></figure>)}</div>
              </div>
              <div className="container method__progress" aria-hidden="true"><div className="method__progress-line"><span data-method-progress /></div><div className="method__markers">{method.map((item) => <span key={item.number} data-method-marker>{item.number}</span>)}</div></div>
            </div>
          </section>

          <section className="discretion" aria-labelledby="discretion-title"><div className="container discretion__inner"><p className="section-label">Discrição também é cuidado</p><h2 id="discretion-title">Algumas experiências são feitas para serem vividas, não publicadas.</h2><p data-reveal>Nem todo projeto precisa ser exposto para demonstrar a forma como pensamos, planejamos e executamos. A confiança também está no que sabemos preservar.</p></div></section>

          <section className="details" id="detalhes" aria-labelledby="details-title">
            <header className="container details__header"><p className="section-label">O que sustenta a percepção</p><h2 id="details-title">O todo é percebido. Os detalhes constroem.</h2></header>
            <div className="details__story">
              <figure className="detail-frame detail-frame--full" data-detail-frame data-cursor="DETAIL"><Image src="/media/detail-direction.jpg" alt="Dany orientando a preparação de um ambiente" fill sizes="100vw" className="cover-image" /><figcaption>Direção / antes da chegada</figcaption></figure>
              <div className="detail-row detail-row--video"><VerticalFilm src="/media/dany-story.mp4" poster="/video/posters/dany-story.jpg" label="Presença" caption="Acompanhamento próximo" objectPosition="center 38%" className="detail-film detail-film--small" ariaLabel="Dany acompanhando os detalhes de uma experiência real" /><p data-reveal>O cuidado aparece no que o convidado sente e no que o cliente nem precisa acompanhar.</p></div>
              <figure className="detail-frame detail-frame--left" data-detail-frame data-cursor="DETAIL"><Image src="/media/detail-architecture.jpg" alt="Vitral e textura arquitetônica do espaço" fill sizes="(max-width: 767px) 78vw, 45vw" className="cover-image" /><figcaption>Contexto / cada lugar pede uma leitura</figcaption></figure>
              <div className="detail-row detail-row--reel"><p data-reveal>Ritmo, textura, hospitalidade e operação fazem parte da mesma decisão.</p><VerticalFilm src="/media/manifesto-event.mp4" poster="/media/manifesto-event-poster.jpg" label="Operação" caption="Do primeiro contato ao último detalhe" objectPosition="center 44%" className="detail-film detail-film--tall" ariaLabel="Operação de uma experiência corporativa real" /></div>
            </div>
          </section>

          <section className="showcase" id="experiencias" aria-labelledby="showcase-title">
            <div className="showcase__pin" data-showcase-pin>
              <header className="container showcase__header"><p>Experiências reais / sem exposição indevida</p><h2 id="showcase-title">Experiências, sem precisar contar tudo.</h2></header>
              <div className="showcase__viewport"><div className="showcase__track" data-showcase-track>
                {showcases.map((item, index) => (
                  <article className="showcase-card" key={item.title} data-cursor="VIEW"><div className="showcase-card__media"><Image src={item.image} alt={item.alt} fill preload={index === 0} sizes="(max-width: 1023px) 100vw, 70vw" className="cover-image" /><div className="showcase-card__scope">{item.scope.map((scope) => <span key={scope}>{scope}</span>)}</div></div><div className="showcase-card__meta"><span>{item.number}</span><h3>{item.title}</h3>{index === 0 ? <VideoLightbox src="/media/hero-production.mp4" poster="/media/hero-production-poster.jpg" /> : <ArrowUpRight aria-hidden="true" size={22} />}</div></article>
                ))}
              </div></div>
            </div>
          </section>

          <section className="system" aria-labelledby="system-title"><div className="container system__layout"><div><p className="section-label">Visão 360°</p><h2 id="system-title">Enquanto o convidado vê o evento, nós vemos todo o sistema.</h2></div><div className="system__orbit" data-system-orbit aria-label="Etapas coordenadas pela DB Experience"><span className="system__center">Uma experiência</span>{systemSteps.map((step, index) => <span className={`system__step system__step--${index + 1}`} key={step}>{step}</span>)}</div></div></section>

          <section className="complexity" data-complexity-section aria-labelledby="complexity-title">
            <div className="complexity__pin" data-complexity-pin><p className="section-label">O que você não precisa ver</p><h2 id="complexity-title" className="sr-only">Da complexidade à tranquilidade</h2><div className="complexity__words" aria-hidden="true">{complexity.map((word, index) => <span className={`complexity__word complexity__word--${index + 1}`} key={word} data-complexity-word>{word}</span>)}</div><p className="complexity__result" data-complexity-result>Tranquilidade</p><p className="complexity__explain">A DB organiza a complexidade para o cliente viver apenas o que importa.</p></div>
          </section>

          <section className="manifesto" data-manifesto-section aria-labelledby="manifesto-title">
            <div className="manifesto__pin" data-manifesto-pin><VerticalFilm src="/media/manifesto-event.mp4" poster="/media/manifesto-event-poster.jpg" objectPosition="center 44%" className="manifesto__film" ariaLabel="Recepção e bastidores de uma experiência corporativa real" /><div className="manifesto__overlay" /><div className="container manifesto__copy"><h2 id="manifesto-title"><span data-manifesto-line>Você não precisa pensar em cada detalhe.</span><span data-manifesto-line>Nós precisamos.</span></h2></div></div>
          </section>

          <section className="about" id="sobre" aria-labelledby="about-title"><div className="container about__layout"><figure className="about__portrait" data-about-image data-cursor="DETAIL"><Image src="/media/dany-portrait.jpg" alt="Dany Brandão acompanhando pessoalmente uma experiência" fill sizes="(max-width: 1023px) 100vw, 42vw" className="cover-image" /><span className="about__shape about__shape--one" aria-hidden="true" /><span className="about__shape about__shape--two" aria-hidden="true" /></figure><div className="about__copy"><p className="section-label">Sobre Dany</p><h2 id="about-title">Um olhar treinado para perceber o que muitas vezes passa despercebido.</h2><p data-reveal>A trajetória de Dany no universo artístico desenvolveu sensibilidade para estética, comportamento, presença e experiência.</p><p data-reveal>Hoje, esse olhar se combina com planejamento, produção e operação na criação de experiências corporativas coerentes com cada marca.</p></div></div></section>

          <section className="contact" id="contato" aria-labelledby="contact-title">
            <div className="container contact__headline"><p className="section-label">Uma conversa é o primeiro passo</p><h2 id="contact-title">Sua marca já tem uma identidade. Nosso trabalho é fazer as pessoas sentirem isso.</h2><p>Conte o que você está planejando. O restante começa com uma conversa.</p></div>
            <div className="container contact__layout"><div className="contact__note" data-reveal><span>Estratégia</span><span>Hospitalidade</span><span>Produção</span><span>Execução</span><div className="contact__promise"><Check aria-hidden="true" size={18} /><p>Uma conversa objetiva, tratada com cuidado e discrição.</p></div></div><div data-reveal><ContactForm /></div></div>
          </section>
        </main>

        <footer className="footer"><div className="container footer__top"><Link href="/" className="brand-signature" aria-label="Dany Brandão, página inicial"><Image src="/images/Logo_Fundo_Branco-removebg-preview.png" alt="Dany Brandão" width={547} height={184} /></Link><p>DB Experience<br />Corporate Experiences<br />São Paulo</p><a href="#contato" className="text-link"><span>Conversar sobre um projeto</span><ArrowRight aria-hidden="true" size={17} /></a></div><div className="container footer__bottom"><span>© {new Date().getFullYear()} Dany Brandão</span><span>Contato via formulário</span><span>Privacidade e discrição por princípio</span></div></footer>
      </SmoothExperience>
    </>
  );
}
