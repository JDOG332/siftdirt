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
import PromisesPage from "./PromisesPage.jsx";
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

  /* ── Determine which scene to render ── */
  let content = null;

  if (scene === "landing")
    content = <LandingPage onStart={handleLandingStart} />;

  else if (scene === "poem-dol")
    content = <PoemUniverse poem="ask" onBack={goBack} />;
  else if (scene === "poem-rol")
    content = <PoemUniverse poem="explore" onBack={goBack} />;
  else if (scene === "poem-kal")
    content = <PoemUniverse poem="kal" onBack={goBack} />;

  else if (scene === "mathhub")
    content = (
      <MathHubPage
        onBack={goBack}
        onVitruvian={() => go("vitruvian")}
        onCRT={() => go("paper")}
      />
    );
  else if (scene === "vitruvian") content = <VitruvianPage onBack={goBack} />;
  else if (scene === "paper") content = <PaperPage onBack={goBack} />;
  else if (scene === "promises") content = <PromisesPage onBack={goBack} />;

  else if (scene === "proof")
    content = (
      <ProofPage
        onBack={goBack}
        onDoorSelect={goToDoor}
        onRoomSelect={goToRoom}
        onPoems={() => go("poems")}
        onMath={() => go("mathhub")}
        onPromises={() => go("promises")}
        autoSearch={proofAutoSearch}
      />
    );

  else if (scene === "door" && selectedDoor)
    content = (
      <DoorHall
        doorKey={selectedDoor}
        onBack={goBack}
        onRoomSelect={goToRoom}
      />
    );

  else if (scene === "room" && selectedRoom)
    content = (
      <RoomPage
        doorKey={selectedRoom.doorKey}
        subId={selectedRoom.subId}
        cardId={selectedRoom.cardId || null}
        onBack={goBack}
      />
    );

  else if (scene === "poems")
    content = (
      <PoemsPage
        onBack={goBack}
        onSelectPoem={(key) => go(`poem-${key}`)}
      />
    );

  else if (scene === "intro")
    content = (
      <div style={{ minHeight: "100vh", background: "#03030a" }}>
        <IntroCanvas
          seedState={introSeedRef.current}
          onComplete={() => go("proof")}
        />
      </div>
    );

  /* ── ALWAYS render cursor + scene together ── */
  return (
    <>
      <InfinityCursor />
      {content}
    </>
  );
}
