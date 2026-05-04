/**
 * KUNDENKONFIGURATION
 * ───────────────────
 * Diese Datei ist die einzige Datei, die pro Kunde angepasst werden muss.
 * Alle HTML-Seiten beziehen ihre Inhalte dynamisch aus dieser Konfiguration.
 */
const CLIENT = {
  // ── Basics ────────────────────────────────────────────────────────────────
  name:             "Casa Fiora",
  slogan:           "Mediterrane Küche in Nürnberg",
  cuisine:          "Mediterrane Küche",

  // ── Adresse ───────────────────────────────────────────────────────────────
  street:           "Adlerstraße 22",
  city:             "90403 Nürnberg",

  // ── Kontakt ───────────────────────────────────────────────────────────────
  phone:            "+49 911 45678910",       // Allgemeine Anfragen
  phoneReservation: "+49 911 45678911",       // Reservierungen
  email:            "info@casa-fiora-demo.de",
  emailReservation: "reservierung@casa-fiora-demo.de",

  // ── Öffnungszeiten ────────────────────────────────────────────────────────
  hours:            "Di–Do 17–22:30 · Fr 17–23:30 · Sa 12–23:30 · So 12–21:30",

  // ── Design ────────────────────────────────────────────────────────────────
  primaryColor:     "#1F3D38",               // überschreibt CSS --color-primary (leer lassen = CSS-Fallback)

  // ── Logo ──────────────────────────────────────────────────────────────────
  logo:             "assets/logo/logo.svg",  // Light-Version (auf dunklem Hintergrund)
  logoDark:         "assets/logo/logo-dark.svg", // Dark-Version (auf hellem Hintergrund)

  // ── Zusätzliche Infos ─────────────────────────────────────────────────────
  founder:          "Marco Fiora",
  foundingYear:     "2019",
};
