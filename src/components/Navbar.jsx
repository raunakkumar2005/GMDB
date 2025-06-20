import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { useNavigate, useNavigation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
const navItems = ["Nexus", "Vault", "Prologue", "About", "Contact"];

const NavBar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo and Dropdown */}
          <div className="flex items-center gap-7 relative">
            <img src="/img/logo.png" alt="logo" className="w-10" onClick={() => {
              navigate("/")
            }} />

            {/* Explore Dropdown Button */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-1 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-blue-100 transition duration-300"
              >
                Explore <TiLocationArrow />
              </button>

              {/* Dropdown Content */}
              {isDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden"
                  onMouseLeave={closeDropdown}
                >
                  <a
                    href="/anime"
                    className="block px-5 py-3 text-sm text-gray-800 hover:bg-blue-100 hover:text-black transition duration-200"
                    onClick={closeDropdown}
                  >
                    Anime
                  </a>
                  <a
                    href="/games"
                    className="block px-5 py-3 text-sm text-gray-800 hover:bg-blue-100 hover:text-black transition duration-200"
                    onClick={closeDropdown}
                  >
                    Games
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links and Audio Button */}
          <div className="flex items-center gap-4">
            {/* Nav links - hidden on small screens */}
            <div className="hidden md:flex gap-4">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="nav-hover-btn"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Audio Indicator */}
            <button
              onClick={toggleAudioIndicator}
              className="flex items-center space-x-0.5"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>

            {/* Search Button - Small Icon */}
            <button
              onClick={() => navigate("/search")}
              className="text-white hover:text-indigo-400 transition"
              title="Search"
            >
              <FiSearch size={20} />
            </button>
          </div>

        </nav>
      </header>
    </div>
  );
};

export default NavBar;
