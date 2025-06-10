import React, { useEffect, useState } from "react";
import { BentoTilt } from "./Features";
import { MovieCard } from "./AnimeSection";
import { requestWithQueue } from "../utils/requestWithQueue";


function RelatedAnime({ relations }) {
  const [relatedData, setRelatedData] = useState({});

  useEffect(() => {
    async function fetchRelations() {
      const allEntries = relations.flatMap(rel => rel.entry);

      const fetches = allEntries.map(async (entry) => {
        try {
          const apiUrl =
            entry.type === "anime"
              ? `https://api.jikan.moe/v4/anime/${entry.mal_id}`
              : `https://api.jikan.moe/v4/manga/${entry.mal_id}`;

          const data = await requestWithQueue(apiUrl);
          // const data = await res.json();
          const details = data.data;

          return {
            mal_id: entry.mal_id,
            title: details.title,
            image: details.images?.jpg?.image_url || details.images?.jpg?.large_image_url,
            url: details.url,
            synopsis: details.synopsis || "",
            type: entry.type,
            relation: relations.find(r => r.entry.some(e => e.mal_id === entry.mal_id))?.relation || "",
            airing: details.status?.toLowerCase().includes("airing"),
            status: details.status || "",
          };
        } catch (e) {
          console.error("Failed to fetch for mal_id:", entry.mal_id, e);
          return null;
        }
      });

      const results = await Promise.all(fetches);

      const dataMap = {};
      results.forEach(item => {
        if (item) dataMap[item.mal_id] = item;
      });

      setRelatedData(dataMap);
    }

    fetchRelations();
  }, [relations]);

  const allEntries = relations.flatMap(rel => rel.entry);

  return (
    <div className="bg-white/5 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-white">Related Anime & Manga</h3>

      <div className="flex overflow-x-auto space-x-4 py-2 hide-scrollbar">
        {allEntries.map((entry) => {
          const data = relatedData[entry.mal_id];

          return (
            <div key={entry.mal_id} className="min-w-[200px] flex-shrink-0 cursor-pointer">
              <BentoTilt className="w-full h-full">
                <MovieCard
                  src={data?.image || "https://via.placeholder.com/250x350"}
                  title={data?.title || entry.name}
                  description={(data?.synopsis?.substring(0, 100) ?? "") + "..."}
                //   isComingSoon={!data?.airing && data?.status !== "Finished Airing"}
                  id={entry.mal_id}
                />
              </BentoTilt>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RelatedAnime;
