import { useEffect, useState } from "react";

export const Navbar = () => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  return (
    <nav className="flex items-center justify-between gap-3 flex-1">
      <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-800">
        MoodScape
      </h1>
      <h2 className="text-base text-center text-gray-700">{currentDate}</h2>
    </nav>
  );
};
