import React, { useState } from "react";

// Importamos funciones de Firestore para buscar, eliminar y actualizar
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";

// Configuración de la base de datos
import { db } from "../firebase/config";

// Datos locales de los créditos
import creditsData from "../data/creditsData";

// Función para mostrar números como dinero colombiano
function formatCurrency(n) {
  if (!n) return "0";
  return Number(n).toLocaleString("es-CO");
}

export default function Solicitudes() {

  // Estados principales del buscador
  const [email, setEmail] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState("");

  // Busca solicitudes en Firebase según el correo ingresado
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

  // Elimina una solicitud de la base de datos
  async function eliminarSolicitud(id) {
    if (!window.confirm("¿Eliminar esta solicitud?")) return;

    try {
      await deleteDoc(doc(db, "solicitudes", id));
      setResults(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar");
    }
  }

  // Actualiza monto, plazo y recalcula la cuota mensual
  async function actualizarSolicitud(id, amount, term, creditId) {
    try {
      const credit = creditsData.find(
        c => String(c.id) === String(creditId)
      );

      let nuevaCuota = 0;

      if (credit) {
        const P = Number(amount);
        const n = Number(term);
        const iAnnual = credit.interestEA / 100;
        const iMonthly = Math.pow(1 + iAnnual, 1 / 12) - 1;
        nuevaCuota = Math.round(
          (P * iMonthly) / (1 - Math.pow(1 + iMonthly, -n))
        );
      }

      await updateDoc(doc(db, "solicitudes", id), {
        amount: Number(amount),
        term: Number(term),
        monthlyInstallment: nuevaCuota
      });

      setResults(prev =>
        prev.map(r =>
          r.id === id
            ? {
                ...r,
                amount: Number(amount),
                term: Number(term),
                monthlyInstallment: nuevaCuota
              }
            : r
        )
      );
    } catch (error) {
      console.error(error);
      alert("Error al actualizar");
    }
  }

  return (
    <div className="container">
      <section className="solicitud-container">
        <div className="solicitud-card">

          <h3>Buscar solicitudes</h3>
          <p>Ingresa el correo usado para enviar las solicitudes</p>

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
                const credit = creditsData.find(
                  c => String(c.id) === String(req.creditId)
                );

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

                    <label>Monto</label>
                    <input
                      type="number"
                      defaultValue={req.amount}
                      onBlur={e => (req.amount = e.target.value)}
                    />

                    <label>Plazo (meses)</label>
                    <input
                      type="number"
                      defaultValue={req.term}
                      onBlur={e => (req.term = e.target.value)}
                    />

                    <p>
                      <strong>Cuota mensual:</strong> $
                      {formatCurrency(req.monthlyInstallment)}
                    </p>

                    {req.createdAt?.toDate && (
                      <p>
                        <strong>Fecha:</strong>{" "}
                        {req.createdAt.toDate().toLocaleString()}
                      </p>
                    )}

                    <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                      <button
                        className="btn-primary"
                        onClick={() =>
                          actualizarSolicitud(
                            req.id,
                            req.amount,
                            req.term,
                            req.creditId
                          )
                        }
                      >
                        Actualizar
                      </button>

                      <button
                        style={{ background: "crimson", color: "#fff" }}
                        onClick={() => eliminarSolicitud(req.id)}
                      >
                        Eliminar
                      </button>
                    </div>

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
