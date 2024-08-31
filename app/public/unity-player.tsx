import { Unity, useUnityContext } from "react-unity-webgl";
import "./unity-player.css"; // Make sure this path is correct
import React, { Fragment, useState, useCallback, useEffect } from "react";
import { useAccount, useSignMessage } from 'wagmi';


export function UnityPlayerApp() {
  const { unityProvider, isLoaded, loadingProgression, addEventListener, sendMessage } = useUnityContext({
    loaderUrl: "./Build/VerifiableKartikAdventuresBuild.loader.js",
    dataUrl: "./Build/VerifiableKartikAdventuresBuild.data",
    frameworkUrl: "./Build/VerifiableKartikAdventuresBuild.framework.js",
    codeUrl: "./Build/VerifiableKartikAdventuresBuild.wasm",
  });

  const  address  = useAccount().address;
  const { signMessageAsync } = useSignMessage();

  const loadingPercentage = Math.round(loadingProgression * 100);

  // Function to sign data and send the StartGame message to Unity
  async function handleClickStartGame() {
    try {
      // Example inputs data (replace with actual data)
      const inputs = { startTimestamp: Date.now() };

      // Serialize inputs (you need to make sure this matches your schema)
      const serializedInputs = JSON.stringify(inputs);

      // Sign the message
      const signature = await signMessageAsync({
        message: serializedInputs,
      });

      console.log("Signature:", signature);

      // Send the signature and other data to Unity
      sendMessage("Game_Manager", "StartGame", JSON.stringify({ inputs, signature }));

    } catch (error) {
      console.error("Error signing message:", error);
    }
  }

  // Callback for handling game over event
  const handleGameOver = useCallback((score: any, stages: any, inputs: any) => {
    console.log(score);
    console.log(stages);
    console.log(inputs);
  }, []);

  useEffect(() => {
    addEventListener("SendResult", handleGameOver);
  }, [addEventListener, handleGameOver]);

  useEffect(() => {
    // Handle resizing logic or any other dynamic JavaScript needed
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

        {/* Start Game Button */}
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
