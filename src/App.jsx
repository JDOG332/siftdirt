import React, { useEffect, useRef } from "react";
import IntroCanvas from "./IntroCanvas.jsx";
import "./global.css";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#03030a" }}>
      <IntroCanvas onComplete={() => {}} />
    </div>
  );
}
