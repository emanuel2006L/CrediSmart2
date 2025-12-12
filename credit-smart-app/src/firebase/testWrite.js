import { db } from './config.js';
import { collection, addDoc } from 'firebase/firestore';

console.log("🔥 Probando escritura directa...");

(async () => {
  try {
    const ref = await addDoc(collection(db, "testCollection"), {
      message: "Hola Firebase",
      timestamp: new Date()
    });

    console.log("✔️ Escritura exitosa. ID:", ref.id);
  } catch (e) {
    console.error("❌ Error escribiendo en Firestore:", e);
  }
})();
