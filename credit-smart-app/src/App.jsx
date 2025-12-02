// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator";
import Apply from "./pages/Apply";

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/apply" element={<Apply />} />
        </Routes>
        <Footer /> {}
      </main>
    </>
  );
}
