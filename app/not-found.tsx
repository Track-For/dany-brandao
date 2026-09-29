import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found">
      <div>
        <p className="eyebrow">Página não encontrada</p>
        <h1>Essa experiência ainda não existe.</h1>
        <p>
          O endereço pode ter mudado ou o projeto ainda não foi publicado.
        </p>
        <Link href="/" className="button button--light">
          <ArrowLeft aria-hidden="true" size={17} strokeWidth={1.6} />
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
