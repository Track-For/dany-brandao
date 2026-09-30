"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight } from "lucide-react";

type FormFields = {
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  eventType: string;
  guests: string;
  city: string;
  date: string;
  message: string;
};

const initialFields: FormFields = {
  name: "",
  company: "",
  email: "",
  whatsapp: "",
  eventType: "",
  guests: "",
  city: "",
  date: "",
  message: "",
};

const whatsappNumber = "5511981614592";

function buildWhatsAppMessage(fields: FormFields) {
  const eventDetails = [
    fields.eventType ? fields.eventType : "",
    fields.guests ? `para aproximadamente ${fields.guests} pessoas` : "",
    fields.city ? `em ${fields.city}` : "",
    fields.date ? `com data prevista para ${fields.date}` : "",
  ].filter(Boolean);

  const lines = [
    "Olá, Dany! Conheci a DB Experience pelo site.",
    eventDetails.length
      ? `Estou planejando ${eventDetails.join(" ")} e gostaria de conversar sobre o projeto.`
      : "Gostaria de conversar sobre um projeto.",
    fields.name ? `Nome: ${fields.name}` : "",
    fields.company ? `Empresa: ${fields.company}` : "",
    fields.email ? `E-mail: ${fields.email}` : "",
    fields.whatsapp ? `WhatsApp: ${fields.whatsapp}` : "",
    fields.message ? `Mensagem: ${fields.message}` : "",
  ].filter(Boolean);

  return lines.join("\n\n");
}

export function ContactForm() {
  const [fields, setFields] = useState(initialFields);
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const update = (field: keyof FormFields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    if (status !== "idle") setStatus("idle");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = buildWhatsAppMessage(fields);
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setStatus("sent");
  };

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="field-grid">
        <label>
          <span>Nome</span>
          <input
            name="name"
            autoComplete="name"
            value={fields.name}
            onChange={(event) => update("name", event.target.value)}
            required
          />
        </label>
        <label>
          <span>Empresa</span>
          <input
            name="company"
            autoComplete="organization"
            value={fields.company}
            onChange={(event) => update("company", event.target.value)}
          />
        </label>
        <label>
          <span>E-mail</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={(event) => update("email", event.target.value)}
            required
          />
        </label>
        <label>
          <span>WhatsApp</span>
          <input
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            value={fields.whatsapp}
            onChange={(event) => update("whatsapp", event.target.value)}
          />
        </label>
        <label>
          <span>Tipo de evento</span>
          <select
            name="eventType"
            value={fields.eventType}
            onChange={(event) => update("eventType", event.target.value)}
            required
          >
            <option value="">Selecione</option>
            <option>Evento corporativo</option>
            <option>Confraternização</option>
            <option>Experiência de marca</option>
            <option>Recepção e hospitalidade</option>
            <option>Outro projeto</option>
          </select>
        </label>
        <label>
          <span>Número aproximado de convidados</span>
          <input
            name="guests"
            inputMode="numeric"
            value={fields.guests}
            onChange={(event) => update("guests", event.target.value)}
          />
        </label>
        <label>
          <span>Cidade</span>
          <input
            name="city"
            autoComplete="address-level2"
            value={fields.city}
            onChange={(event) => update("city", event.target.value)}
          />
        </label>
        <label>
          <span>Data prevista</span>
          <input
            name="date"
            type="date"
            value={fields.date}
            onChange={(event) => update("date", event.target.value)}
          />
        </label>
      </div>
      <label className="message-field">
        <span>Mensagem</span>
        <textarea
          name="message"
          rows={4}
          value={fields.message}
          onChange={(event) => update("message", event.target.value)}
        />
      </label>
      <div className="form-action">
        <button type="submit" className="button button--accent" data-magnetic>
          Conversar com a DB Experience
          <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.6} />
        </button>
        <p role="status" aria-live="polite">
          {status === "sent"
            ? "Briefing preparado. O WhatsApp foi aberto em uma nova aba."
            : "Seus dados são usados apenas para iniciar esta conversa."}
        </p>
      </div>
    </form>
  );
}
