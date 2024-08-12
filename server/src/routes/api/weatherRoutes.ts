import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const cityName = req.body.cityName;
  if (!cityName) {
    return res.status(400).send({ error: 'City name is required' });
  }

  try {
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    await HistoryService.addCity(cityName);
    console.log(weatherData);
    return res.send(weatherData);
  } catch (error) {
    return res.status(500).send({ error: 'Failed to retrieve weather data' });
  }
});

// GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    console.log(history)
    return res.send(history);
  } catch (error) {
    return res.status(500).send({ error: 'Failed to retrieve search history' });
  }
});

// DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send({ error: 'City ID is required' });
  }

  try {
    await HistoryService.removeCity(id);
    return res.send({ message: 'City removed from search history' });
  } catch (error) {
    return res.status(500).send({ error: 'Failed to remove city from search history' });
  }
});

export default router;
