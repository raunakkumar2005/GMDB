import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Anime from "./pages/Anime";
import AnimeDesc from "./pages/AnimeDesc";
import GameSingle from "./pages/GameSingle";
import Games from "./pages/Game";
import SearchPage from "./pages/Search";
import { ModalProvider } from "./context/ModalContext";
import RouteChangeHandler from "./context/RouteChangeHandler";
import Modal from "./components/Modal";


function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <About />
      <Features />
      <Story />
      <Contact />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <ModalProvider>
        <RouteChangeHandler />
        <Modal /> {/* Modal is global, no NavBar here */}

        <main className="relative min-h-screen w-screen overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/games" element={<Games />} />
            <Route path="/anime/:id" element={<AnimeDesc />} />
            <Route path="/games/:slug" element={<GameSingle />} />
            <Route path="/search" element={<SearchPage />} />
            {/* Add more routes here as needed */}
          </Routes>
        </main>

      </ModalProvider>
    </Router>
  );
}

export default App;
