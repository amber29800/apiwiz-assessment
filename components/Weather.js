export const Weather = ({loading, error, weather}) => {
  return (
    <div className="flex items-center justify-center bg-gray-50 p-2">
      {loading ? (
        <div className="text-center">
          <p className="text-gray-600">Loading weather...</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : weather ? (
        <div className="flex items-center justify-center gap-1">
          <div className="flex justify-center">
            <span className="text-lg md:text-2xl">{weather.icon}</span>
          </div>
          <p className="text-lg md:text-2xl font-bold text-gray-800">
            {weather.temp}°C
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600">No weather data available</p>
        </div>
      )}
    </div>
  );
};
