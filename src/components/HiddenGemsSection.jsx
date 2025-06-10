// HiddenGemsSection.tsx
import { useEffect, useState } from "react";
import { BentoTilt } from "./Features";
import { MovieCard } from "./AnimeSection";
import { requestWithQueue } from "../utils/requestWithQueue";


const HiddenGemsSection = () => {
  const [gems, setGems] = useState([]);

  useEffect(() => {
    const fetchHiddenGems = async () => {
      try {
        const json = await requestWithQueue(
          "https://api.jikan.moe/v4/anime?order_by=score&sort=desc&limit=25"
        );
        console.log(json);
        
        // const json = await res.json();
        const filtered = json.data?.filter((anime) => anime.members < 100000) || [];
        setGems(filtered.slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch hidden gems", err);
      }
    };

    fetchHiddenGems();
  }, []);

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-2xl font-bold text-white px-5">Hidden Gems</h2>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-5">
        {gems.map((anime) => (
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
                title={anime.title}
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

export default HiddenGemsSection;
