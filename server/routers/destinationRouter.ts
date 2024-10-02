import { Router } from 'express';
import { Destination } from '../database';

const router = Router();

router.get('/destination', async (_req, res) => {
  try {
    res.status(200).json(await Destination.find());
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
