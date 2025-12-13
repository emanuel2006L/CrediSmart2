import React from "react";
import { useNavigate } from "react-router-dom";

export default function CreditCard({ credit }) {

  // Hook que permite cambiar de ruta desde el código
  const navigate = useNavigate();

  // Función que envía al formulario de solicitud
  // y pasa el id del crédito seleccionado
  const goToApply = () => {
    navigate("/apply", { state: { creditId: credit.id } });
  };

  return (
    <div className="credits-card">
      {}

      {/* Si el crédito tiene imagen, se muestra */}
      {credit.image && (
        <img
          src={credit.image}
          alt={credit.name}
          className="credit-image"
          style={{
            width: "100%",
            borderRadius: "12px",
            marginBottom: "12px",
          }}
        />
      )}

      {/* Encabezado de la tarjeta con icono y nombre */}
      <div
        style={{ display: "flex", gap: 12, alignItems: "center" }}
        className="card-header"
      >
        <span style={{ fontSize: 28 }}>{credit.icon}</span>
        <h4>{credit.name}</h4>
      </div>

      {/* Descripción corta del crédito */}
      <p style={{ color: "#55627d" }}>{credit.description}</p>

      {/* Información principal del crédito */}
      <div style={{ marginTop: 12 }}>
        <div className="details-item">
          <span className="label">Tasa de interes: </span>
          <span className="value-highlight">{credit.interestRate}% E.A.</span>
        </div>

        <div className="details-item">
          <span className="label">Monto: </span>
          <span className="value">
            {credit.minAmount.toLocaleString()} -{" "}
            {credit.maxAmount.toLocaleString()}
          </span>
        </div>

        <div className="details-item">
          <span className="label">Plazo: </span>
          <span className="value">Hasta {credit.maxTerm} meses</span>
        </div>
      </div>

      {/* Botón para iniciar la solicitud del crédito */}
      <div style={{ marginTop: 12 }}>
        <button className="btn-primary" onClick={goToApply}>
          Solicitar ahora
        </button>
      </div>
    </div>
  );
}
