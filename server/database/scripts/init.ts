import { connection as mongo } from '../connection';
import { User, Destination, type DestinationType } from '../schema';

await User.deleteMany({});
await Destination.deleteMany({});

const now = new Date();
const nextMonth = new Date();
nextMonth.setMonth(now.getMonth() + 1);

const DESTINATIONS: DestinationType[] = [
  {
    location: '1111 Avenue',
    country: 'Barbados',
    date_start: now,
    date_end: nextMonth,
    image: '',
    description: 'The 1111th Avenue',
    user_id: 'admin',
  },
  {
    location: 'Copenhagen, Hovedstaden',
    country: 'Denmark',
    date_start: now,
    date_end: nextMonth,
    image: '',
    description: 'The capital city of Denmark',
    user_id: 'admin',
  },
  {
    location: 'Poppy Flower Field',
    country: 'Afghanistan',
    date_start: now,
    date_end: nextMonth,
    image: '',
    description: 'From where three-letter agencies source raw material for the opioid crisis',
    user_id: 'admin',
  },
];

await new User({ name: 'admin', username: 'admin', password: 'admin' }).save();
await Destination.insertMany(DESTINATIONS);

await mongo.connection.close();
