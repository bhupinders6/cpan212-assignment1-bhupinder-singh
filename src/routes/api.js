import {Router} from 'express';
import weatherRouter from './weather.js';

const router = Router();
router.use('/weather', weatherRouter);

export default router;