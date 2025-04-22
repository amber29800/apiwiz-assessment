"use client";

import { useState, useEffect } from "react";

import MoodSelector from "../components/MoodSelector";
import { Navbar } from "@/components/Navbar";

import { getWeatherIcon } from "./../utils/getWeatherIcon";
import { getTodayEntry } from "@/utils/getTodayEntry";

export default function Home() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [dailyNote, setDailyNote] = useState("");
  const [entries, setEntries] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveConfirmation, setSaveConfirmation] = useState(false);

  useEffect(() => {
    const now = new Date();

    const storedEntries = localStorage.getItem("moodEntries");
    if (storedEntries) {
      const parsedEntries = JSON.parse(storedEntries);
      setEntries(parsedEntries);

      const todayEntry = getTodayEntry(parsedEntries);
      if (todayEntry) {
        setSelectedMood(todayEntry.mood);
        setDailyNote(todayEntry.note || "");
      }
    }

    getUserLocationAndWeather();
  }, []);

  const getUserLocationAndWeather = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      (err) => {
        console.error("Error getting location:", err);
        setError("Unable to get your location. Please check permissions.");
        setLoading(false);
      }
    );
  };

  const fetchWeatherData = async (lat, lon) => {
    try {
      const apikey = process.env.NEXT_PUBLIC_API_KEY
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main,
          icon: getWeatherIcon(data.weather[0].main),
        });
      } else {
        throw new Error(data.message || "Failed to fetch weather data");
      }
    } catch (err) {
      console.error("Weather API error:", err);
      setError("Could not fetch weather data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleSaveEntry = () => {
    if (!selectedMood) {
      alert("Please select your mood before saving");
      return;
    }

    const now = new Date();
    const todayEntry = getTodayEntry(entries);
    let updatedEntries = [...entries];

    if (todayEntry) {
      updatedEntries = entries.map((entry) => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (entryDate.getTime() === today.getTime()) {
          return {
            ...entry,
            mood: selectedMood,
            note: dailyNote,
            weather: weather,
            lastUpdated: now.toISOString(),
          };
        }
        return entry;
      });
    } else {
      const newEntry = {
        id: Date.now(),
        date: now.toISOString(),
        mood: selectedMood,
        note: dailyNote,
        weather: weather,
        created: now.toISOString(),
      };

      updatedEntries = [...entries, newEntry];
    }

    setEntries(updatedEntries);
    localStorage.setItem("moodEntries", JSON.stringify(updatedEntries));

    setSaveConfirmation(true);
    setTimeout(() => setSaveConfirmation(false), 3000);
  };

  const generateCalendarView = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const calendarDays = Array(firstDayOfMonth).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      date.setHours(0, 0, 0, 0);

      const entry = entries.find((e) => {
        const entryDate = new Date(e.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      });

      calendarDays.push({
        day,
        entry,
        date,
      });
    }

    return calendarDays;
  };

  const Calendar = () => {
    const calendarDays = generateCalendarView();
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Calendar</h3>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`aspect-square border border-gray-500 flex items-center justify-center relative ${
                day && isToday(day.date) ? "border-blue-500 border-2" : ""
              }`}
            >
              {day && (
                <>
                  <span className="absolute top-1 left-1 text-xs text-gray-500">
                    {day.day}
                  </span>
                  {day.entry && (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-xs">{day.entry.mood.emoji}</span>
                      {day.entry.weather && (
                        <span className="text-xs">
                          {day.entry.weather.icon}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const todayEntry = getTodayEntry(entries);
  const buttonText = todayEntry ? "Update Today's Entry" : "Save Today's Entry";

  return (
    <div className="p-4 bg-gray-50">
      <main className="flex flex-col">
        <Navbar />
        <div className="flex flex-col gap-">
          {saveConfirmation && (
            <div className=" max-w-lg bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 mx-auto">
              <span className="block sm:inline">
                {todayEntry
                  ? "Your entry has been updated!"
                  : "Your entry has been saved!"}
              </span>
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-3 md:gap-10 mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-2 p-4 md:p-6 md:border-r">
                  <MoodSelector
                    onMoodSelect={handleMoodSelect}
                    initialMood={todayEntry?.mood?.id}
                  />

                  <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-2">
                    Daily Notes
                  </h3>
                  <textarea
                    className=" text-sm md:text-base w-full border rounded-md p-2 mb-4 text-gray-700"
                    rows="3"
                    placeholder="Enter your daily notes..."
                    value={dailyNote}
                    onChange={(e) => setDailyNote(e.target.value)}
                  ></textarea>

                  <button
                    onClick={handleSaveEntry}
                    className="w-full bg-orange-400 hover:bg-orange-500 text-sm md:text-base text-white font-medium px-4 md:px-2 py-3 md:py-1 rounded-md transition"
                  >
                    {buttonText}
                  </button>
                </div>

                <div className="p-2 md:p-6 flex flex-col items-center justify-center bg-gray-50">
                  {loading ? (
                    <div className="text-center">
                      <p className="text-gray-600">Loading weather...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center">
                      <p className="text-red-500">{error}</p>
                    </div>
                  ) : weather ? (
                    <div className="text-center">
                      <div className="flex justify-center">
                        <span className="text-2xl md:text-5xl">
                          {weather.icon}
                        </span>
                      </div>
                      <p className="text-2xl md:text-5xl font-bold text-gray-800 mt-2">
                        {weather.temp}°C
                      </p>
                      <p className="text-md md:text-xl text-gray-600">
                        {weather.condition}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-600">No weather data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 h-fit">
              <Calendar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
