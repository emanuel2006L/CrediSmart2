import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import creditsData from "../data/creditsData";

function formatCurrency(n) {
  if (!n) return "0";
  return Number(n).toLocaleString("es-CO");
}

export default function Solicitudes() {
  const [email, setEmail] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState("");

  async function buscar() {
    if (!email.trim()) {
      setNotFound("Ingresa un correo para buscar.");
      return;
    }

    setLoading(true);
    setNotFound("");

    try {
      const q = query(
        collection(db, "solicitudes"),
        where("email", "==", email.trim())
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setResults([]);
        setNotFound("No se encontraron solicitudes con este correo.");
      } else {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setResults(data);
      }

    } catch (error) {
      setNotFound("Error al buscar solicitudes.");
      console.error(error);
    }

    setLoading(false);
  }

  return (
    <div className="container">
      <section className="solicitud-container">
        <div className="solicitud-card">

          <h3>Buscar solicitudes</h3>
          <p>Ingresa el correo usado para enviar solicitudes</p>

          <div className="form-group" style={{ marginTop: 15 }}>
            <label>Correo electrónico</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div className="form-actions">
            <button className="btn-primary" onClick={buscar}>
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {notFound && (
            <p style={{ color: "crimson", marginTop: 15 }}>{notFound}</p>
          )}

          {results.length > 0 && (
            <div style={{ marginTop: 25 }}>
              <h4>Solicitudes encontradas</h4>

              {results.map(req => {
                const credit = creditsData.find(c => String(c.id) === String(req.creditId));

                return (
                  <div
                    key={req.id}
                    style={{
                      padding: "14px",
                      marginTop: 15,
                      background: "#f5f5f5",
                      borderRadius: 8,
                      border: "1px solid #ddd"
                    }}
                  >
                    <p><strong>Nombre:</strong> {req.name}</p>
                    <p><strong>Documento:</strong> {req.docType} {req.docNumber}</p>
                    <p><strong>Teléfono:</strong> {req.phone}</p>
                    <p><strong>Correo:</strong> {req.email}</p>

                    <p><strong>Crédito:</strong> {credit ? credit.name : req.creditId}</p>
                    <p><strong>Monto:</strong> ${formatCurrency(req.amount)}</p>
                    <p><strong>Plazo:</strong> {req.term} meses</p>
                    <p><strong>Cuota mensual:</strong> ${formatCurrency(req.monthlyInstallment)}</p>

                    {req.createdAt?.toDate && (
                      <p><strong>Fecha:</strong> {req.createdAt.toDate().toLocaleString()}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
