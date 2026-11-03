import { Router } from 'express';
import { parseCity, parseCities } from '../validators/weather-query.js';
import { getCityWeather } from '../lib/weather.js';
import { HttpError } from '../lib/http-error.js';

export const weatherRouter = Router();

const ATTRIBUTION = 'weather data from Open-Meteo.com, geocoding from Open-Meteo.com Geocoding API';

// TODO (you): GET /api/weather?city=Toronto
// Validate with parseCity, get the summary with getCityWeather, and respond
// with { data, attribution }. Routes never call fetch themselves.
weatherRouter.get('/weather', async (req, res) => {
  
  const city= parseCity(req.query.city);
  const data=await getCityWeather(city);
  res.status(200).json({ data, attribution: ATTRIBUTION });
});

// TODO (you): GET /api/compare?cities=Toronto,Vancouver,Halifax
// Validate with parseCities, start every lookup at once with Promise.allSettled,
// then build the cities array and the summary described on the assignment page.
weatherRouter.get('/compare', async (req, res) => {
  const names= parseCities(req.query.cities);
  const promises = [];
  for (let i=0; i<names.length; i++) {
    promises.push(getCityWeather(names[i]));
  }
  const results= await Promise.allSettled(promises);
  const cities=[];
  let succeeded=0;
  let failed=0;
  let warmest=null;
  let coldest=null;

  for (let i=0; i<results.length; i++) {
    const result= results[i];
    if (result.status==='fulfilled') {
      succeeded++;
      cities.push({city:names[i], ok:true, weather:result.value});

      const temp= result.value.current.temperatureC;
      if (warmest === null || temp > warmest.temperatureC) {
        warmest = { city: names[i], temperatureC: temp };
      }
      if (coldest === null || temp < coldest.temperatureC) {
        coldest = { city: names[i], temperatureC: temp };
      }
    } else {
      failed++;
      const err= result.reason;

      if (err instanceof HttpError) {
        cities.push({
          city:names[i], 
          ok:false, 
          error:{status:err.status, message:err.message}
          });
  } else {
    console.error(err);
    cities.push({
      city:names[i], 
      ok:false,
      error:{status:500, message:'Internal server error'}
    });
   }
  }
  }
  res.status(200).json({ 
    data:  {
      cities, 
      summary:{succeeded, failed, warmest, coldest },
    },
    attribution: ATTRIBUTION  
  }); 
 });

