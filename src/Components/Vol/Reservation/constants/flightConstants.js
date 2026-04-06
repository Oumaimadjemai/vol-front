// constants/flightConstants.js
export const AIRPORTS = {
  // Algerian airports
  'ALG': { name: 'Houari Boumediene Airport', city: 'Alger', country: 'DZ', timezone: 'Africa/Algiers' },
  'ORN': { name: 'Ahmed Ben Bella Airport', city: 'Oran', country: 'DZ', timezone: 'Africa/Algiers' },
  'CZL': { name: 'Mohamed Boudiaf Airport', city: 'Constantine', country: 'DZ', timezone: 'Africa/Algiers' },
  'AAE': { name: 'Rabah Bitat Airport', city: 'Annaba', country: 'DZ', timezone: 'Africa/Algiers' },
  'BLJ': { name: 'Blida Airport', city: 'Blida', country: 'DZ', timezone: 'Africa/Algiers' },
  'QSF': { name: 'Setif Airport', city: 'Sétif', country: 'DZ', timezone: 'Africa/Algiers' },
  'TZM': { name: 'Tizi Ouzou Airport', city: 'Tizi Ouzou', country: 'DZ', timezone: 'Africa/Algiers' },
  'BJA': { name: 'Béjaïa Airport', city: 'Béjaïa', country: 'DZ', timezone: 'Africa/Algiers' },
  'TLM': { name: 'Tlemcen Airport', city: 'Tlemcen', country: 'DZ', timezone: 'Africa/Algiers' },
  'MZW': { name: 'Mostaganem Airport', city: 'Mostaganem', country: 'DZ', timezone: 'Africa/Algiers' },
  'CFK': { name: 'Chlef Airport', city: 'Chlef', country: 'DZ', timezone: 'Africa/Algiers' },
  'BSK': { name: 'Biskra Airport', city: 'Biskra', country: 'DZ', timezone: 'Africa/Algiers' },
  'BFW': { name: 'Sidi Bel Abbès Airport', city: 'Sidi Bel Abbès', country: 'DZ', timezone: 'Africa/Algiers' },
  
  // French airports
  'CDG': { name: 'Charles de Gaulle Airport', city: 'Paris', country: 'FR', timezone: 'Europe/Paris' },
  'ORY': { name: 'Orly Airport', city: 'Paris', country: 'FR', timezone: 'Europe/Paris' },
  'NCE': { name: 'Nice Côte d\'Azur Airport', city: 'Nice', country: 'FR', timezone: 'Europe/Paris' },
  'MRS': { name: 'Marseille Provence Airport', city: 'Marseille', country: 'FR', timezone: 'Europe/Paris' },
  'LYS': { name: 'Lyon-Saint Exupéry Airport', city: 'Lyon', country: 'FR', timezone: 'Europe/Paris' },
  'TLS': { name: 'Toulouse-Blagnac Airport', city: 'Toulouse', country: 'FR', timezone: 'Europe/Paris' },
  'BOD': { name: 'Bordeaux-Mérignac Airport', city: 'Bordeaux', country: 'FR', timezone: 'Europe/Paris' },
  
  // International airports
  'IST': { name: 'Istanbul Airport', city: 'Istanbul', country: 'TR', timezone: 'Europe/Istanbul' },
  'SAW': { name: 'Sabiha Gökçen Airport', city: 'Istanbul', country: 'TR', timezone: 'Europe/Istanbul' },
  'DXB': { name: 'Dubai International Airport', city: 'Dubai', country: 'AE', timezone: 'Asia/Dubai' },
  'LHR': { name: 'Heathrow Airport', city: 'London', country: 'GB', timezone: 'Europe/London' },
  'LGW': { name: 'Gatwick Airport', city: 'London', country: 'GB', timezone: 'Europe/London' },
  'FRA': { name: 'Frankfurt Airport', city: 'Frankfurt', country: 'DE', timezone: 'Europe/Berlin' },
  'MUC': { name: 'Munich Airport', city: 'Munich', country: 'DE', timezone: 'Europe/Berlin' },
  'TXL': { name: 'Berlin Tegel Airport', city: 'Berlin', country: 'DE', timezone: 'Europe/Berlin' },
  'JFK': { name: 'John F. Kennedy Airport', city: 'New York', country: 'US', timezone: 'America/New_York' },
  'LAX': { name: 'Los Angeles Airport', city: 'Los Angeles', country: 'US', timezone: 'America/Los_Angeles' },
  'AMS': { name: 'Schiphol Airport', city: 'Amsterdam', country: 'NL', timezone: 'Europe/Amsterdam' },
  'MAD': { name: 'Adolfo Suárez Madrid-Barajas Airport', city: 'Madrid', country: 'ES', timezone: 'Europe/Madrid' },
  'BCN': { name: 'Barcelona Airport', city: 'Barcelona', country: 'ES', timezone: 'Europe/Madrid' },
  'FCO': { name: 'Leonardo da Vinci Airport', city: 'Rome', country: 'IT', timezone: 'Europe/Rome' },
  'MXP': { name: 'Malpensa Airport', city: 'Milan', country: 'IT', timezone: 'Europe/Rome' },
  'ZRH': { name: 'Zurich Airport', city: 'Zurich', country: 'CH', timezone: 'Europe/Zurich' },
  'VIE': { name: 'Vienna Airport', city: 'Vienna', country: 'AT', timezone: 'Europe/Vienna' },
  'BRU': { name: 'Brussels Airport', city: 'Brussels', country: 'BE', timezone: 'Europe/Brussels' },
  'CPH': { name: 'Copenhagen Airport', city: 'Copenhagen', country: 'DK', timezone: 'Europe/Copenhagen' },
  'OSL': { name: 'Oslo Gardermoen Airport', city: 'Oslo', country: 'NO', timezone: 'Europe/Oslo' },
  'ARN': { name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'SE', timezone: 'Europe/Stockholm' },
  'HEL': { name: 'Helsinki Airport', city: 'Helsinki', country: 'FI', timezone: 'Europe/Helsinki' },
  'DOH': { name: 'Hamad International Airport', city: 'Doha', country: 'QA', timezone: 'Asia/Qatar' },
  'AUH': { name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'AE', timezone: 'Asia/Dubai' },
};

export const getAirportName = (airportCode) => {
  return AIRPORTS[airportCode]?.name || airportCode;
};

export const getCityFromAirport = (airportCode) => {
  return AIRPORTS[airportCode]?.city || airportCode;
};

export const getFullAirportInfo = (airportCode) => {
  return AIRPORTS[airportCode] || { name: airportCode, city: airportCode, country: 'Unknown' };
};

export const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra',
  'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret',
  'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda',
  'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem',
  'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj',
  'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
  'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
  'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal',
  'Béni Abbès', 'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'El M\'Ghair',
  'El Menia'
];

export const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
export const WEEK_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export const PAYMENT_METHODS = [
  { id: 'cib', label: 'Carte CIB / Edahabia', icon: 'FaCreditCard', description: 'Paiement sécurisé par carte bancaire' },
  { id: 'delivery', label: 'Paiement à la livraison', icon: 'FaMoneyBill', description: 'Payez lors de la réception des billets' },
  { id: 'gifty', label: 'Carte Cadeau Gifty', icon: 'FaGift', description: 'Utilisez votre carte cadeau' }
];