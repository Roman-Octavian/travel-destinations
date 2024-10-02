import { Router } from 'express';
import { User } from '../database';

const router = Router();

router.get('/user', async (_req, res) => {
  try {
    res.status(200).json(await User.find());
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
