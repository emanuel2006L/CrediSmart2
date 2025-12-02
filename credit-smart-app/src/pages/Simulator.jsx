
import React, { useMemo, useState } from "react";
import creditsData from "../data/creditsData";
import CreditCard from "../components/CreditCard";

function parseRange(value) {

  if (!value || value === "Todos") return null;
  if (value === "500k-10M") return { min: 500000, max: 10000000 };
  if (value === "10M-50M") return { min: 10000000, max: 50000000 };
  if (value === "50M-200M") return { min: 50000000, max: 200000000 };
  if (value === "200M-1000M") return { min: 200000000, max: 1000000000 };
  return null;
}

export default function Simulator() {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("Todos");
  const [order, setOrder] = useState("none");

  const results = useMemo(() => {
    const r = parseRange(range);
    return creditsData
      .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))
      .filter(c => {
        if (!r) return true;
        // match if credit's min-max overlaps filter range
        return c.maxAmount >= r.min && c.minAmount <= r.max;
      })
      .sort((a,b) => {
        if (order === "rate") return a.interestEA - b.interestEA;
        if (order === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [search, range, order]);

  return (
    <div className="container">
      <section className="filter-container">
        <input placeholder="Nombre de crédito" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="Todos">Filtar por monto</option>
          <option value="500k-10M">De 500Mil a 10 millones</option>
          <option value="10M-50M">De 10 millones a 50 millones</option>
          <option value="50M-200M">De 50 millones a 200 Millones</option>
          <option value="200M-1000M">De 200 millones a 1 Mil millones</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="none">Ordenar</option>
          <option value="rate">Tasa de interés (menor a mayor)</option>
          <option value="name">Nombre (A-Z)</option>
        </select>
      </section>

      <section className="credits-container container">
        <h3>Resultados</h3>

        {results.length === 0 ? (
          <p>No hay créditos disponibles</p>
        ) : (
          <div className="credits-grid" id="creditsContainer">
            {results.map(c => <CreditCard key={c.id} credit={c} />)}
          </div>
        )}
      </section>
    </div>
  );
}
