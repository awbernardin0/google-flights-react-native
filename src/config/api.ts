// API Configuration
// Replace this with your actual RapidAPI key from https://rapidapi.com/apiheya/api/sky-scrapper
export const API_CONFIG = {
  RAPIDAPI_KEY: '35aa4b1ecdmsh34bc51243063d73p105bdajsndb4a6f4b9f94', // Your RapidAPI key
  RAPIDAPI_HOST: 'sky-scrapper.p.rapidapi.com',
  BASE_URL: 'https://sky-scrapper.p.rapidapi.com',
};

// Instructions for getting your API key:
// 1. Go to https://rapidapi.com/apiheya/api/sky-scrapper
// 2. Sign up or log in to RapidAPI
// 3. Subscribe to the Sky Scrapper API (they have a free tier)
// 4. Copy your API key from the RapidAPI dashboard
// 5. Replace 'YOUR_RAPIDAPI_KEY' above with your actual key
// 6. Restart the app

export const isApiConfigured = (): boolean => {
  return API_CONFIG.RAPIDAPI_KEY !== 'YOUR_RAPIDAPI_KEY' && API_CONFIG.RAPIDAPI_KEY.length > 0;
}; 