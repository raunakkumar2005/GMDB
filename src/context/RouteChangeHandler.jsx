// src/components/RouteChangeHandler.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const RouteChangeHandler = () => {
  const location = useLocation();

  useEffect(() => {
    return () => {
      console.log("Cleaning GSAP animations on route change");
      gsap.killTweensOf("*");
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [location]);

  return null;
};

export default RouteChangeHandler;
