import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SmoothExperience } from "@/components/smooth-experience";
import { getProject, projects } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} | DB Experience`,
      description: project.summary,
      type: "article",
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((item) => item.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const galleryImage =
    project.image === "/images/project-dinner.png"
      ? "/images/project-plenary.png"
      : "/images/project-dinner.png";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projetos",
        item: "/#projetos",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `/projetos/${project.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />
      <SmoothExperience>
        <main>
          <section className="project-hero" aria-labelledby="project-title">
            <div className="project-hero__image" data-hero-visual>
              <Image
                src={project.image}
                alt={project.alt}
                fill
                preload
                sizes="100vw"
                className="cover-image"
              />
            </div>
            <div className="project-hero__overlay" />
            <div className="container project-hero__content">
              <div>
                <p className="eyebrow" data-hero-reveal>
                  {project.year}
                </p>
                <h1 id="project-title" data-hero-reveal>
                  {project.title}
                </h1>
              </div>
              <div data-hero-reveal>
                <span>{project.type}</span>
                <span>{project.city}</span>
              </div>
            </div>
          </section>

          <section className="project-detail section-space">
            <div className="container">
              <Link className="text-link" href="/#projetos" data-reveal>
                <ArrowLeft aria-hidden="true" size={17} strokeWidth={1.6} />
                Voltar aos projetos
              </Link>

              <div className="project-detail__intro">
                <dl className="project-facts" data-reveal>
                  <div>
                    <dt>Cliente</dt>
                    <dd>{project.client}</dd>
                  </div>
                  <div>
                    <dt>Experiência</dt>
                    <dd>{project.type}</dd>
                  </div>
                  <div>
                    <dt>Local</dt>
                    <dd>{project.city}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{project.year}</dd>
                  </div>
                </dl>
                <p className="project-detail__lead" data-reveal>
                  {project.context}
                </p>
              </div>

              <div className="project-story">
                <article data-reveal>
                  <h2>O desafio</h2>
                  <p>{project.challenge}</p>
                </article>
                <article data-reveal>
                  <h2>O conceito</h2>
                  <p>{project.concept}</p>
                </article>
                <article data-reveal>
                  <h2>A experiência</h2>
                  <p>{project.experience}</p>
                </article>
              </div>

              <div className="project-scope">
                <h2 data-reveal>Escopo realizado.</h2>
                <ul>
                  {project.scope.map((item) => (
                    <li key={item} data-reveal>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="project-gallery">
                <figure className="image-frame" data-reveal>
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, 65vw"
                    className="cover-image"
                    data-parallax
                  />
                </figure>
                <figure className="image-frame" data-reveal>
                  <Image
                    src={galleryImage}
                    alt="Imagem conceitual de apoio para o projeto"
                    fill
                    sizes="(max-width: 767px) 100vw, 35vw"
                    className="cover-image"
                    data-parallax
                  />
                </figure>
              </div>

              <Link
                href={`/projetos/${nextProject.slug}`}
                className="project-next"
                data-reveal
              >
                <div>
                  <p>Próxima experiência</p>
                  <h2>{nextProject.title}</h2>
                </div>
                <ArrowUpRight aria-hidden="true" size={34} strokeWidth={1.3} />
              </Link>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="container footer__top">
            <Link href="/" className="brand-signature" aria-label="Dany Brandão">
              <Image
                src="/images/Logo_Fundo_Branco-removebg-preview.png"
                alt="Dany Brandão"
                width={547}
                height={184}
              />
            </Link>
            <p>
              Experiências corporativas planejadas do primeiro contato ao último
              detalhe.
            </p>
            <Link href="/#contato" className="text-link text-link--light">
              Vamos criar uma experiência
              <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.6} />
            </Link>
          </div>
        </footer>
      </SmoothExperience>
    </>
  );
}
