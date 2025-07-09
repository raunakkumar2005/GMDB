// src/components/Modal.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../context/ModalContext";
import gsap from "gsap";

const Modal = () => {
  const { isModalOpen, closeModal } = useModal();
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  const [shouldRender, setShouldRender] = useState(false);

  // Entry & Exit Animation Controller
  useEffect(() => {
    if (isModalOpen) {
      setShouldRender(true);
    }
  }, [isModalOpen]);

  // Entry Animation
  useEffect(() => {
    if (shouldRender && isModalOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [shouldRender, isModalOpen]);

  // Exit Animation
  const handleCloseModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => {
          closeModal();
          setShouldRender(false);
        },
      });
    }
  };

  // ESC Key and Click Outside Detection
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        handleCloseModal();
      }
    };

    const handleClickOutside = (e) => {
      if (e.target === overlayRef.current) {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const handleNavigate = (path) => {
    handleCloseModal();
    setTimeout(() => navigate(path), 400); // Delay navigation to allow exit animation to finish
  };

  if (!shouldRender) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-[1000]"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-5xl p-6"
      >
        {/* Anime Card */}
        <div
          onClick={() => handleNavigate("/anime")}
          className="relative cursor-pointer overflow-hidden rounded-2xl group shadow-2xl p-12 flex items-center justify-center hover:scale-[1.07] hover:rotate-[-1deg] transition-transform duration-500 bg-gradient-to-r from-indigo-500 to-purple-600"
        >
          <h2 className="text-white text-4xl font-extrabold tracking-widest group-hover:text-yellow-400 transition-colors duration-300 drop-shadow-lg">
            ANIME
          </h2>
        </div>

        {/* Games Card */}
        <div
          onClick={() => handleNavigate("/games")}
          className="relative cursor-pointer overflow-hidden rounded-2xl group shadow-2xl p-12 flex items-center justify-center hover:scale-[1.07] hover:rotate-[1deg] transition-transform duration-500 bg-gradient-to-r from-pink-500 to-red-600"
        >
          <h2 className="text-white text-4xl font-extrabold tracking-widest group-hover:text-yellow-400 transition-colors duration-300 drop-shadow-lg">
            GAMES
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Modal;
