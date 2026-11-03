import { HttpError } from '../lib/http-error.js';

// TODO (you): check ?city= and return the trimmed city name. Throw a 400
// HttpError with details.city when it breaks a rule from the assignment page.

function badCity(message) {
  return new HttpError(400, 'Invalid city', { city: message });
}
function badCities(message) {
  return new HttpError(400, 'Invalid query', { cities: message });
}

export function parseCity(value) {
  if (Array.isArray(value)) {
    throw badCity('city must be sent only once');
  }
  if(typeof value !== 'string' || value.trim() === '') {
    throw badCity('city is required');
  }

  const city=value.trim();
  if(city.length<2 || city.length>60) {
    throw badCity('city must be between 2 and 60 characters');
  }
  return city;
}

// TODO (you): check ?cities= and return an array of trimmed city names. Throw a
// 400 HttpError with details.cities when it breaks a rule from the assignment page.
export function parseCities(value) {
  if (Array.isArray(value)) {
    throw badCities('cities must be sent only once');
  }
  if(typeof value !== 'string' || value.trim() === '') {
    throw badCities('cities is required');
  }
  const parts=value.split(',');
  const cities=[];

  for (let i-=0; i<parts.length; i++) {
    const city=parts[i].trim();

    if(city === '') {
      throw badCities('cities must not contain empty names');
    }
    if(city.length<2 || city.length>60) {
      throw badCities('cities must be between 2 and 60 characters');
    }
    cities.push(city);
  }
  if(cities.length>5||cities.length<2) {
    throw badCities('cities must contain between 2 and 5 cities');
  }

  const seen= [];
  for(let i=0; i<cities.length; i++) {
    const lower=cities[i].toLowerCase();
    if(seen.includes(lower)) {
      throw badCities('cities must not contain duplicates');
    }
    seen.push(lower);
  }
  
  return cities;
}
