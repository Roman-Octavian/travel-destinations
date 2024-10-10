import { Router } from 'express';
import { Destination, User } from '../database';
import { authenticator } from '../utils/auth';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    res.status(200).json(await Destination.find());
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', authenticator, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      res.status(404).json({ success: false, message: 'Destination not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Destination retrieved successfully',
      data: destination,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.post('/', authenticator, async (req, res) => {
  try {
    const { location, country, description, date_start, date_end, image } = req.body;

    const username = res.locals.userInfo?.username;
    if (!username) {
      res.status(401).json({ success: false, message: 'Unauthorized: Missing user information' });
    }

    const user = await User.findOne({ username }).select('_id');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
    }

    const destinationData = {
      user_id: user._id,
      location,
      country,
      description,
      date_start: new Date(date_start),
      date_end: new Date(date_end),
      image,
    };

    const destination = new Destination(destinationData);
    await destination.save();

    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      data: destination,
    });
  } catch (e) {
    console.error('Error while saving destination:', e);
    res.status(500).json({ success: false, message: 'Unable to save destination' });
  }
});

router.patch('/:id', authenticator, async (req, res) => {
  try {
    const username = res.locals.userInfo?.username;
    if (!username) {
      res.status(401).json({ success: false, message: 'Unauthorized: Missing user information' });
    }

    const user = await User.findOne({ username }).select('_id');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
    }

    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      res.status(404).json({ success: false, message: 'Destination not found' });
    }

    if (destination.user_id.toString() !== user._id.toString()) {
      res.status(403).json({ success: false, message: 'Forbidden: Not your destination' });
    }

    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: 'Destination updated successfully',
      data: updatedDestination,
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, message: 'Unable to update destination', error: e.message });
  }
});

export default router;
