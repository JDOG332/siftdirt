import React, { useState, useCallback } from "react";
import IntroCanvas from "./IntroCanvas.jsx";
import EquationReveal from "./EquationReveal.jsx";
import DoorScene from "./DoorScene.jsx";
import InfinityCursor from "./InfinityCursor.jsx";
import TouchTrail from "./TouchTrail.jsx";
import "./global.css";

export default function App() {
  const [scene, setScene] = useState("intro");

  const handleSkip = useCallback((e) => {
    if (scene === "intro" || scene === "equation") {
      setScene("door");
    }
  }, [scene]);

  return (
    <div
      style={{ minHeight: "100vh", background: "#03030a" }}
      onClick={handleSkip}
    >
      {/* Desktop: infinity loop cursor */}
      <InfinityCursor />

      {/* Mobile: touch trail with lemniscate bloom */}
      <TouchTrail />

      {scene === "intro" && (
        <IntroCanvas onComplete={() => setScene("equation")} />
      )}

      {(scene === "equation" || scene === "door") && (
        <EquationReveal
          showButton={false}
          onComplete={() => setScene("door")}
        />
      )}

      <DoorScene visible={scene === "door"} />
    </div>
  );
}
