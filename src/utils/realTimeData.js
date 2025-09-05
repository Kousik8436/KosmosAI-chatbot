export const getCurrentTime = () => {
  return new Date().toLocaleString();
};

export const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getWeather = async (city = 'London') => {
  return {
    city: city,
    temperature: Math.floor(Math.random() * 30) + 5,
    description: 'Partly cloudy',
    humidity: Math.floor(Math.random() * 50) + 30,
    windSpeed: Math.floor(Math.random() * 20) + 5
  };
};

export const getNews = async () => {
  const mockNews = [
    "Tech giants announce new AI breakthrough in quantum computing",
    "Global climate summit reaches historic agreement on carbon emissions",
    "New space mission successfully launches to Mars"
  ];
  return mockNews;
};

export const getCryptoPrice = async (crypto = 'bitcoin') => {
  const mockPrices = {
    bitcoin: { price: 45000 + Math.floor(Math.random() * 10000), change: (Math.random() * 10 - 5).toFixed(2) },
    ethereum: { price: 3000 + Math.floor(Math.random() * 1000), change: (Math.random() * 10 - 5).toFixed(2) }
  };
  return mockPrices[crypto] || mockPrices.bitcoin;
};