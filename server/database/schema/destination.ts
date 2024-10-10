import mongoose from 'mongoose';
import { Country } from '@packages/types/country';

export type DestinationType = {
  location: string;
  country: Country;
  date_start: Date;
  date_end: Date;
  image: string;
  description: string;
  user_id: string;
};

const destinationSchema = new mongoose.Schema<DestinationType>({
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  date_start: {
    type: Date,
    required: true,
  },
  date_end: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  user_id: {
    type: String,
    required: true,
  },
});

export const Destination = mongoose.model<DestinationType>('Destination', destinationSchema);
