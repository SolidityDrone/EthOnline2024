"use client";
import React, { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import "./unity-player.css"; // Make sure this path is correct

export function UnityPlayerApp() {
  // State to check if the component is rendering on the client side
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after the component is mounted on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: "./Build/VerifiableKartikAdventuresBuild.loader.js",
    dataUrl: "./Build/VerifiableKartikAdventuresBuild.data",
    frameworkUrl: "./Build/VerifiableKartikAdventuresBuild.framework.js",
    codeUrl: "./Build/VerifiableKartikAdventuresBuild.wasm",
  });

  const loadingPercentage = Math.round(loadingProgression * 100);

  useEffect(() => {
    if (isClient) {
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
    }
  }, [isClient]);

  // Render nothing on the server side
  if (!isClient) {
    return null;
  }

  return (
    <div id="unity-container" className="unity-desktop">
      <canvas id="unity-canvas" width="960" height="600"></canvas>
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
    </div>
  );
}
