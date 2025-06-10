// GenreSpotlight.tsx
import { useEffect, useState } from "react";
import { requestWithQueue } from "../utils/requestWithQueue";
import { useRef } from "react";
import { fetchWikimediaImage } from "../utils/imaheutil";
import { animeGenres } from "../utils/genreutil";

const GenreCard = ({ genre, cache }) => {

  return (
    <div
      key={genre.mal_id}
      className="relative rounded-xl overflow-hidden group cursor-pointer"
      onClick={()=>{
        // open the genre mal url in new tab
        window.open(genre.url, '_blank');
      }}
    >
      <img
        src={genre.image || `https://via.placeholder.com/300x300`}
        alt={genre.name}
        className="w-full h-24 object-cover group-hover:scale-110 transition duration-300"
      />
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-semibold">
        {genre.name}
      </div>
    </div>
  );
};

const GenreSpotlight = () => {
  const [genres, setGenres] = useState([]);
  const cache = useRef({});
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setGenres(animeGenres);
      } catch (err) {
        console.error("Failed to fetch genres", err);
      }
    };

    fetchGenres();
  }, []);

  return (
     <section className="mb-10 px-5">
      <h2 className="mb-4 text-2xl font-bold text-white">Explore by Genre</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {genres.slice(0, 12).map((genre) => (
          <GenreCard key={genre.mal_id} genre={genre} cache={cache} />
        ))}
      </div>
    </section>
  );
};

export default GenreSpotlight;
