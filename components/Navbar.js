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
    <>
      <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-2">
        Mood Journal
      </h1>
      <h2 className="text-lg md:text-2xl text-center text-gray-700 mb-6">{currentDate}</h2>
    </>
  );
};
