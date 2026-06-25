import mongoose from 'mongoose';
import FacilityBooking from '../models/FacilityBooking.js';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_society');
  console.log('Connected to DB');

  const bookings = await FacilityBooking.find({});
  console.log(`Found ${bookings.length} bookings:`);
  for (const b of bookings) {
    console.log(`- Facility: ${b.facilityName}, Date: ${b.bookingDate.toISOString()}, Time: ${b.startTime}-${b.endTime}, Status: ${b.status}`);
  }

  await mongoose.disconnect();
}

run().catch(console.error);
