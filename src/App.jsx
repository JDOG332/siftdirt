import React, { useState, useCallback, useRef } from "react";
import LandingPage from "./LandingPage.jsx";
import IntroCanvas from "./IntroCanvas.jsx";
import ProofPage from "./ProofPage.jsx";
import DoorHall from "./DoorHall.jsx";
import RoomPage from "./RoomPage.jsx";
import PoemsPage from "./PoemsPage.jsx";
import PoemUniverse from "./PoemUniverse.jsx";
import MathHubPage from "./MathHubPage.jsx";
import VitruvianPage from "./VitruvianPage.jsx";
import PaperPage from "./PaperPage.jsx";
import InfinityCursor from "./InfinityCursor.jsx";
import "./global.css";

export default function App() {
  const [stack, setStack] = useState(["landing"]);
  const scene = stack[stack.length - 1];
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [proofAutoSearch, setProofAutoSearch] = useState(false);
  const introSeedRef = useRef({ rx: 0, ry: 0, rz: 0 });

  const go = useCallback((next) => setStack((prev) => [...prev, next]), []);
  const goBack = useCallback(
    () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev)),
    []
  );

  const goToDoor = useCallback(
    (doorKey) => {
      setSelectedDoor(doorKey);
      go("door");
    },
    [go]
  );

  const goToRoom = useCallback(
    (doorKey, subId, cardId = null) => {
      setSelectedRoom({ doorKey, subId, cardId });
      go("room");
    },
    [go]
  );

  const handleLandingStart = useCallback(
    (seed) => {
      introSeedRef.current = seed;
      setProofAutoSearch(false);
      go("intro");
    },
    [go]
  );

  /* ── LANDING ── */
  if (scene === "landing")
    return <LandingPage onStart={handleLandingStart} />;

  /* ── POEMS ── */
  if (scene === "poem-dol")
    return <PoemUniverse poem="ask" onBack={goBack} />;
  if (scene === "poem-rol")
    return <PoemUniverse poem="explore" onBack={goBack} />;
  if (scene === "poem-kal")
    return <PoemUniverse poem="kal" onBack={goBack} />;

  /* ── MATH ── */
  if (scene === "mathhub")
    return (
      <MathHubPage
        onBack={goBack}
        onVitruvian={() => go("vitruvian")}
        onCRT={() => go("paper")}
      />
    );
  if (scene === "vitruvian") return <VitruvianPage onBack={goBack} />;
  if (scene === "paper") return <PaperPage onBack={goBack} />;

  /* ── PROOF (main hub) ── */
  if (scene === "proof")
    return (
      <ProofPage
        onBack={goBack}
        onDoorSelect={goToDoor}
        onRoomSelect={goToRoom}
        onPoems={() => go("poems")}
        onMath={() => go("mathhub")}
        autoSearch={proofAutoSearch}
      />
    );

  /* ── DOOR HALL ── */
  if (scene === "door" && selectedDoor)
    return (
      <DoorHall
        doorKey={selectedDoor}
        onBack={goBack}
        onRoomSelect={goToRoom}
      />
    );

  /* ── ROOM ── */
  if (scene === "room" && selectedRoom)
    return (
      <RoomPage
        doorKey={selectedRoom.doorKey}
        subId={selectedRoom.subId}
        cardId={selectedRoom.cardId || null}
        onBack={goBack}
      />
    );

  /* ── SCENES WITH SHARED CURSOR ── */
  return (
    <div style={{ minHeight: "100vh", background: "#03030a" }}>
      <InfinityCursor />
      {scene === "intro" && (
        <IntroCanvas
          seedState={introSeedRef.current}
          onComplete={() => go("proof")}
        />
      )}
      {scene === "poems" && (
        <PoemsPage
          onBack={goBack}
          onSelectPoem={(key) => go(`poem-${key}`)}
        />
      )}
    </div>
  );
}
