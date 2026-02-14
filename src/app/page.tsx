"use client";

import { useState } from "react";

export default function WeatherApp() {

  // variables, and functions for setting those variables
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // this function gets the weather info based on the user-inputted city
  async function fetchWeather() {
    
    if (!city || loading) return;

    // user won't be able to press the "go" button or spam enter when loading is true
    setLoading(true);

    try {

      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json();

      if (response.ok) {

        setWeather(data);

      } else {

        alert(data.error || "Something went wrong");

      }

    } catch (err: any) {

      console.error("An error occured:", err);

    } finally {

      setLoading(false);

    }

  };

  return (

    <main className="min-h-[100dvh] bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl">
        
        <h1 className="text-3xl font-bold mb-6 text-center tracking-tight text-gray-800">
          Weather App
        </h1>

        <div className="flex flex-col sm:flex-row gap-2 mb-8">

          {/* the search Bar */}
          <input 
            type="text" 
            placeholder="Search city..." 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
            className="flex-1 min-w-0 bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
          />

          {/* button for initiating fetchWeather */}
          <button 
            onClick={fetchWeather}
            disabled={loading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-95 px-6 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
          >
            {loading ? "..." : "Go"}
          </button>

        </div>

        {/* weather card, only loads when weather data is present */}
        {weather && 
          (<div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">

            <h2 className="text-xl text-gray-500 mb-1">{weather.name}, {weather.sys.country}</h2>

            <div className="text-6xl sm:text-7xl font-black mb-2 text-gray-800">
              {weather.main.temp}°
            </div>

            <p className="text-lg capitalize text-blue-600 font-medium mb-6">
              {weather.weather[0].description}
            </p>
            
            {/* extra details: humidity and wind speed */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Humidity</p>
                <p className="font-bold text-gray-700">{weather.main.humidity}%</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Wind</p>
                <p className="font-bold text-gray-700">{weather.wind.speed} m/s</p>
              </div>
            </div>
          </div>)
        }

      </div>
    </main>

  );

}
