import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_KEY } from '../utils/keys';

export const UpcomingGamesSpotlight = () => {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const sixtyDaysLater = new Date();
    sixtyDaysLater.setDate(sixtyDaysLater.getDate() + 60);
    const futureDate = sixtyDaysLater.toISOString().split('T')[0];

    const fetchUpcomingGames = async () => {
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games?dates=${today},${futureDate}&ordering=-added&page_size=10&key=${API_KEY}`
        );
        const data = await res.json();
        setGames(data.results);
      } catch (err) {
        console.error('Failed to fetch upcoming games', err);
      }
    };

    fetchUpcomingGames();
  }, []);

  return (
    <section className="mt-12 px-5">
      <h2 className="text-2xl font-bold text-white mb-4">Upcoming Games Spotlight</h2>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => navigate(`/games/${game.slug}`)}
            className="min-w-[240px] max-w-[240px] cursor-pointer rounded-xl bg-white/5 backdrop-blur-md shadow-lg transition-transform hover:scale-[1.03] hover:shadow-xl overflow-hidden relative flex-shrink-0"
          >
            {/* Image */}
            <div className="relative h-44 w-full">
              <img
                src={game.background_image}
                alt={game.name}
                className="h-full w-full object-cover"
              />
              {/* Gradient + Date overlay */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-2">
                <span className="text-xs text-white/80">
                  Release: {game.released || 'TBA'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-1">
              <h3 className="text-white font-semibold text-sm line-clamp-2">{game.name}</h3>
              <div className="text-yellow-400 text-sm">
                ⭐ {game.rating?.toFixed(1) || 'N/A'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UpcomingGamesSpotlight;
