import { Router } from 'express';
import { Destination } from '../database';
import { authenticator } from '../utils/auth.js';

const router = Router();

// Route to get all destinations (no authentication required)
router.get('/', async (_req, res) => {
  try {
    const allDestinations = await Destination.find();
    res.status(200).json(allDestinations);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to get destinations of the logged-in user (authentication required)
router.get('/user', authenticator, async (req, res) => {
  try {
    const userId = res.locals.userInfo.id;

    // Query destinations that belong to the logged-in user
    const userDestinations = await Destination.find({ userId });

    res.status(200).json(userDestinations);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// delete a destination if the user is authenticated
router.delete('/:id', authenticator, async (req, res) => {
  try {
    const destinationId = req.params.id;
    console.log('Destination ID:', destinationId);
    const userId = res.locals.userInfo.id;
    console.log('User ID:', userId);

    // Query the destination by ID and userId
    const destination = await Destination.findOne({ _id: destinationId, userId });

    if (!destination) {
      res.status(404).json({ message: 'Destination not found' });
      return;
    }

    await Destination.deleteOne({ _id: destinationId });
    res.status(200).json({ message: 'Destination deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
export default router;
