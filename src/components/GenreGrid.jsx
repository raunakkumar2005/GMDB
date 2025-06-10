import { useEffect, useState } from 'react';
import { API_KEY } from '../utils/keys';
import { GameCard } from './GameSection';

const GenreGrid = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('action');
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const res = await fetch(`https://api.rawg.io/api/genres?key=${API_KEY}`);
      const data = await res.json();
      setGenres(data.results);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      const fetchGames = async () => {
        const res = await fetch(
          `https://api.rawg.io/api/games?genres=${selectedGenre}&ordering=-added&page_size=6&key=${API_KEY}`
        );
        const data = await res.json();
        setGames(data.results);
      };
      fetchGames();
    }
  }, [selectedGenre]);

  return (
    <section className="text-white py-12 px-4 bg-black">
      <h2 className="text-3xl font-bold mb-6">Browse by Genre</h2>
      <div className="flex flex-wrap gap-4 mb-8">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenre(genre.slug)}
            className={`px-4 py-2 rounded-full border ${
              selectedGenre === genre.slug
                ? 'bg-white text-black'
                : 'border-white text-white'
            } transition-all`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game) => (
          <GameCard
            key={game.id}
            src={game.background_image}
            title={game.name}
            description={game.description_raw || ''}
            releaseDate={game.released || 'TBA'}
            rating={game.rating}
            slug={game.slug}
          />
        ))}
      </div>
    </section>
  );
};

export default GenreGrid;
