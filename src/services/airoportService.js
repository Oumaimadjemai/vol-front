// services/airportService.js
import amadeusInstance from '../api/amadeusInstance';

export const airportService = {
  // Search airports by keyword (e.g., "paris", "CDG")
  searchAirports: async (keyword, limit = 10) => {
    if (!keyword || keyword.length < 2) return [];
    
    try {
      const response = await amadeusInstance.get('/reference-data/locations', {
        params: {
          keyword: keyword,
          subType: 'AIRPORT,CITY',
          'page[limit]': limit
        }
      });
      
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching airports:', error);
      return [];
    }
  },
  
  // Get airport by IATA code (e.g., "CDG")
  getAirportByCode: async (iataCode) => {
    if (!iataCode) return null;
    
    try {
      const response = await amadeusInstance.get('/reference-data/locations', {
        params: {
          keyword: iataCode,
          subType: 'AIRPORT'
        }
      });
      
      const airports = response.data.data || [];
      return airports.find(airport => airport.iataCode === iataCode.toUpperCase()) || null;
    } catch (error) {
      console.error('Error getting airport by code:', error);
      return null;
    }
  },
  
  // Get airport with full details
  getAirportDetails: async (iataCode) => {
    if (!iataCode) return null;
    
    try {
      const response = await amadeusInstance.get(`/reference-data/locations/${iataCode}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error getting airport details:', error);
      return null;
    }
  },
  
  // Get nearby airports
  getNearbyAirports: async (latitude, longitude, radius = 50) => {
    try {
      const response = await amadeusInstance.get('/reference-data/locations/airports', {
        params: {
          latitude: latitude,
          longitude: longitude,
          radius: radius
        }
      });
      
      return response.data.data || [];
    } catch (error) {
      console.error('Error getting nearby airports:', error);
      return [];
    }
  }
};