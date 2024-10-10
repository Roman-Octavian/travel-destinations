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

router.get('/destination/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      res.status(404).json({ success: false, message: 'Destination not found' });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: 'Destination retrieved successfully', data: destination });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.post('/destination', async (req, res) => {
  try {
    const { user_id, location, country, description, date_start, date_end, image } = req.body;

    const destinationData = {
      user_id,
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
    console.error(e);
    res.status(500).json({ success: false, message: 'Unable to save destination' });
  }
});

router.patch('/destination/:id', async (req, res) => {
  try {
    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!updatedDestination) {
      res.status(404).json({ success: false, message: 'Destination not found' });
      return;
    }

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
