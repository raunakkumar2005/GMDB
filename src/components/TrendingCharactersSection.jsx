// TrendingCharactersSection.tsx
import { useEffect, useState, useRef } from "react";
import { requestWithQueue } from "../utils/requestWithQueue";

const TrendingCharactersSection = () => {
    const [characters, setCharacters] = useState([]);
    const cache = useRef({});

    useEffect(() => {
        const fetchCharacters = async () => {
            const endpoint = "top/characters";

            if (cache.current[endpoint]) {
                setCharacters(cache.current[endpoint]);
                return;
            }

            try {
                const json = await requestWithQueue(`https://api.jikan.moe/v4/${endpoint}`);
                const data = json.data || [];

                cache.current[endpoint] = data;
                setCharacters(data);
            } catch (err) {
                console.error("Failed to fetch characters:", err);
            }
        };

        fetchCharacters();
    }, []);


    return (
        <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white px-5">Trending Characters</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar px-5">
                    {characters.slice(0, 10).map((char) => (
                        <a
                            key={char.mal_id}
                            href={`https://myanimelist.net/character/${char.mal_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative group min-w-[240px] h-[320px] rounded-xl overflow-hidden bg-gray-800 transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl"
                        >
                            {/* Animated gradient border */}
                            <div className="absolute inset-0 z-0 rounded-xl border-2 border-transparent group-hover:border-[3px] group-hover:border-gradient-to-br group-hover:from-pink-500 group-hover:via-purple-500 group-hover:to-blue-500 transition-all duration-500 pointer-events-none" />

                            {/* Character Image */}
                            <img
                                src={char.images?.jpg?.image_url}
                                alt={char.name}
                                className="w-full h-full object-cover rounded-xl group-hover:brightness-75 transition duration-500"
                            />

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="text-white text-base font-semibold px-3 py-2 text-center">
                                    {char.name}
                                </div>
                            </div>
                        </a>
                    ))}
                


            </div>
        </section>
    );
};

export default TrendingCharactersSection;
