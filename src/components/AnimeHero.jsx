import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const AnimeHero = ({ featuredAnime = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      "#anime-hero-bg",
      { scale: 1.05 },
      {
        scale: 1,
        scrollTrigger: {
          trigger: "#anime-hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "Enter") {
        setCurrentIndex((prev) => (prev + 1) % featuredAnime.length);
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + featuredAnime.length) % featuredAnime.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [featuredAnime]);

  // Swipe gesture support
  useEffect(() => {
    let startX = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;

      if (diff > 50) {
        // Swipe right
        setCurrentIndex((prev) => (prev - 1 + featuredAnime.length) % featuredAnime.length);
      } else if (diff < -50) {
        // Swipe left
        setCurrentIndex((prev) => (prev + 1) % featuredAnime.length);
      }
    };

    const container = containerRef.current;
    container?.addEventListener("touchstart", handleTouchStart);
    container?.addEventListener("touchend", handleTouchEnd);

    return () => {
      container?.removeEventListener("touchstart", handleTouchStart);
      container?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [featuredAnime]);

  if (!featuredAnime.length) return null;

  const currentAnime = featuredAnime[currentIndex];
  const backgroundImage = currentAnime?.images?.jpg?.large_image_url;
  const trailer = currentAnime?.trailer?.embed_url;

  return (
    <div
      ref={containerRef}
      id="anime-hero"
      className="relative h-dvh w-screen overflow-hidden bg-black touch-none mb-10"
    >
      {/* Background (Image or Video) */}
      {trailer ? (
        <iframe
          id="anime-hero-bg"
          src={`https://www.youtube.com/embed/${currentAnime.trailer.youtube_id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${currentAnime.trailer.youtube_id}`}
          className="absolute inset-0 z-0 h-full w-full object-cover object-center border-none"
          title={currentAnime.title_english || currentAnime.title}
          allow="autoplay; encrypted-media"
          
        />
      ) : (
        <img
          id="anime-hero-bg"
          src={backgroundImage}
          alt={currentAnime.title_english || currentAnime.title}
          loading="lazy"
          className="absolute inset-0 z-0 h-full w-full object-cover object-center transition-all duration-1000"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full w-full flex flex-col justify-center px-5 sm:px-10">
        <div className="max-w-xl">
          <h1 className="special-font hero-heading text-white text-4xl sm:text-6xl mb-2">
            <b>{currentAnime.title_english || currentAnime.title}</b>
          </h1>

          <p className="text-white mb-4 text-sm sm:text-base line-clamp-3">
            {currentAnime.synopsis}
          </p>

          <p className="text-white text-xs sm:text-sm mb-6">
            Aired: {currentAnime.aired?.from?.split("T")[0] || "TBA"} | Score:{" "}
            {currentAnime.score || "N/A"}
          </p>

          <Button
            title="Explore Anime"
            leftIcon={<TiLocationArrow />}
            containerClass="bg-yellow-300 text-black flex-center gap-1"
            onclick={() => {
              window.location.href = `/anime/${currentAnime.mal_id}`;
            }
          }
          />
        </div>
      </div>
    </div>
  );
};

export default AnimeHero;
// 