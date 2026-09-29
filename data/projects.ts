export type Project = {
  slug: string;
  title: string;
  client: string;
  type: string;
  city: string;
  year: string;
  image: string;
  alt: string;
  summary: string;
  context: string;
  challenge: string;
  concept: string;
  experience: string;
  scope: string[];
};

export const projects: Project[] = [
  {
    slug: "plenaria-de-marca",
    title: "Plenária de marca",
    client: "Cliente a confirmar",
    type: "Evento corporativo",
    city: "São Paulo",
    year: "Projeto-conceito",
    image: "/images/project-plenary.png",
    alt: "Plenária corporativa contemporânea com instalação cenográfica magenta",
    summary:
      "Um ambiente de conteúdo desenhado para concentrar atenção, traduzir presença de marca e acolher cada convidado.",
    context:
      "Este projeto-conceito demonstra como conteúdo, arquitetura e operação podem formar uma única experiência corporativa.",
    challenge:
      "Criar uma plenária clara e marcante, com presença visual suficiente para representar a marca sem competir com o conteúdo.",
    concept:
      "Uma forma escultórica contínua organiza palco, luz e circulação. O magenta aparece como assinatura, nunca como excesso.",
    experience:
      "Da chegada à última conversa, cada transição foi pensada para manter ritmo, conforto e atenção.",
    scope: [
      "Conceito espacial",
      "Planejamento de produção",
      "Gestão de fornecedores",
      "Hospitalidade",
    ],
  },
  {
    slug: "encontro-executivo",
    title: "Encontro executivo",
    client: "Cliente a confirmar",
    type: "Hospitalidade corporativa",
    city: "São Paulo",
    year: "Projeto-conceito",
    image: "/images/project-dinner.png",
    alt: "Convidados em encontro executivo ao redor de uma mesa contemporânea",
    summary:
      "Hospitalidade, ambiente e ritmo alinhados para criar conversas que acontecem com naturalidade.",
    context:
      "Este projeto-conceito explora um encontro de relacionamento em escala intimista, com atenção especial à forma de receber.",
    challenge:
      "Equilibrar a formalidade de um encontro executivo com a proximidade necessária para relações genuínas.",
    concept:
      "Uma atmosfera precisa e acolhedora, com luz baixa, arte, materiais naturais e serviço presente na medida certa.",
    experience:
      "O fluxo de chegada, a disposição dos lugares e o tempo de serviço favorecem uma noite fluida e confortável.",
    scope: [
      "Curadoria de espaço",
      "Hospitalidade",
      "Ambientação",
      "Coordenação de operação",
    ],
  },
  {
    slug: "hospitalidade-em-foco",
    title: "Hospitalidade em foco",
    client: "Cliente a confirmar",
    type: "RSVP e credenciamento",
    city: "São Paulo",
    year: "Projeto-conceito",
    image: "/images/project-rsvp.png",
    alt: "Equipe organizando credenciais em uma recepção corporativa",
    summary:
      "Uma chegada organizada, humana e coerente com tudo o que a marca deseja comunicar.",
    context:
      "Este projeto-conceito apresenta a recepção como parte central da experiência, não como uma etapa puramente operacional.",
    challenge:
      "Organizar informações, equipe e fluxo de convidados com agilidade, sem perder a qualidade do acolhimento.",
    concept:
      "Tecnologia discreta, materiais táteis e uma equipe preparada criam um primeiro contato seguro e pessoal.",
    experience:
      "Antes do evento começar, o convidado já entende o nível de atenção dedicado a cada detalhe.",
    scope: [
      "Gestão de RSVP",
      "Credenciamento",
      "Treinamento de equipe",
      "Operação de recepção",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
