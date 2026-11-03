import { Router } from 'express';
import { getCacheStats } from '../lib/weather.js';


export const cacheRouter = Router();

// TODO (you): respond with { data: <the cache statistics> }.
cacheRouter.get('/cache/stats', (req, res) => {
  const stats = getCacheStats();
  res.status(200).json({ data: stats });
});
