// src/pages/Home.jsx
import React from "react";
import creditsData from "../data/creditsData";
import CreditCard from "../components/CreditCard";

export default function Home() {
  return (
    <div className="container">
      <header className="hero">
        <div className="container">
          <h2>Encuentra el crédito perfecto para ti</h2>
          <p>Tasas competitivas, aprobación rápida y sin límites complicados</p>
        </div>
      </header>

      <main className="credits-section container">
        <h3>Nuestras ofertas</h3>
        <div className="credits-grid">
          {creditsData.map((c) => (
            <CreditCard key={c.id} credit={c} />
          ))}
        </div>
      </main>
    </div>
  );
}
