import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import AnimeHero from "../components/AnimeHero"; // Import AnimeHero instead of Hero
import Features from "../components/Features";
import Footer from "../components/Footer";
import AnimeSection from "../components/AnimeSection";
import Contact from "../components/Contact";
import TrendingCharactersSection from "../components/TrendingCharactersSection";
import GenreSpotlight from "../components/GenreSpotlight";
import HiddenGemsSection from "../components/HiddenGemsSection";

const Anime = () => {
  const [featuredAnime, setFeaturedAnime] = useState([]);

  useEffect(() => {
    // Fetch top anime from Jikan API as featured anime
    fetch("https://api.jikan.moe/v4/top/anime")
      .then((res) => res.json())
      .then((data) => {
        setFeaturedAnime(data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch featured anime:", err);
      });
  }, []);
if (!featuredAnime.length) {
    return <div className="text-white text-center p-10">Loading featured anime...</div>;
  }
  return (
    <div className="bg-black">
      <NavBar />
      {/* Replace Hero with AnimeHero */}
      <AnimeHero featuredAnime={featuredAnime} />

      <section className="bg-black mb-10">
        <AnimeSection title="New Releases" endpoint="top/anime?filter=airing" delayIndex={0} />
        <AnimeSection title="Popular This Season" endpoint="seasons/now" delayIndex={1} />
        <AnimeSection title="Upcoming Anime" endpoint="seasons/upcoming" delayIndex={2} />
        <AnimeSection title="Top Rated" endpoint="top/anime" delayIndex={3} />

        <TrendingCharactersSection />
        <GenreSpotlight />
      </section>

      {/* <Contact /> */}
      <Footer />
    </div>
  );
};

export default Anime;
