// BackgroundCanvas.js
import React, { useRef, useEffect } from 'react';

const BackgroundCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Set initial canvas size
    setCanvasDimensions();

    // Music Note Characters (choose subtle note styles)
    const musicNotes = ['♩', '♪', '♫', '♬']; 

    // Aesthetic colors: pink and purple gradients
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FFDEE9'); // Light pink
    gradient.addColorStop(1, '#B5FFFC'); // Light purple

    const fontSize = 40; // Make the notes slightly larger for a more elegant feel
    let columns = Math.floor(canvas.width / fontSize); // Number of columns based on canvas width
    const drops = Array(columns).fill(0); // Initial drop position for each column

    // Draw function
    const draw = () => {
      // Clear canvas with a soft gradient background
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set font size and color (lighter, star-like color for falling notes)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Soft white, like stars
      ctx.font = `${fontSize}px Arial`;

      // Reduce number of falling notes for a more serene effect
      for (let i = 0; i < drops.length; i++) {
        if (Math.random() > 0.98) { // Control note frequency (reduce the frequency of falling notes)
          const note = musicNotes[Math.floor(Math.random() * musicNotes.length)];
          ctx.fillText(note, i * fontSize, drops[i] * fontSize);

          // Reset the note when it goes beyond the canvas
          if (drops[i] * fontSize > canvas.height) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }
    };

    // Animation loop
    const interval = setInterval(draw, 100); // Slow down the falling speed a bit for smoother effect

    // Handle window resize
    const handleResize = () => {
      setCanvasDimensions();
      columns = Math.floor(canvas.width / fontSize); // Recalculate columns after resizing
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="background-canvas" />;
};

export default BackgroundCanvas;

