import React, { useState, useCallback } from "react";
import IntroCanvas from "./IntroCanvas.jsx";
import TruthScreen from "./TruthScreen.jsx";
import InfinityCursor from "./InfinityCursor.jsx";
import TouchTrail from "./TouchTrail.jsx";
import "./global.css";

export default function App() {
  const [scene, setScene] = useState("intro");

  // Click during intro → skip straight to truth screen
  const handleSkip = useCallback(() => {
    if (scene === "intro") setScene("truth");
  }, [scene]);

  return (
    <div style={{ minHeight:"100vh", background:"#03030a" }}
      onClick={handleSkip}>
      <InfinityCursor />
      <TouchTrail />

      {scene === "intro" && (
        <IntroCanvas onComplete={() => setScene("truth")} />
      )}
      {scene === "truth" && (
        <TruthScreen />
      )}
    </div>
  );
}
