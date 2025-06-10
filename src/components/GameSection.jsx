import React, { useEffect, useRef, useState } from 'react';
import { API_KEY } from '../utils/keys';
import { requestWithQueue } from '../utils/requestWithQueue';
import { BentoTilt } from './Features';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { MdOutlineCalendarMonth } from 'react-icons/md';

gsap.registerPlugin(ScrollTrigger);

export const GameCard = ({ src, title, description, releaseDate, rating = 0, slug }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer overflow-hidden rounded-xl bg-zinc-900 shadow-md transition-transform duration-300 hover:scale-[1.03]"
      onClick={() => navigate(`/games/${slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={src}
        alt={title}
        className="h-44 w-full object-cover transition duration-300 group-hover:brightness-75"
      />

      <div className="p-3">
        <h2 className="text-white text-base font-semibold truncate">{title}</h2>
        <div className="flex items-center text-sm text-gray-400 mt-1 justify-between">
          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            {rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <MdOutlineCalendarMonth />
            {releaseDate || 'TBA'}
          </span>
        </div>
        {hovered && description && (
          <p className="mt-2 text-xs text-gray-300 line-clamp-3 transition-opacity duration-300">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

const GameSection = ({ title, endpoint, delayIndex = 0 }) => {
  const [games, setGames] = useState([]);
  const cache = useRef({});
  const sectionRef = useRef();

  useEffect(() => {
    const fetchGames = async () => {
      if (cache.current[endpoint]) {
        setGames(cache.current[endpoint]);
        return;
      }

      try {
        await new Promise((res) => setTimeout(res, 800 * delayIndex));
        const json = await requestWithQueue(`https://api.rawg.io/api/${endpoint}&key=${API_KEY}`);
        const data = json.results || [];
        cache.current[endpoint] = data;
        setGames(data);
      } catch (error) {
        console.error(`Failed to fetch ${title}:`, error);
      }
    };

    fetchGames();
  }, [endpoint, delayIndex, title]);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="px-4 mb-12">
      <h2 className="mb-4 text-2xl font-bold text-white">{title}</h2>
      <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-2">
        {games.map((game) => (
          <div
            key={game.id}
            className="min-w-[260px] max-w-[260px]  flex-shrink-0"
          >
            <BentoTilt className="w-full h-full">
              <GameCard
                src={game.background_image || 'https://via.placeholder.com/260x370'}
                title={game.name}
                description={game.short_description || 'No description available.'}
                releaseDate={game.released}
                rating={game.rating}
                slug={game.slug}
              />
            </BentoTilt>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GameSection;
