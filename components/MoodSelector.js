import { useState, useEffect } from 'react';

const MoodSelector = ({ onMoodSelect, initialMood }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  
  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy', color: 'bg-yellow-300' },
    { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-gray-200' },
    { id: 'sad', emoji: '🙁', label: 'Sad', color: 'bg-blue-200' },
    { id: 'very-sad', emoji: '😢', label: 'Very Sad', color: 'bg-blue-300' },
    { id: 'angry', emoji: '😠', label: 'Angry', color: 'bg-red-300' }
  ];

  useEffect(() => {
    if (initialMood) {
      setSelectedMood(initialMood);
      const mood = moods.find(m => m.id === initialMood);
      if (mood) {
        onMoodSelect(mood);
      }
    }
  }, [initialMood]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood.id);
    onMoodSelect(mood);
  };

  return (
    <div className="mb-4 md:mb-6">
      <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-2 md:mb-4 ">How are you feeling today?</h3>
      
      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
        {moods.map((mood) => (
          <button 
            key={mood.id}
            onClick={() => handleMoodSelect(mood)}
            className={`w-12 md:w-16 h-12 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 transform ${
              selectedMood === mood.id 
                ? `${mood.color} scale-110 shadow-md` 
                : 'bg-gray-100 hover:scale-105'
            }`}
            aria-label={`Select ${mood.label} mood`}
          >
            <span className="text-md md:text-3xl">{mood.emoji}</span>
          </button>
        ))}
      </div>
      
      {selectedMood && (
        <p className="text-sm md:text-base mt-2 md:mt-3 text-gray-600">
          You selected: {moods.find(m => m.id === selectedMood)?.label}
        </p>
      )}
    </div>
  );
};

export default MoodSelector;