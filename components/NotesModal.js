export function NotesModal({ entries, setOpen }) {
  return (
    <div className="fixed inset-0 z-10 h-screen w-full bg-gray-500/70">
      <div className=" bg-white w-9/12 md:w-7/12 max-h-4/6 overflow-y-scroll mx-auto mt-10 p-2 sm:p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h1>All Notes</h1>
          <button
            className="flex items-center justify-center text-lg px-2 py-1 hover:bg-gray-200 rounded-full transition delay-150"
            onClick={() => {
              setOpen(false);
            }}
          >
            X
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2 sm:p-4">
          {entries.map((entry) => (
            <div key={entry.id} className="flex flex-col justify-between bg-white p-2 md:p-4 rounded-lg shadow-md">
              <div className="flex mb-3">
                <span className="text-2xl sm:text-3xl">{entry.mood.emoji}</span>
                <div className="text-xs sm:text-sm text-gray-700 mt-1">{entry.note}</div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="text-xs sm:text-sm">
                  {new Date(entry.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center text-xs sm:text-sm">
                  <span>{entry.weather.icon}</span>
                  <span>{entry.weather.temp}°C</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
