import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Modal from "react-modal";
import Button from "../components/Button";
import { API_KEY } from "../utils/keys";
import NavBar from "../components/Navbar";
import GameDetailHero from "../components/GameDetailHero";

gsap.registerPlugin(ScrollTrigger);

const GameDetailPage = () => {
  const { slug } = useParams();
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [similarGames, setSimilarGames] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [redditPosts, setRedditPosts] = useState([]);
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const detailsRef = useRef(null);
  const screenshotsRef = useRef([]);

  useEffect(() => {
    const fetchGame = async () => {
      const res = await fetch(`https://api.rawg.io/api/games/${slug}?key=${API_KEY}`);
      const data = await res.json();
      console.log(data);

      setGame(data);
    };

    const fetchScreenshots = async () => {
      const res = await fetch(`https://api.rawg.io/api/games/${slug}/screenshots?key=${API_KEY}`);
      const data = await res.json();
      setScreenshots(data.results || []);
    };


    const fetchTrailer = async () => {
      try {
        const res = await fetch(`https://api.rawg.io/api/games/${slug}/movies?key=${API_KEY}`);
        const data = await res.json();
        const videoUrl = data.results?.[0]?.data?.max || data.results?.[0]?.data?.["480"] || null;
        setTrailerUrl(videoUrl);
      } catch (err) {
        console.error("Failed to fetch trailer", err);
      }
    };

    const fetchRedditPosts = async () => {
      try {
        const res = await fetch(`https://api.rawg.io/api/games/${slug}/reddit?key=${API_KEY}`);
        const data = await res.json();
        console.log("Reddit posts:", data.results);

        setRedditPosts(data.results || []);
      } catch (error) {
        console.error("Failed to fetch Reddit posts:", error);
      }
    };

    fetchRedditPosts();

    fetchGame();
    fetchScreenshots();
    // fetchSimilarGames();
    fetchTrailer();
  }, [slug]);

  useEffect(() => {
    const fetchSimilarGames = async () => {
      if (!game?.developers?.[0]) return;

      try {
        const devSlug = game.developers[0].slug;
        const res = await fetch(`https://api.rawg.io/api/games?developers=${devSlug}&page_size=8&key=${API_KEY}`);
        const data = await res.json();
        setSimilarGames(data.results.filter(g => g.slug !== game.slug));
      } catch (error) {
        console.error("Failed to fetch developer games:", error);
      }
    };

    fetchSimilarGames();
  }, [game]);

  useEffect(() => {
    if (!game || !heroRef.current) return;

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
  }, [game]);

  // useEffect(() => {
  //   if (!screenshotsRef.current || screenshotsRef.current.length === 0) return;

  //   gsap.from(screenshotsRef.current, {
  //     opacity: 0,
  //     y: 30,
  //     duration: 0.6,
  //     stagger: 0.1,
  //     scrollTrigger: {
  //       trigger: detailsRef.current,
  //       start: "top 80%",
  //     },
  //   });
  // }, [screenshots]);

  if (!game) return <div className="text-white p-10">Loading...</div>;

  // const trailerUrl = game.movies ? game.movies.data[0].max : null;

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-gradient-to-b from-black via-[#0f0f23] to-black text-white"
    >
      <div className="bg-black text-white min-h-screen">
        <GameDetailHero game={game} />
      </div>
      {/* Game Details */}
      <div ref={detailsRef} className="max-w-6xl mx-auto px-5 py-16 space-y-12">
        {/* Stats and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Game Info</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
              <p><strong>Released:</strong> {game.released}</p>
              <p><strong>Rating:</strong> {game.rating} / 5</p>
              <p><strong>Playtime:</strong> {game.playtime} hrs</p>
              <p><strong>Metacritic:</strong> {game.metacritic || "N/A"}</p>
            </div>
          </div>
          <div className="bg-white/5 p-6 rounded-xl shadow-lg md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Genres & Platforms</h3>
            <div className="flex flex-wrap gap-3 text-sm text-white/80">
              {game.genres?.map((g) => (
                <span key={g.id} className="bg-white/10 border border-white/20 px-3 py-1 rounded-full">{g.name}</span>
              ))}
              {game.platforms?.map((p) => (
                <span key={p.platform.id} className="bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                  {p.platform.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {game.ratings?.length > 0 && (
          <div className="bg-white/5 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Community Ratings</h3>
            <div className="space-y-2">
              {game.ratings.map((r) => (
                <div key={r.id} className="text-white/80">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{r.title}</span>
                    <span>{r.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${r.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Store Links */}
        {game.stores?.length > 0 && (
          <div className="bg-white/5 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Buy From</h3>
            <div className="flex flex-wrap gap-4">
              {game.stores.map((store) => (
                <a
                  key={store.id}
                  href={`https://${store.store.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm transition"
                >
                  {store.store.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Screenshots */}
        {/* Screenshots with Modal */}
        {screenshots.length > 0 && (
          <div className="bg-white/5 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Screenshots</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {screenshots.map((s, i) => (
                <img
                  key={s.id}
                  ref={(el) => (screenshotsRef.current[i] = el)}
                  src={s.image}
                  alt="Screenshot"
                  className="rounded-lg w-full h-auto object-cover hover:scale-105 cursor-pointer transition-transform duration-300"
                  onClick={() => setModalImage(s.image)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Modal for full-screen screenshot */}
        <Modal
          isOpen={!!modalImage}
          onRequestClose={() => setModalImage(null)}
          shouldCloseOnOverlayClick={true}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
          overlayClassName="fixed inset-0 bg-black bg-opacity-70"
        >
          <div className="relative">
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-2 right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-red-500 hover:text-white transition"
              aria-label="Close modal"
            >
              &times;
            </button>
            <img
              src={modalImage}
              alt="Full screenshot"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
            />
          </div>
        </Modal>


        {/* Trailer */}
        {trailerUrl && (
          <div className="max-w-4xl mx-auto px-5 py-10 animate-fade-in">
            <h2 className="text-2xl mb-4 font-semibold">Gameplay Clip</h2>
            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
              <video src={trailerUrl} controls className="w-full h-full" autoPlay />
            </div>
          </div>
        )}


        {/* Similar Games */}
        {similarGames.length > 0 && (
          <div className="bg-white/5 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Similar Games</h3>
            <div className="flex overflow-x-auto space-x-4 pb-2 hide-scrollbar">
              {similarGames.map((g) => (
                <div
                  key={g.id}
                  className="min-w-[180px] relative bg-white/10 rounded-xl overflow-hidden backdrop-blur-md shadow-lg hover:scale-105 transition-transform duration-300 flex-shrink-0"
                  onClick={() => window.location.href = `/games/${g.slug}`}
                >
                  <img
                    src={g.background_image}
                    alt={g.name}
                    className="w-full h-40 object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 flex items-end">
                    <p className="text-white font-semibold text-sm line-clamp-2">
                      {g.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {redditPosts.length > 0 && (
          <div className="bg-white/5 p-6 rounded-xl shadow-lg mt-12">
            <h3 className="text-2xl font-bold text-white mb-6">Reddit Buzz</h3>
            <div className="flex space-x-4 overflow-x-auto pb-2 hide-scrollbar">
              {redditPosts.map((post) => (
                <a
                  key={post.id}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[300px] max-w-[300px] bg-zinc-900 rounded-xl shadow hover:scale-[1.02] transition-transform flex-shrink-0 border border-white/10"
                >
                  <div className="relative w-full h-40">
                    <img
                      src={post.image || post.thumbnail || 'https://www.redditstatic.com/icon.png'}
                      alt="Reddit Thumbnail"
                      className="w-full h-full object-cover rounded-t-xl"
                    />
                    <img
                      src="https://www.redditstatic.com/icon.png"
                      alt="Reddit logo"
                      className="absolute top-2 right-2 w-6 h-6 opacity-90 bg-white rounded-full p-0.5"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="text-white font-semibold text-md line-clamp-2">
                      {post.name}
                    </h4>
                    <div
                      className="text-gray-400 text-sm line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: post.text }}
                    />
                    <div className="flex items-center justify-between text-xs text-white/60 mt-2">
                      <span className="bg-white/10 rounded-full px-2 py-1">
                        r/{post.username}
                      </span>
                      <span className="text-blue-400">💬 {post.comments_count}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}



      </div>
    </div>
  );
};

export default GameDetailPage;
