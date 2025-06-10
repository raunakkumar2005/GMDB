import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";

const GameDetailHero = ({ game }) => {
  if (!game) return null;

  const {
    name,
    background_image,
    description_raw,
    website,
    released,
    rating,
  } = game;

  return (
    <div className="relative h-[90vh] w-full overflow-hidden bg-black">
      {/* Background image */}
      <img
        src={background_image}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover object-center z-0"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full w-full flex items-end px-5 sm:px-10 pb-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 special-font">
            {name}
          </h1>

          <p className="text-sm text-white/80 mb-4 line-clamp-4">
            {description_raw || "No description available."}
          </p>

          <p className="text-xs text-white/50 mb-6">
            Released: {released || "TBA"} | Rating: {rating || "N/A"}
          </p>

          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer">
              <Button
                title="Visit Official Site"
                leftIcon={<TiLocationArrow />}
                containerClass="bg-yellow-300 text-black flex-center gap-1"
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetailHero;
