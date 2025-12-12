// server/seeder.js
require('dotenv').config();
const connectDB = require('./server/config/db');
const Item = require('./server/models/Item');

const sample = [
  {
    status: 'lost',
    type: 'student-id',
    name: 'Student ID Card',
    location: 'Library, 3rd floor',
    date: '2025-07-14',
    description: 'Lost my student ID card. Name: John Mwangi, ID: 2025-7890.',
    contactName: 'John Mwangi',
    contactEmail: 'john.mwangi@students.bright.edu',
    contactPhone: '+254707123456'
  },
  {
    status: 'found',
    type: 'student-id',
    name: 'Student ID Card',
    location: 'Library, 3rd floor study area',
    date: '2025-07-15',
    description: 'Found a student ID card near the computer terminals. Name: John Mwangi, ID: 2025-7890.',
    contactName: 'Library Staff',
    contactEmail: 'library@bright.edu',
    contactPhone: '+254707141003'
  },
  // add more sample entries as you want...
];

const run = async () => {
  await connectDB();
  await Item.deleteMany({});
  await Item.insertMany(sample);
  console.log('Seeder finished');
  process.exit();
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
