import React, { useState, useCallback } from "react";
import IntroCanvas from "./IntroCanvas.jsx";
import EquationReveal from "./EquationReveal.jsx";
import "./global.css";

export default function App() {
  const [scene, setScene] = useState("intro");

  const handleIntroComplete = useCallback(() => setScene("equation"), []);
  const handleEquationComplete = useCallback(() => setScene("hold"), []);

  return (
    <div style={{ minHeight: "100vh", background: "#03030a" }}>

      {/* INTRO — 10s Ψ animation */}
      {scene === "intro" && (
        <IntroCanvas onComplete={handleIntroComplete} />
      )}

      {/* EQUATION REVEAL — assembles itself */}
      {(scene === "equation" || scene === "hold") && (
        <EquationReveal onComplete={handleEquationComplete} />
      )}

    </div>
  );
}
