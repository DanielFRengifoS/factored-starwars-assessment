import React, { useState, useRef, useEffect } from "react";

const StarWars = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [bullets, setBullets] = useState<{x: number, y: number}[]>([]);
  const [asteroids, setAsteroids] = useState<{x: number, y: number}[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameArea = useRef<HTMLDivElement>(null);

  const updatePosition = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const addBullet = () => {
    setBullets((prevBullets) => [...prevBullets, { x: position.x, y: position.y }]);
  };

  const updateBullets = () => {
    setBullets((prevBullets) =>
      prevBullets.map((b) => ({ ...b, y: b.y - 10 }))
    );
  };

  const handleAsteroidSpawn = () => {
    if (gameArea.current) {
      const asteroidX = Math.floor(Math.random() * gameArea.current.clientWidth);
      const asteroidY = 0;
      setAsteroids((prevAsteroids) => [
        ...prevAsteroids,        
        { x: asteroidX, 
          y: asteroidY },      
      ]);
    }
  };

  const updateAsteroids = () => {
    setAsteroids((prevAsteroids) =>
      prevAsteroids.map((a) => ({ ...a, y: a.y + 5 }))
    );
  };

  const checkCollision = () => {
    for (let i = 0; i < asteroids.length; i++) {
      for (let j = 0; j < bullets.length; j++) {
        const asteroid = asteroids[i];
        const bullet = bullets[j];
        if (
          bullet.x >= asteroid.x &&
          bullet.x <= asteroid.x + 50 &&
          bullet.y >= asteroid.y &&
          bullet.y <= asteroid.y + 50
        ) {
          bullets.splice(j, 1);
          asteroids.splice(i, 1);
          setScore(score + 100);
        }
      }
    }
  };

  useEffect(() => {
    const asteroidInterval = setInterval(() => {
        handleAsteroidSpawn();
    }, 1000);
    return () => clearInterval(asteroidInterval);
  }, []);

  useEffect(() => {
    const gameInterval = setInterval(() => {
      updateBullets();
      updateAsteroids();
      checkCollision();
      checkGameOver();
      updateScore();
    }, 30);
    return () => clearInterval(gameInterval);
  }, [bullets, asteroids]);

  const updateScore = () => {
    for (let asteroid of asteroids) {
      for (let bullet of bullets) {
        if (
          bullet.x >= asteroid.x &&
          bullet.x <= asteroid.x + 50 &&
          bullet.y >= asteroid.y &&
          bullet.y <= asteroid.y + 50
        ) {
          setScore(prevScore => prevScore + 100);
        }
      }
    }
  };

  const resetGame = () => {
    setPosition({ x: 0, y: 0 });
    setBullets([]);
    setAsteroids([]);
    setGameOver(false);
    setScore(0);
  };
  
  const checkGameOver = () => {
    for (let asteroid of asteroids) {
      const distance = Math.sqrt((position.x - asteroid.x) ** 2 + (position.y - asteroid.y) ** 2);
      if (distance < 50) {
        resetGame();
      }
    }
  };

  return (
    <div
      ref={gameArea}
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        cursor: "none",
      }}
      onMouseMove={updatePosition}
      onClick={addBullet}
    >
      {!gameOver && (
        <>
          <div
            style={{
              position: "absolute",
              left: position.x,
              top: position.y,
              width: "50px",
              height: "50px",
              backgroundColor: "red",
              borderRadius: "50%",
            }}
          />
          {bullets.map((bullet, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: bullet.x,
                top: bullet.y,
                width: "10px",
                height: "10px",
                backgroundColor: "white",
                borderRadius: "50%",
              }}
            />
          ))}
          {asteroids.map((asteroid, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: asteroid.x,
                top: asteroid.y,
                width: "50px",
                height: "50px",
                backgroundColor: "grey",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "black",
              fontSize: "24px",
            }}
          >
            Score: {score}
          </div>
        </>
      )}
    </div>
  );
};

export default StarWars;