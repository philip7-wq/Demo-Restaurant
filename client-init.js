/**
 * CLIENT INIT
 * ───────────
 * Liest CLIENT aus client.config.js und befüllt alle markierten Elemente.
 * Nicht bearbeiten — nur client.config.js anpassen.
 */
document.addEventListener("DOMContentLoaded", () => {

  // ── Text-Felder ────────────────────────────────────────────────────────────
  const textFields = ["name", "slogan", "street", "city", "phone", "phoneReservation",
                      "email", "emailReservation", "hours", "founder", "cuisine"];
  textFields.forEach(key => {
    document.querySelectorAll(`[data-client="${key}"]`).forEach(el => {
      el.textContent = CLIENT[key] || "";
    });
  });

  // ── Adresse ────────────────────────────────────────────────────────────────
  document.querySelectorAll('[data-client="address"]').forEach(el => {
    el.textContent = [CLIENT.street, CLIENT.city].filter(Boolean).join(", ");
  });

  // ── href-Attribute (tel:, mailto:) ─────────────────────────────────────────
  const hrefMap = {
    "phone":            "tel:" + (CLIENT.phone || ""),
    "phone-reservation": "tel:" + (CLIENT.phoneReservation || ""),
    "email":            "mailto:" + (CLIENT.email || ""),
    "email-reservation": "mailto:" + (CLIENT.emailReservation || ""),
  };
  Object.entries(hrefMap).forEach(([key, href]) => {
    document.querySelectorAll(`[data-client-href="${key}"]`).forEach(el => {
      if (href.replace(/^(tel:|mailto:)/, "")) el.href = href;
    });
  });

  // ── Logo (light) ───────────────────────────────────────────────────────────
  document.querySelectorAll('[data-client="logo"]').forEach(el => {
    if (CLIENT.logo) {
      el.src = CLIENT.logo;
      el.alt = CLIENT.name || "";
    } else {
      const span = document.createElement("span");
      span.className = "text-logo";
      span.textContent = CLIENT.name || "";
      el.replaceWith(span);
    }
  });

  // ── Logo (dark) ────────────────────────────────────────────────────────────
  document.querySelectorAll('[data-client="logo-dark"]').forEach(el => {
    if (CLIENT.logoDark) {
      el.src = CLIENT.logoDark;
      el.alt = CLIENT.name || "";
    } else if (CLIENT.logo) {
      el.src = CLIENT.logo;
      el.alt = CLIENT.name || "";
    } else {
      const span = document.createElement("span");
      span.className = "text-logo";
      span.textContent = CLIENT.name || "";
      el.replaceWith(span);
    }
  });

  // ── Primärfarbe ────────────────────────────────────────────────────────────
  if (CLIENT.primaryColor) {
    document.documentElement.style.setProperty("--color-primary", CLIENT.primaryColor);
  }

  // ── <title>-Tag ────────────────────────────────────────────────────────────
  if (CLIENT.name && document.title) {
    // Ersetzt den Restaurantnamen im Title-Tag (Format: "Seite | Casa Fiora" oder "Casa Fiora – Slogan")
    document.title = document.title
      .replace(/Casa Fiora/g, CLIENT.name);
  }

  // ── JSON-LD Schema.org (nur index.html) ────────────────────────────────────
  const ldScript = document.querySelector('script[type="application/ld+json"]');
  if (ldScript) {
    try {
      const schema = JSON.parse(ldScript.textContent);
      if (schema["@type"] === "Restaurant") {
        schema.name                      = CLIENT.name || schema.name;
        schema.servesCuisine             = CLIENT.cuisine || schema.servesCuisine;
        schema.foundingDate              = CLIENT.foundingYear || schema.foundingDate;
        if (schema.address) {
          schema.address.streetAddress   = CLIENT.street || schema.address.streetAddress;
          const zip  = (CLIENT.city || "").split(" ")[0] || schema.address.postalCode;
          const city = (CLIENT.city || "").split(" ").slice(1).join(" ") || schema.address.addressLocality;
          schema.address.postalCode      = zip;
          schema.address.addressLocality = city;
        }
        schema.telephone                 = CLIENT.phone || schema.telephone;
        schema.email                     = CLIENT.email || schema.email;
        if (schema.founder) schema.founder.name = CLIENT.founder || schema.founder.name;
        if (schema.url) schema.url       = window.location.origin + "/";
        ldScript.textContent = JSON.stringify(schema, null, 2);
      }
    } catch (_) {
      // JSON-LD konnte nicht geparst werden — kein Fehler
    }
  }

});
