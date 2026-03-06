import React, { useState, useCallback } from "react";
import IntroCanvas from "./IntroCanvas.jsx";
import EquationReveal from "./EquationReveal.jsx";
import DoorScene from "./DoorScene.jsx";
import InfinityCursor from "./InfinityCursor.jsx";
import TouchTrail from "./TouchTrail.jsx";
import "./global.css";

export default function App() {
  const [scene, setScene] = useState("intro");

  // Click anywhere during intro OR equation → straight to 3 doors
  const handleSkip = useCallback(() => {
    if (scene !== "door") setScene("door");
  }, [scene]);

  return (
    <div
      style={{ minHeight: "100vh", background: "#03030a" }}
      onClick={handleSkip}
    >
      <InfinityCursor />
      <TouchTrail />

      {/* Only render intro while in intro scene */}
      {scene === "intro" && (
        <IntroCanvas onComplete={() => setScene("equation")} />
      )}

      {/* Only render equation while in equation scene */}
      {scene === "equation" && (
        <EquationReveal
          showButton={false}
          onComplete={() => setScene("door")}
        />
      )}

      {/* Door scene — stopPropagation already inside */}
      <DoorScene visible={scene === "door"} />
    </div>
  );
}
