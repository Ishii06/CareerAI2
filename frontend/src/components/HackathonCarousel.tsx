import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";

interface Hackathon {
  title: string;
  link: string;
  themes: string[];
  status: string[];
}

const HackathonCarousel = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/hackathons");
        if (Array.isArray(data)) setHackathons(data);
        else setHackathons([]);
      } catch (err) {
        console.error("Failed to fetch hackathons:", err);
        setHackathons([]);
      }
    };
    fetchHackathons();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || hackathons.length === 0) return;

    let scrollAmount = 0;
    const speed = 1;

    const scrollStep = () => {
      if (!scrollContainer) return;

      if (!isHovered) {
        scrollContainer.scrollLeft += speed;
        scrollAmount += speed;

        // Loop when reaching half of the duplicated scroll
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
          scrollAmount = 0;
        }
      }

      animationRef.current = requestAnimationFrame(scrollStep);
    };

    scrollStep();

    // Cleanup on unmount
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [hackathons, isHovered]);

  if (!hackathons || hackathons.length === 0) {
    return (
      <div className="py-10 text-center text-white/70">Loading hackathons...</div>
    );
  }

  const displayHackathons = [...hackathons, ...hackathons];

  return (
    <div className="overflow-hidden relative py-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-white">
        Upcoming Hackathons
      </h2>

      <div
        ref={scrollRef}
        className="flex gap-6 whitespace-nowrap overflow-x-hidden px-6 cursor-grab"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {displayHackathons.map((hackathon, idx) => (
          <motion.a
            key={idx}
            href={hackathon.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="min-w-[250px] bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg flex-shrink-0 hover:bg-white/20 transition-colors"
          >
            <h3 className="font-bold text-lg mb-2 text-white">
              {hackathon.title || "Untitled"}
            </h3>
            <p className="text-sm text-white/70 mb-2">
              {hackathon.themes?.join(", ") || "No themes"}
            </p>
            <p className="text-xs text-white/50">
              {hackathon.status?.join(" | ") || "No status"}
            </p>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default HackathonCarousel;
