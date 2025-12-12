import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import CreditCard from "../components/CreditCard";

export default function Home() {
  const [credits, setCredits] = useState([]);

  useEffect(() => {
    const loadCredits = async () => {
      try {
        const ref = collection(db, "credits");
        const snapshot = await getDocs(ref);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("CREDITOS DESDE FIREBASE:", data);

        setCredits(data);
      } catch (error) {
        console.error("Error cargando créditos:", error);
      }
    };

    loadCredits();
  }, []);

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
          {credits.map((c) => (
            <CreditCard key={c.id} credit={c} />
          ))}
        </div>
      </main>
    </div>
  );
}
