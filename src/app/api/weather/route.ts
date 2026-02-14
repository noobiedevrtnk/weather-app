import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // setting up api key and the search parameters to get the user-inputted city
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  // check for missing API key
  if (!apiKey) {
    return NextResponse.json({ error: "Server Configuration Error: API Key missing" }, { status: 500 });
  }

  // check for empty city
  if (!city) {
    return NextResponse.json({ error: "No city provided" }, { status: 400 });
  }

  try {

    // get lat and lon
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
    );
    const geoData = await geoResponse.json();

    // check geoData to see if user-inputted city yield any results
    if (!geoData || geoData.length === 0) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }
    const { lat, lon } = geoData[0];

    // fetch weather data with the lat and lon received
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    // check response status before sending the data off
    if (!weatherResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch weather from OpenWeather" }, { status: weatherResponse.status });
    }
    const weatherData = await weatherResponse.json();
    return NextResponse.json(weatherData);

  } catch (err) {

    console.error("Route Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    
  }
}