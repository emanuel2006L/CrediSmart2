import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">
        CrediSmart — Tu aliado financiero para tomar decisiones inteligentes.
      </p>

      <p className="footer-copy">
        © {new Date().getFullYear()} CrediSmart. Todos los derechos reservados.
      </p>

      <a
        className="footer-link"
        href="https://instagram.com/tu_instagram"
        target="_blank"
        rel="noopener noreferrer"
      >
        Síguenos en Instagram
      </a>
    </footer>
  );
}
