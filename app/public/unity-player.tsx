import { Unity, useUnityContext } from "react-unity-webgl";
import "./unity-player.css";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useAction } from "@/app/useAction";

export function UnityPlayerApp() {
  const [playing, setPlaying] = useState(false);
  const [game, setGame] = useState<string>('');
  const [endGameParams, setEndGameParams] = useState<{ score: number; stages: string; inputs: string } | null>(null);
  const gameRef = useRef<string>('');
  const { submit } = useAction();

  const { unityProvider, isLoaded, loadingProgression, addEventListener, sendMessage } = useUnityContext({
    loaderUrl: "./Build/VerifiableKartikAdventuresBuild.loader.js",
    dataUrl: "./Build/VerifiableKartikAdventuresBuild.data",
    frameworkUrl: "./Build/VerifiableKartikAdventuresBuild.framework.js",
    codeUrl: "./Build/VerifiableKartikAdventuresBuild.wasm",
  });

  const loadingPercentage = Math.round(loadingProgression * 100);

  const handleStartGame = async () => {
    setPlaying(true);
    try {
      const res = await submit("startGame", {
        startTimestamp: Date.now(),
      });
      
      const gameValue = res?.logs?.[0]?.value;
      if (gameValue) {
        sendMessage("Game_Manager", "StartGame", "hello");
      }
      setGame(gameValue);
      gameRef.current = gameValue;
    } catch (error) {
      console.error("Error during game start:", error);
    }
  };

  const handleEndGame = async () => {
    if (!endGameParams) {
      console.error("End game parameters are not set.");
      return;
    }
    const { score, stages, inputs } = endGameParams;
    console.log("handleEndGame called with:", { score, stages, inputs });
    console.log("GameId at Game Over:", gameRef.current);

    try {
      console.log("Before submit endgame");
      const res = await submit("endGame", {
        gameId: gameRef.current,
        endTimestamp: Date.now(),
        score: score,
        stages: stages,
        inputs: inputs,
      });
      console.log("After submit endgame", res);
    } catch (error) {
      console.error("Error during game end:", error);
    }
    setPlaying(false);
  };

  const handleGameOver = useCallback((...parameters: any) => {
    const [score, stages, inputs] = parameters;
    setEndGameParams({
      score: Number(score), // Ensure these are correctly converted
      stages: String(stages),
      inputs: String(inputs),
    });
  }, []);

  useEffect(() => {
    if (endGameParams) {
      handleEndGame();
    }
  }, [endGameParams]);

  async function handleClickStartGame() {
    try {
      await handleStartGame();
    } catch (error) {
      console.error("Error starting game:", error);
    }
  }

  useEffect(() => {
    addEventListener("SendResult", handleGameOver);
    return () => {
      removeEventListener("SendResult", handleGameOver);
    };
  }, [addEventListener, handleGameOver]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = document.getElementById('unity-canvas');
      if (canvas) {
        // Update canvas size or other properties if necessary
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial resize

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div id="unity-container" className="unity-desktop">
        <h1>Game ID: {game || "No game started"}</h1>

        {!isLoaded && (
          <div id="unity-loading-bar">
            <div id="unity-logo"></div>
            <div id="unity-progress-bar-empty">
              <div id="unity-progress-bar-full" style={{ width: `${loadingPercentage}%` }}></div>
            </div>
          </div>
        )}
        <div id="unity-warning"></div>
        <div id="unity-footer">
          <div id="unity-webgl-logo"></div>
          <div id="unity-fullscreen-button"></div>
          <div id="unity-build-title">Verifiable Kartik Adventures</div>
        </div>

        <button onClick={handleClickStartGame} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
          Start Game
        </button>
      </div>
      <Unity
        unityProvider={unityProvider}
        className="w-full h-full"
      />
    </>
  );
}
