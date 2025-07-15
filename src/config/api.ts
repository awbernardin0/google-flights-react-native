// API Configuration
// Replace this with your actual RapidAPI key from https://rapidapi.com/apiheya/api/sky-scrapper
export const API_CONFIG = {
  RAPIDAPI_KEY: '4ad27f0682mshf2fd0a2edf520dfp140a90jsn7fca30e77a80', // Your RapidAPI key
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