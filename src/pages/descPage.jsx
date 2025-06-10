import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TiLocationArrow } from "react-icons/ti";
import Button from "../components/Button";
import RelatedAnime from "../components/RelatedAnime";

gsap.registerPlugin(ScrollTrigger);

export const AnimeDetailPage = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    const fetchAnime = async () => {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
      const data = await res.json();
      console.log(data.data);

      setAnime(data.data);
    };
    fetchAnime();
  }, [id]);

  useEffect(() => {
    if (!anime || !heroRef.current) return;

    gsap.from(containerRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });

    gsap.set(heroRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
    });

    gsap.to(heroRef.current, {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.from(detailsRef.current, {
      opacity: 0,
      y: 50,
      duration: 1.5,
      scrollTrigger: {
        trigger: detailsRef.current,
        start: "top 80%",
      },
    });
  }, [anime]);

  if (!anime) return <div className="text-white p-10">Loading...</div>;

  const trailerUrl = anime.trailer?.embed_url || null;
  const streamingLink = anime.streaming?.[0]?.url || null;

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-gradient-to-b from-black via-[#0f0f23] to-black text-white"
    >
      {/* Fullscreen Hero Section with Fold Animation */}
      <div ref={heroRef} className="relative h-screen w-full overflow-hidden" id="video-frame">
        <img
          src={anime.images?.jpg?.image_url}
          alt={anime.title}
          className="absolute top-0 left-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90 flex flex-col justify-end p-10">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 special-font animate-fade-in-up">{anime.title_english}</h1>
            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl animate-fade-in-up delay-200">
              {anime.synopsis}
            </p>

            <Button
              id="watch-now-btn"
              title="Watch Now"
              containerClass="mt-6"
              onclick={() => {
                if (streamingLink) {
                  window.open(streamingLink, "_blank", "noopener noreferrer");
                } else {
                  alert("Watch link not available for this anime.");
                }
              }}
            />
          </div>
        </div>
      </div>


      {/* Anime Details Section */}
      <div ref={detailsRef} className="max-w-6xl mx-auto px-5 py-16 animate-slide-up space-y-12">
        {/* Stats and Genres */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
              <p><strong>Episodes:</strong> {anime.episodes || "?"}</p>
              <p><strong>Status:</strong> {anime.status}</p>
              <p><strong>Rating:</strong> {anime.rating}</p>
              <p><strong>Score:</strong> {anime.score}</p>
              <p><strong>Rank:</strong> #{anime.rank}</p>
              <p><strong>Airing:</strong> {anime.airing ? "Yes" : "No"}</p>
            </div>
          </div>
          <div className="bg-white/5 p-6 rounded-xl shadow-lg md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Genres</h3>
            <div className="flex flex-wrap gap-3">
              {anime.genres?.map((genre) => (
                <span
                  key={genre.mal_id}
                  className="rounded-full border border-white/20 px-4 py-1 text-xs uppercase text-white/60 bg-white/10"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Background and Source Info */}
        <div className="bg-white/5 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Background & Source</h3>
          <p className="text-white/80 text-sm mb-2">{anime.background || "No background info available."}</p>
          <div className="grid grid-cols-2 gap-4 text-white/80 text-sm">
            <p><strong>Source:</strong> {anime.source || "Unknown"}</p>
            <p><strong>Demographics:</strong> {anime.demographics?.map(d => d.name).join(", ") || "N/A"}</p>
            <p><strong>Studios:</strong> {anime.studios?.map(s => s.name).join(", ") || "N/A"}</p>
            <p><strong>Producers:</strong> {anime.producers?.map(p => p.name).join(", ") || "N/A"}</p>
          </div>
        </div>

        {/* Broadcast Information */}
        <div className="bg-white/5 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Broadcast Info</h3>
          <div className="grid grid-cols-2 gap-4 text-white/80 text-sm">
            <p><strong>Aired:</strong> {anime.aired?.string || "Unknown"}</p>
            <p><strong>Season:</strong> {anime.season || "N/A"}</p>
            <p><strong>Year:</strong> {anime.year || "N/A"}</p>
            <p><strong>Duration:</strong> {anime.duration || "N/A"}</p>
          </div>
        </div>

        {anime?.relations && anime.relations.length > 0 && (
          <RelatedAnime relations={anime.relations} />
        )}

        {/* Popularity & Favorites */}
        <div className="bg-white/5 p-6 rounded-xl shadow-lg grid grid-cols-2 md:grid-cols-4 text-white/80 text-sm gap-4">
          <div>
            <h4 className="font-semibold mb-1">Popularity</h4>
            <p>#{anime.popularity}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Members</h4>
            <p>{anime.members?.toLocaleString() || "N/A"}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Favorites</h4>
            <p>{anime.favorites?.toLocaleString() || "N/A"}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Ranked</h4>
            <p>#{anime.rank || "N/A"}</p>
          </div>
        </div>

        {/* Opening and Ending Themes */}
        {anime.opening_themes?.length > 0 || anime.ending_themes?.length > 0 ? (
          <div className="bg-white/5 p-6 rounded-xl shadow-lg space-y-6">
            <h3 className="text-xl font-semibold mb-4">Themes</h3>
            {anime.opening_themes?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Opening Themes</h4>
                <ul className="list-disc list-inside text-white/80 text-sm max-h-40 overflow-y-auto">
                  {anime.opening_themes.map((theme, i) => (
                    <li key={i}>{theme}</li>
                  ))}
                </ul>
              </div>
            )}
            {anime.ending_themes?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Ending Themes</h4>
                <ul className="list-disc list-inside text-white/80 text-sm max-h-40 overflow-y-auto">
                  {anime.ending_themes.map((theme, i) => (
                    <li key={i}>{theme}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Trailer */}
      {trailerUrl && (
        <div className="max-w-4xl mx-auto px-5 py-10 animate-fade-in">
          <h2 className="text-2xl mb-4 font-semibold">Watch Trailer</h2>
          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src={trailerUrl}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
              title="Anime Trailer"
              frameBorder="0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeDetailPage;
