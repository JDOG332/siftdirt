import React, { useState, useCallback } from "react";
import IntroCanvas from "./IntroCanvas.jsx";
import EquationReveal from "./EquationReveal.jsx";
import DoorScene from "./DoorScene.jsx";
import InfinityCursor from "./InfinityCursor.jsx";
import "./global.css";

export default function App() {
  const [scene, setScene] = useState("intro");
  // "intro" → "equation" → "door"

  // Click anywhere skips to door scene immediately
  const handleSkip = useCallback(() => {
    if (scene === "intro" || scene === "equation") {
      setScene("door");
    }
  }, [scene]);

  return (
    <div
      style={{ minHeight: "100vh", background: "#03030a" }}
      onClick={handleSkip}
    >
      {/* Infinity loop cursor — desktop only */}
      <InfinityCursor />

      {scene === "intro" && (
        <IntroCanvas onComplete={() => setScene("equation")} />
      )}

      {(scene === "equation" || scene === "door") && (
        <EquationReveal
          showButton={false}
          onComplete={() => setScene("door")}
        />
      )}

      {/* Door scene layers on top — stops click propagation internally */}
      <DoorScene
        visible={scene === "door"}
        onDoorClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
