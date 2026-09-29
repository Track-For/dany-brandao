import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { SiteHeader } from "@/components/site-header";
import { SmoothExperience } from "@/components/smooth-experience";
import { VideoLightbox } from "@/components/video-lightbox";

const method = [
  { number: "01", title: "Marca", copy: "O que precisa permanecer reconhecível em qualquer expressão dessa empresa?", image: "/images/Logo Premium.png", alt: "Assinatura oficial Premium da marca Dany Brandão", logo: true },
  { number: "02", title: "Produto", copy: "O que exatamente está sendo apresentado, celebrado ou comunicado?", image: "/media/detail-material.jpg", alt: "Equipamentos e materiais sendo preparados para uma experiência" },
  { number: "03", title: "Público", copy: "Quem estará presente e o que essas pessoas precisam perceber?", image: "/media/detail-arrival.jpg", alt: "Equipe recebendo convidados em um evento corporativo" },
  { number: "04", title: "Contexto", copy: "Por que esse encontro existe?", image: "/media/detail-architecture.jpg", alt: "Detalhe arquitetônico observado durante a preparação de um evento" },
  { number: "05", title: "Experiência", copy: "Como transformar estratégia em ambiente, hospitalidade, ritmo e detalhe?", image: "/media/detail-audience.jpg", alt: "Convidados reunidos durante uma experiência corporativa" },
  { number: "06", title: "Execução", copy: "Como coordenar toda a complexidade sem transferi-la para o cliente?", image: "/media/detail-assembly.jpg", alt: "Equipe técnica trabalhando na montagem de uma experiência" },
];

const details = [
  { image: "/media/detail-direction.jpg", alt: "Dany orientando a preparação de um ambiente", label: "Direction", className: "detail-card--wide" },
  { image: "/media/detail-material.jpg", alt: "Materiais técnicos preparados nos bastidores", label: "Production", className: "detail-card--portrait" },
  { image: "/media/detail-architecture.jpg", alt: "Vitral e textura arquitetônica do espaço", label: "Context", className: "detail-card--small" },
  { image: "/media/detail-installation.jpg", alt: "Instalação visual sendo finalizada no local do evento", label: "Detail", className: "detail-card--offset" },
  { image: "/media/detail-hospitality.jpg", alt: "Composição de hospitalidade preparada para convidados", label: "Hospitality", className: "detail-card--tall" },
  { image: "/media/detail-reception.jpg", alt: "Equipe alinhando a recepção antes da chegada dos convidados", label: "Reception", className: "detail-card--medium" },
  { image: "/media/detail-arrival.jpg", alt: "Recepção em andamento durante uma experiência corporativa", label: "Hospitality", className: "detail-card--landscape" },
  { image: "/media/detail-assembly.jpg", alt: "Estrutura sendo organizada durante a montagem", label: "Production", className: "detail-card--final" },
];

const showcases = [
  { number: "01 / 05", title: "Corporate experience", image: "/media/detail-arrival.jpg", alt: "Chegada de convidados a uma experiência corporativa", scope: ["RSVP", "Hospitality", "Production"] },
  { number: "02 / 05", title: "Executive reception", image: "/media/detail-direction.jpg", alt: "Direção cuidadosa de uma recepção executiva", scope: ["Reception", "Flow", "Operation"] },
  { number: "03 / 05", title: "Hospitality", image: "/media/detail-hospitality.jpg", alt: "Detalhe de hospitalidade criado para convidados", scope: ["Care", "Service", "Detail"] },
  { number: "04 / 05", title: "Brand experience", image: "/media/detail-installation.jpg", alt: "Material de marca sendo instalado em uma experiência", scope: ["Brand", "Environment", "Production"] },
  { number: "05 / 05", title: "Custom project", image: "/media/detail-assembly.jpg", alt: "Bastidores da montagem de um projeto sob medida", scope: ["Planning", "Logistics", "Execution"] },
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
const complexity = ["RSVP", "Fornecedores", "Cronograma", "Logística", "Credenciamento", "Montagem", "Hospitalidade", "Produção", "Operação", "Imprevistos"];

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
          <section className="hero" data-hero-pin aria-labelledby="hero-title">
            <div className="hero__premium-field" aria-hidden="true" />
            <div className="hero__media" data-hero-media data-cursor="PLAY">
              <video autoPlay muted loop playsInline preload="metadata" poster="/media/hero-production-poster.jpg" aria-label="Bastidores reais da preparação de uma experiência corporativa">
                <source src="/media/hero-production.mp4" type="video/mp4" />
              </video>
              <span className="hero__media-note">Bastidores reais · São Paulo</span>
            </div>
            <div className="container hero__content" data-hero-copy>
              <p className="hero__label" data-hero-reveal>Dany Brandão · DB Experience</p>
              <h1 id="hero-title" data-hero-reveal>
                <span>Entendemos a marca.</span>
                <span>Traduzimos em experiência.</span>
              </h1>
              <p className="hero__lead" data-hero-reveal>Experiências corporativas construídas a partir do entendimento da marca, do produto e de quem será recebido.</p>
              <div className="hero__actions" data-hero-reveal>
                <a href="#linguagens" className="button button--cream" data-magnetic><span>Conheça como pensamos</span><ArrowDownRight aria-hidden="true" size={17} /></a>
                <a href="#contato" className="text-link text-link--cream" data-magnetic><span>Conversar sobre um projeto</span><ArrowUpRight aria-hidden="true" size={17} /></a>
              </div>
            </div>
            <p className="hero__final" data-hero-final>Primeiro, entendemos.</p>
          </section>

          <section className="partners" id="parceiros" data-partners-section aria-labelledby="partners-title">
            <header className="container partners__header">
              <div>
                <p className="section-label">Parceiros da marca</p>
                <h2 id="partners-title" data-title-reveal>
                  <span className="reveal-line"><span>Parcerias também</span></span>
                  <span className="reveal-line"><span>constroem a experiência.</span></span>
                </h2>
              </div>
              <p>Espaço preparado para receber as marcas parceiras da DB Experience. As identidades abaixo são ilustrativas nesta versão.</p>
            </header>

            <div className="partners__rows" aria-label="Espaços provisórios para marcas parceiras">
              {partnerRows.map((row, rowIndex) => (
                <div className="partners__rail" key={`row-${rowIndex}`}>
                  <div className="partners__track" data-partners-track data-direction={rowIndex === 0 ? "right" : "left"}>
                    {[...row, ...row].map((partner, index) => (
                      <article
                        className={`partner-card partner-card--${partner.tone}`}
                        key={`${partner.number}-${index}`}
                        aria-hidden={index >= row.length}
                      >
                        <span className="partner-card__index">P/{partner.number}</span>
                        <div>
                          <strong>Parceiro {partner.number}</strong>
                          <span>{partner.segment}</span>
                        </div>
                        <span className="partner-card__status">Identidade provisória</span>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="language" id="linguagens" data-language-section aria-labelledby="language-title">
            <div className="language__pin" data-language-pin>
              <div className="container language__heading">
                <p className="section-label">Uma marca · múltiplas linguagens</p>
                <h2 id="language-title" data-title-reveal aria-label="Do clássico ao contemporâneo.">
                  <span className="reveal-line" aria-hidden="true"><span>Do clássico</span></span>
                  <span className="reveal-line" aria-hidden="true"><span>ao contemporâneo.</span></span>
                </h2>
              </div>
              <div className="language__composition" data-language-composition>
                <figure className="language__image language__image--premium">
                  <Image src="/media/detail-architecture.jpg" alt="Detalhe clássico de arquitetura observado em um projeto real" fill sizes="(max-width: 1023px) 86vw, 42vw" className="cover-image" />
                </figure>
                <figure className="language__image language__image--pop" data-language-pop>
                  <Image src="/media/detail-installation.jpg" alt="Instalação visual vibrante sendo montada em um projeto real" fill sizes="(max-width: 1023px) 86vw, 42vw" className="cover-image" />
                </figure>
                <span className="language__state language__state--premium">Premium</span>
                <span className="language__state language__state--pop">Pop</span>
                <span className="language__yellow-mark" aria-hidden="true" />
              </div>
              <div className="container language__statement">
                <p data-language-first>A linguagem muda.</p>
                <p data-language-last>A essência permanece.</p>
              </div>
            </div>
          </section>

          <section className="zoom-bridge" data-zoom-section aria-label="Transição para o método">
            <div className="zoom-bridge__copy" aria-hidden="true"><span data-zoom-left>Antes da experiência,</span><span data-zoom-right>vem o entendimento.</span></div>
            <figure className="zoom-bridge__media" data-zoom-media><Image src="/images/project-dinner.png" alt="Estrutura técnica sendo organizada antes de uma experiência" fill sizes="100vw" className="cover-image" /></figure>
          </section>

          <section className="method" id="metodo" aria-labelledby="method-title">
            <div className="method__pin" data-method-pin>
              <header className="container method__header">
                <p className="section-label">Método DB</p>
                <h2 id="method-title" data-title-reveal>
                  <span className="reveal-line"><span>Antes de produzir,</span></span>
                  <span className="reveal-line"><span>precisamos entender.</span></span>
                </h2>
              </header>
              <div className="container method__stage">
                <div className="method__numbers" aria-hidden="true">{method.map((item) => <span key={item.number} data-method-number>{item.number}</span>)}</div>
                <div className="method__chapters">{method.map((item) => <article key={item.number} data-method-chapter><p>{item.number} — {item.title}</p><h3>{item.title}</h3><div className="method__copy">{item.copy}</div></article>)}</div>
                <div className="method__visuals">
                  {method.map((item) => (
                    <figure key={item.number} className={item.logo ? "method__visual method__visual--logo" : "method__visual"} data-method-visual>
                      <Image src={item.image} alt={item.alt} fill sizes="(max-width: 1023px) 100vw, 34vw" className={item.logo ? "contain-image" : "cover-image"} />
                    </figure>
                  ))}
                </div>
              </div>
              <div className="container method__progress" aria-hidden="true">
                <div className="method__progress-line"><span data-method-progress /></div>
                <div className="method__markers">{method.map((item) => <span key={item.number} data-method-marker>{item.number}</span>)}</div>
              </div>
            </div>
          </section>

          <section className="discretion" aria-labelledby="discretion-title">
            <div className="container discretion__inner">
              <p className="section-label">Discrição também é cuidado</p>
              <h2 id="discretion-title" data-title-reveal>
                <span className="reveal-line"><span>Algumas experiências são feitas</span></span>
                <span className="reveal-line"><span>para serem vividas, não publicadas.</span></span>
              </h2>
              <p data-reveal>Nem todo projeto precisa ser exposto para demonstrar a forma como pensamos, planejamos e executamos. A confiança também está no que sabemos preservar.</p>
            </div>
          </section>

          <section className="details section-space" id="detalhes" aria-labelledby="details-title">
            <div className="container details__header">
              <p className="section-label">O que sustenta a percepção</p>
              <h2 id="details-title" data-title-reveal><span className="reveal-line"><span>O todo é percebido.</span></span><span className="reveal-line"><span>Os detalhes constroem.</span></span></h2>
            </div>
            <div className="container details__mosaic">
              {details.slice(0, 4).map((item) => <figure className={`detail-card ${item.className}`} key={item.image} data-reveal data-cursor="DETAIL"><Image src={item.image} alt={item.alt} fill sizes="(max-width: 767px) 100vw, 50vw" className="cover-image" data-parallax /><figcaption>{item.label}</figcaption></figure>)}
              <figure className="detail-card detail-card--video" data-reveal data-cursor="PLAY">
                <video muted loop playsInline preload="none" poster="/media/dany-portrait.jpg" data-lazy-video aria-label="Dany acompanhando os detalhes de uma experiência real"><source src="/media/dany-story.mp4" type="video/mp4" /></video>
                <figcaption>Presence</figcaption>
              </figure>
              {details.slice(4).map((item) => <figure className={`detail-card ${item.className}`} key={item.image} data-reveal data-cursor="DETAIL"><Image src={item.image} alt={item.alt} fill sizes="(max-width: 767px) 100vw, 50vw" className="cover-image" data-parallax /><figcaption>{item.label}</figcaption></figure>)}
            </div>
          </section>

          <section className="showcase" id="experiencias" aria-labelledby="showcase-title">
            <div className="showcase__pin" data-showcase-pin>
              <header className="container showcase__header"><p className="section-label">Experiências reais · sem exposição indevida</p><h2 id="showcase-title">Experiências, sem precisar contar tudo.</h2></header>
              <div className="showcase__viewport"><div className="showcase__track" data-showcase-track>
                {showcases.map((item, index) => (
                  <article className="showcase-card" key={item.title} data-cursor="VIEW">
                    <div className="showcase-card__media"><Image src={item.image} alt={item.alt} fill loading="eager" sizes="(max-width: 1023px) 86vw, 70vw" className="cover-image" /><div className="showcase-card__scope">{item.scope.map((scope) => <span key={scope}>{scope}</span>)}</div></div>
                    <div className="showcase-card__meta"><span>{item.number}</span><h3>{item.title}</h3>{index === 0 ? <VideoLightbox src="/media/hero-production.mp4" poster="/media/hero-production-poster.jpg" /> : <ArrowUpRight aria-hidden="true" size={22} />}</div>
                  </article>
                ))}
              </div></div>
            </div>
          </section>

          <section className="system section-space" aria-labelledby="system-title">
            <div className="container system__layout">
              <div><p className="section-label">Visão 360°</p><h2 id="system-title" data-title-reveal><span className="reveal-line"><span>Enquanto o convidado vê o evento,</span></span><span className="reveal-line"><span>nós vemos todo o sistema.</span></span></h2></div>
              <div className="system__orbit" data-system-orbit aria-label="Etapas coordenadas pela DB Experience"><span className="system__center">Uma experiência</span>{systemSteps.map((step, index) => <span className={`system__step system__step--${index + 1}`} key={step}>{step}</span>)}</div>
            </div>
          </section>

          <section className="complexity" data-complexity-section aria-labelledby="complexity-title">
            <div className="complexity__pin" data-complexity-pin>
              <p className="section-label">O que você não precisa ver</p><h2 id="complexity-title" className="sr-only">Da complexidade à tranquilidade</h2>
              <div className="complexity__words" aria-hidden="true">{complexity.map((word, index) => <span className={`complexity__word complexity__word--${index + 1}`} key={word} data-complexity-word>{word}</span>)}</div>
              <p className="complexity__result" data-complexity-result>Tranquilidade.</p>
              <p className="complexity__explain">A DB absorve e organiza a complexidade para o cliente viver apenas o que importa.</p>
            </div>
          </section>

          <section className="manifesto" data-manifesto-section aria-labelledby="manifesto-title">
            <div className="manifesto__pin" data-manifesto-pin>
              <video muted loop playsInline preload="none" poster="/media/manifesto-event-poster.jpg" data-lazy-video data-manifesto-video aria-label="Recepção e bastidores de uma experiência corporativa real"><source src="/media/manifesto-event.mp4" type="video/mp4" /></video>
              <div className="manifesto__overlay" />
              <div className="container manifesto__copy"><h2 id="manifesto-title"><span data-manifesto-line>Você não precisa pensar em cada detalhe.</span><span data-manifesto-line>Nós precisamos.</span></h2><VideoLightbox src="/media/manifesto-event.mp4" poster="/media/manifesto-event-poster.jpg" /></div>
            </div>
          </section>

          <section className="about section-space" id="sobre" aria-labelledby="about-title">
            <div className="container about__layout">
              <figure className="about__portrait" data-about-image data-cursor="DETAIL"><Image src="/media/dany-portrait.jpg" alt="Dany Brandão acompanhando pessoalmente uma experiência" fill sizes="(max-width: 1023px) 100vw, 42vw" className="cover-image" /><span className="about__shape about__shape--one" aria-hidden="true" /><span className="about__shape about__shape--two" aria-hidden="true" /></figure>
              <div className="about__copy"><p className="section-label">Sobre Dany</p><h2 id="about-title" data-title-reveal><span className="reveal-line"><span>Um olhar treinado para perceber</span></span><span className="reveal-line"><span>o que muitas vezes passa despercebido.</span></span></h2><p data-reveal>A trajetória de Dany no universo artístico desenvolveu sensibilidade para estética, comportamento, presença e experiência.</p><p data-reveal>Hoje, esse olhar se combina com planejamento, produção e operação na criação de experiências corporativas coerentes com cada marca.</p></div>
            </div>
          </section>

          <section className="contact section-space" id="contato" aria-labelledby="contact-title">
            <div className="container contact__headline"><p className="section-label">Uma conversa é o primeiro passo</p><h2 id="contact-title" data-title-reveal><span className="reveal-line"><span>Sua marca já tem uma identidade.</span></span><span className="reveal-line"><span>Nosso trabalho é fazer as pessoas sentirem isso.</span></span></h2><p>Conte o que você está planejando. O restante começa com uma conversa.</p></div>
            <div className="container contact__layout">
              <div className="contact__note" data-reveal><span>Estratégia</span><span>Hospitalidade</span><span>Produção</span><span>Execução</span><div className="contact__promise"><Check aria-hidden="true" size={18} /><p>Uma conversa objetiva, tratada com cuidado e discrição.</p></div></div>
              <div data-reveal><ContactForm /></div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="container footer__top"><Link href="/" className="brand-signature" aria-label="Dany Brandão, página inicial"><Image src="/images/Logo_Fundo_Branco-removebg-preview.png" alt="Dany Brandão" width={547} height={184} /></Link><p>DB Experience<br />Corporate Experiences<br />São Paulo</p><a href="#contato" className="text-link"><span>Conversar sobre um projeto</span><ArrowRight aria-hidden="true" size={17} /></a></div>
          <div className="container footer__bottom"><span>© {new Date().getFullYear()} Dany Brandão</span><span>Contato via formulário</span><span>Privacidade e discrição por princípio</span></div>
        </footer>
      </SmoothExperience>
    </>
  );
}
