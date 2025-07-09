import { useEffect, useState, useRef, useCallback } from "react";
import { BentoTilt } from "./Features";


const fetchAnime = async (endpoint) => {
  const res = await fetch(`https://api.jikan.moe/v4/${endpoint}`);
  const json = await res.json();
  return json.data || [];
};
// import { useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { requestWithQueue } from "../utils/requestWithQueue";

export const MovieCard = ({ src, title, description, isComingSoon = false,id }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);
  const navigate = useNavigate();
  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();
    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setHoverOpacity(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHoverOpacity(0);
  };

  return (
    <div className="group w-48 md:w-60"  onClick={() => navigate(`/anime/${id}`)}>
      {/* Poster card */}
      <div
        className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {/* Poster image */}
        <img
          src={src}
          alt={title}
          className="h-full w-full object-cover object-center"
        />

        {/* Description overlay */}
        {description && (
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="text-xs text-white">{title}</p>
          </div>
        )}

        {/* Coming Soon Button */}
        {isComingSoon && (
          <div
            ref={hoverButtonRef}
            className="border-hsla absolute bottom-3 left-3 z-20 flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20"
          >
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
              }}
            />
            <TiLocationArrow className="relative z-20" />
            <p className="relative z-20">coming soon</p>
          </div>
        )}
      </div>

      {/* Title below card */}
      <h2 className="mt-2 text-center text-sm font-semibold text-white">{title}</h2>
    </div>
  );
};

// import { useEffect, useState, useRef, useCallback } from "react";
// import MovieCard from "./MovieCard";
// import BentoTilt from "./BentoTilt";

const AnimeSection = ({ title, endpoint, delayIndex = 0 }) => {
  const [animeList, setAnimeList] = useState([]);
  const cache = useRef({});

  useEffect(() => {
  const fetchAnime = async () => {
    if (cache.current[endpoint]) {
      setAnimeList(cache.current[endpoint]);
      return;
    }

    try {
      // Optional delay to stagger multiple sections
      await new Promise((res) => setTimeout(res, 800 * delayIndex));

      const json = await requestWithQueue(`https://api.jikan.moe/v4/${endpoint}`);
      const data = json.data || [];

      cache.current[endpoint] = data;
      setAnimeList(data);
    } catch (error) {
      console.error(`Failed to fetch ${title}:`, error);
    }
  };

  fetchAnime();
}, [endpoint, delayIndex, title]);


  return (
    <section className="mb-10">
      <h2 className="mb-4 text-2xl font-bold text-white px-5">{title}</h2>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-5">
        {animeList.map((anime) => (
          <div
            key={anime.mal_id}
            className="min-w-[250px] max-w-[250px] h-[350px] rounded-xl overflow-hidden"
          >
            <BentoTilt className="w-full h-full">
              <MovieCard
                src={
                  anime.trailer?.images?.maximum_image_url ||
                  anime.images?.jpg?.image_url ||
                  "https://via.placeholder.com/250x350"
                }
                title={anime.title_english || anime.title || "Untitled"}
                description={(anime.synopsis?.substring(0, 100) || "No description") + "..."}
                isComingSoon={!anime.airing && anime.status !== "Finished Airing"}
                id={anime.mal_id}
              />
            </BentoTilt>
          </div>
        ))}
      </div>
    </section>
  );
};



export default AnimeSection;
