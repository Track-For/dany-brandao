"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const navigation = [
  ["Home", "/#conteudo"],
  ["Como pensamos", "/#metodo"],
  ["Experiências", "/#experiencias"],
  ["Dany", "/#sobre"],
  ["Contato", "/#contato"],
];

export function SiteHeader() {
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      let scrolled = false;
      ScrollTrigger.create({
        start: 40,
        end: "max",
        onUpdate: (trigger) => {
          const next = trigger.scroll() > 40;
          if (next !== scrolled) {
            scrolled = next;
            header.current?.classList.toggle("is-scrolled", next);
          }
        },
      });
    },
    { scope: header },
  );

  useGSAP(
    () => {
      if (!open) return;
      gsap.fromTo(
        ".mobile-menu nav a, .mobile-menu__footer",
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.55,
          stagger: 0.055,
          ease: "power3.out",
        },
      );
    },
    { scope: header, dependencies: [open] },
  );

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const menu = header.current?.querySelector<HTMLElement>(".mobile-menu");
    const triggerButton = menuButton.current;
    const focusable = Array.from(
      menu?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [],
    );
    if (open) window.requestAnimationFrame(() => focusable[0]?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !open || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKeyDown);
      if (open) triggerButton?.focus();
    };
  }, [open]);

  return (
    <header ref={header} className="site-header">
      <div className="site-header__inner">
        <Link
          href="/#conteudo"
          className="brand-signature brand-signature--header"
          aria-label="DB Experience, página inicial"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/Logo_Fundo_Branco-removebg-preview.png"
            alt="Dany Brandão"
            width={547}
            height={184}
            preload
          />
        </Link>

        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigation.filter(([label]) => label !== "Contato").map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
        </nav>

        <Link className="header-cta" href="/#contato">
          Conversar sobre um projeto
          <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.6} />
        </Link>

        <button
          ref={menuButton}
          type="button"
          className="menu-button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        id="mobile-menu"
        className="mobile-menu"
        data-open={open}
        aria-hidden={!open}
      >
        <nav aria-label="Navegação mobile">
          {navigation.map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}>
              {label}
              <ArrowUpRight aria-hidden="true" size={22} strokeWidth={1.4} />
            </Link>
          ))}
        </nav>
        <div className="mobile-menu__footer">
          <p>Uma marca. Múltiplas linguagens. O mesmo cuidado.</p>
          <span>Dany Brandão / DB Experience</span>
        </div>
      </div>
    </header>
  );
}
