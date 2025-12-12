import { db } from "./config";
import { collection, addDoc } from "firebase/firestore";
import creditsData from "../data/creditsData";

const seedFirestore = async () => {
    try {
        console.log("Cargando créditos a Firestore...");

        for (const credit of creditsData) {
            const docRef = await addDoc(collection(db, "credits"), {
                name: credit.name,
                icon: credit.icon,
                image: credit.image,
                description: credit.description,
                interestEA: credit.interestEA,
                minAmount: credit.minAmount,
                maxAmount: credit.maxAmount,
                maxTermMonths: credit.maxTermMonths
            });

            console.log(`${credit.name} agregado con ID: ${docRef.id}`);
        }

        console.log("Todos los créditos fueron agregados correctamente.");
        console.log("IMPORTANTE: Comenta o borra este archivo cuando termines.");

    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
};

seedFirestore();
