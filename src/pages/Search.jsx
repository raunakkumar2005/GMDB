import { useState, useEffect } from "react";
import useDebounce from "../utils/useDebounce";
import { Link } from "react-router-dom";
import { requestWithQueue } from "../utils/requestWithQueue";
import { API_KEY } from "../utils/keys";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const JIKAN_URL = "https://api.jikan.moe/v4/anime";
const RAWG_URL = "https://api.rawg.io/api/games";

export default function SearchPage() {
    const [q, setQ] = useState("");
    const debouncedQ = useDebounce(q, 300);
    const [animeResults, setAnime] = useState([]);
    const [gameResults, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");
    const [minRating, setMinRating] = useState("");
    const [year, setYear] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const navigate = useNavigate();
    useEffect(() => {
        if (!debouncedQ) {
            setAnime([]);
            setGames([]);
            return;
        }

        async function fetchAll() {
            try {
                setLoading(true); // Start loader
                const animeUrl = `${JIKAN_URL}?q=${debouncedQ}&limit=24${year ? `&start_date=${year}-01-01&end_date=${year}-12-31` : ""}`;
                const gamesUrl = `${RAWG_URL}?key=${API_KEY}&search=${debouncedQ}&page_size=24${year ? `&dates=${year}-01-01,${year}-12-31` : ""}&ordering=${sortOrder === "desc" ? "-rating" : "rating"}`;

                const [aRes, gRes] = await Promise.all([
                    requestWithQueue(animeUrl),
                    requestWithQueue(gamesUrl),
                ]);

                const numericRating = parseFloat(minRating);
                const validMinRating = !isNaN(numericRating) && numericRating > 0;

                setAnime((aRes.data || []).filter((a) =>
                    validMinRating ? a.rating && a.rating >= numericRating : true
                ));
                setGames((gRes.results || []).filter((g) =>
                    validMinRating ? g.rating >= numericRating : true
                ));
            } catch (err) {
                console.error("Search error", err);
            } finally {
                setLoading(false); // End loader
            }
        }


        fetchAll();
    }, [debouncedQ, minRating, year, sortOrder]);

    const filteredResults = [
        ...(filter !== "games" ? animeResults : []),
        ...(filter !== "anime" ? gameResults : []),
    ];

    const renderCard = (item) => {
        const isAnime = item.mal_id;
        const title = isAnime ? item.title_english : item.name;
        const image = isAnime ? item.images.jpg.image_url : item.background_image;
        const link = isAnime ? `/anime/${item.mal_id}` : `/games/${item.slug}`;

        

        return (
            <Link
                key={isAnime ? item.mal_id : item.id}
                to={link}
                className="relative bg-white/10 rounded-xl overflow-hidden backdrop-blur-md shadow-lg hover:scale-105 transition-transform duration-300 flex-shrink-0"
            >
                <img
                    src={image}
                    alt={title}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 flex items-end">
                    <p className="text-white font-semibold text-sm line-clamp-2">
                        {title}
                    </p>
                </div>
            </Link>
        );
    };

   

    return (
        <div className="min-h-screen bg-[#0e0e10] px-4 sm:px-6 lg:px-8 py-8 text-gray-100">
             
            <div className="max-w-6xl mx-auto">
                {/* Back button + Search bar */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-4 text-sm"
                    >
                        <FaArrowLeft className="text-base" />
                    </button>

                    <input
                        type="text"
                        placeholder="Search anime & games..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="flex-1 rounded-full border border-gray-700 bg-[#1c1c1f] px-5 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                    />
                </div>

                {/* Filter Panel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Type Filter */}
                    <div className="flex flex-col bg-[#1c1c1f] rounded-xl p-3 border border-gray-700">
                        <label className="text-sm text-gray-400 mb-1">Type</label>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-[#2a2a2d] border-none text-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All</option>
                            <option value="anime">Anime Only</option>
                            <option value="games">Games Only</option>
                        </select>
                    </div>

                    {/* Min Rating */}
                    <div className="flex flex-col bg-[#1c1c1f] rounded-xl p-3 border border-gray-700">
                        <label className="text-sm text-gray-400 mb-1">Minimum Rating</label>
                        <input
                            type="number"
                            placeholder="e.g. 7.5"
                            value={minRating}
                            onChange={(e) => setMinRating(e.target.value)}
                            className="bg-[#2a2a2d] text-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            min="0"
                            max="10"
                            step="0.1"
                        />

                    </div>

                    {/* Year Filter */}
                    <div className="flex flex-col bg-[#1c1c1f] rounded-xl p-3 border border-gray-700">
                        <label className="text-sm text-gray-400 mb-1">Release Year</label>
                        <input
                            type="number"
                            placeholder="e.g. 2020"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="bg-[#2a2a2d] text-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            min="1980"
                            max={new Date().getFullYear()}
                        />
                    </div>

                    {/* Sort Order */}
                    <div className="flex flex-col bg-[#1c1c1f] rounded-xl p-3 border border-gray-700">
                        <label className="text-sm text-gray-400 mb-1">Sort by Rating</label>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="bg-[#2a2a2d] border-none text-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="desc">High to Low</option>
                            <option value="asc">Low to High</option>
                        </select>
                    </div>
                </div>

                {
            loading && (
                <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-[#0e0e10]">
                    {/* https://uiverse.io/G4b413l/tidy-walrus-92 */}
                    <div className="three-body">
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                    </div>
                </div>
            )
        }

                {/* Result Cards */}
                {filteredResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredResults.map(renderCard)}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-12">
                        No results for "{debouncedQ}"
                    </p>
                )}
            </div>
        </div>
    );
}
