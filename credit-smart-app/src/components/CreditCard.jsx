// src/components/CreditCard.jsx
import React from "react";

export default function CreditCard({ credit, onRequest }) {
  return (
    <div className="credits-card">

      {/* Imagen del crédito */}
      {credit.image && (
        <img
          src={`/imagenes/${credit.image}`}
          alt={credit.name}
          className="credit-image"
          style={{
            width: "100%",
            borderRadius: "12px",
            marginBottom: "12px"
          }}
        />
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center" }} className="card-header">
        <span style={{ fontSize: 28 }}>{credit.icon}</span>
        <h4>{credit.name}</h4>
      </div>

      <p style={{ color: "#55627d" }}>{credit.description}</p>

      <div style={{ marginTop: 12 }}>
        <div className="details-item">
          <span className="label">Tasa de interes: </span>
          <span className="value-highlight">{credit.interestEA}% E.A.</span>
        </div>

        <div className="details-item">
          <span className="label">Monto: </span>
          <span className="value">
            {credit.minAmount.toLocaleString()} - {credit.maxAmount.toLocaleString()}
          </span>
        </div>

        <div className="details-item">
          <span className="label">Plazo: </span>
          <span className="value">Hasta {credit.maxTermMonths} meses</span>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="btn-primary" onClick={() => onRequest && onRequest(credit)}>
          Solicitar ahora
        </button>
      </div>
    </div>
  );
}
