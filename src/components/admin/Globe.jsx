import React, { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

const Globe = () => {
  const canvasRef = useRef();

  useEffect(() => {
    let phi = 0;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.05, 0.05, 0.05],
      markerColor: [197 / 255, 160 / 255, 89 / 255],
      glowColor: [197 / 255, 160 / 255, 89 / 255],
      markers: [
        { location: [25.2048, 55.2708], size: 0.1 }, // Dubai
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => globe.destroy();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
    />
  );
};

export default Globe;
