'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import styles from './page.module.css';
import { GameState } from './game/GameState';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const gameStateRef = useRef<GameState | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const socketIo = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
      path: '/api/socket',
    });

    setSocket(socketIo);
    gameStateRef.current = new GameState(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameStateRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      if (gameStateRef.current) {
        gameStateRef.current.movePlayer(e.clientX, e.clientY);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Game loop
    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw all players
      if (gameStateRef.current) {
        const players = gameStateRef.current.getPlayers();
        players.forEach(player => {
          ctx.fillStyle = player.color;
          ctx.beginPath();
          ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
          ctx.fill();

          // Draw player ID above the circle
          ctx.fillStyle = 'black';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(player.id.slice(0, 6), player.x, player.y - 25);
        });
      }

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [socket]);

  return (
    <main className={styles.main}>
      <canvas
        ref={canvasRef}
        className={styles.gameCanvas}
      />
      <div className={styles.instructions}>
        Move your mouse to control your player!
      </div>
    </main>
  );
} 