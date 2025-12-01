// src/components/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="logo">💳CrediSmart</h1>
        <ul className="menu">
          <li><NavLink to="/">Inicio</NavLink></li>
          <li><NavLink to="/simulator">Simular credito</NavLink></li>
          <li><NavLink to="/apply">Solicitar Credito</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}
