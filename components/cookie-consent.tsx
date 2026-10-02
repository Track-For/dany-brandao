"use client";

import { useEffect, useState } from "react";

const CONSENT_COOKIE = "db_cookie_consent";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

type ConsentChoice = "all" | "essential";

function hasStoredChoice() {
  return document.cookie
    .split("; ")
    .some((entry) => entry.startsWith(`${CONSENT_COOKIE}=`));
}

function storeChoice(choice: ConsentChoice) {
  document.cookie = `${CONSENT_COOKIE}=${choice}; Max-Age=${ONE_YEAR_SECONDS}; Path=/; SameSite=Lax`;
  window.dispatchEvent(
    new CustomEvent("db:cookie-consent", { detail: { choice } }),
  );
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsVisible(!hasStoredChoice());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const choose = (choice: ConsentChoice) => {
    storeChoice(choice);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      className="cookie-consent"
      aria-labelledby="cookie-consent-title"
      aria-live="polite"
    >
      <div className="cookie-consent__copy">
        <span className="cookie-consent__label">Privacidade</span>
        <p id="cookie-consent-title">
          <strong>Cookies, com clareza.</strong>
          <span>
            Usamos cookies essenciais para o site funcionar e opcionais para
            entender a navegação e melhorar a experiência.
          </span>
        </p>
      </div>
      <div className="cookie-consent__actions">
        <button type="button" onClick={() => choose("essential")}>
          Somente essenciais
        </button>
        <button type="button" onClick={() => choose("all")}>
          Aceitar cookies
        </button>
      </div>
    </aside>
  );
}
