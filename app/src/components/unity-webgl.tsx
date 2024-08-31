// components/UnityWebGL.js
import { useEffect, useRef } from 'react';

const UnityWebGL = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      // Create a script element to load the Unity WebGL build
      const script = document.createElement('script');
      script.src = '/VerifiableKartikAdventuresBuild/Build/UnityLoader.js'; // Path to UnityLoader.js
      script.onload = () => {
        // Initialize Unity WebGL after the script loads
        UnityLoader.instantiate('unityContainer', '/VerifiableKartikAdventuresBuild/Build/Build.json');
      };

      container.appendChild(script);

      // Cleanup script when component unmounts
      return () => {
        container.removeChild(script);
      };
    }
  }, []);

  return <div id="unityContainer" ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default UnityWebGL;