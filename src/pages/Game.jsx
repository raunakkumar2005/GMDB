import { useEffect } from "react";
import { useState } from "react";
import NavBar from "../components/Navbar";
import { API_KEY } from "../utils/keys";
import Hero from "../components/Hero";
import GenreGrid from "../components/GenreGrid";
import { UpcomingGamesSpotlight } from "../components/GameTrailers";
import RedditPosts from "../components/RedditPosts";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import GameSection from "../components/GameSection";


const Games = () => {
  const [featuredGames, setFeaturedGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games?ordering=-rating&key=${API_KEY}&page_size=5`
        );
        const data = await res.json();
        setFeaturedGames(data.results || []);
      } catch (err) {
        console.error('Failed to fetch featured games', err);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="bg-black text-white">
      <NavBar />

      {/* Hero Section with top rated games */}
      <Hero />

      {/* Game Categories */}
      <section className="bg-black">
        <GameSection title="Trending Games" endpoint="games?ordering=-added" delayIndex={0} />
        <GameSection title="Editor's Choice" endpoint="games/lists/popular?ordering=-relevance" delayIndex={1} />
        <GameSection title="Top Rated" endpoint="games?ordering=-rating" delayIndex={2} />
        <GameSection title="Indie Picks" endpoint="games?genres=indie&ordering=-rating" delayIndex={3} />
      </section>

      <GenreGrid />
      <UpcomingGamesSpotlight/>
      <RedditPosts />


      {/* Contact & Footer */}
      <Contact />
      <Footer />
    </div>
  );
};

// export default Games;


export default Games;
