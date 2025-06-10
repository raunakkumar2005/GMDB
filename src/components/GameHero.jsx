import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const GameHero = ({ featuredGames = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      "#game-hero-bg",
      { scale: 1.05 },
      {
        scale: 1,
        scrollTrigger: {
          trigger: "#game-hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredGames.length);
    }, 4000); // cycle every 4 seconds
    return () => clearInterval(interval);
  }, [featuredGames]);

  if (!featuredGames.length) return null;

  const currentGame = featuredGames[currentIndex];

  return (
    <div
      ref={containerRef}
      id="game-hero"
      className="relative h-dvh w-screen overflow-hidden bg-black"
    >
      {/* Background image */}
      <img
        id="game-hero-bg"
        ref={imageRef}
        src={currentGame.background_image}
        alt={currentGame.name}
        className="absolute inset-0 z-0 h-full w-full object-cover object-center transition-all duration-1000"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full w-full flex flex-col justify-center px-5 sm:px-10">
        <div className="max-w-xl">
          <h1 className="special-font hero-heading text-white text-4xl sm:text-6xl mb-2">
            <b>{currentGame.name}</b>
          </h1>

          <p className="text-white mb-4 text-sm sm:text-base line-clamp-3">
            {currentGame.description_raw}
          </p>

          <p className="text-white text-xs sm:text-sm mb-6">
            Released:{" "}
            {currentGame.released || "TBA"} | Rating:{" "}
            {currentGame.rating?.toFixed(1) || "N/A"}
          </p>

          <Button
            title="Explore Game"
            leftIcon={<TiLocationArrow />}
            containerClass="bg-yellow-300 text-black flex-center gap-1"
          />
        </div>
      </div>
    </div>
  );
};

export default GameHero;
