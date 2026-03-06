import React, { useState, useCallback } from "react";
import IntroCanvas from "./IntroCanvas.jsx";
import EquationReveal from "./EquationReveal.jsx";
import DoorScene from "./DoorScene.jsx";
import "./global.css";

export default function App() {
  const [scene, setScene] = useState("intro");
  // "intro" → "equation" → "door"
  // DoorScene overlays on top of equation once quote is done

  return (
    <div style={{ minHeight: "100vh", background: "#03030a" }}>
      {scene === "intro" && (
        <IntroCanvas onComplete={() => setScene("equation")} />
      )}
      {(scene === "equation" || scene === "door") && (
        <EquationReveal
          showButton={false}
          onComplete={() => setScene("door")}
        />
      )}
      {/* Door scene layers on top after equation completes */}
      <DoorScene visible={scene === "door"} />
    </div>
  );
}
