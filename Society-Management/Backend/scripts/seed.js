import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

import User from '../models/User.js';
import ResidentProfile from '../models/ResidentProfile.js';
import Visitor from '../models/Visitor.js';
import Complaint from '../models/Complaint.js';
import MaintenanceBill from '../models/MaintenanceBill.js';
import FacilityBooking from '../models/FacilityBooking.js';
import Notice from '../models/Notice.js';
import Poll from '../models/Poll.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_society';

const FIRST_NAMES = [
  'Aarav', 'Vihaan', 'Vivaan', 'Ananya', 'Diya', 'Ishaan', 'Kabir', 'Aditya', 'Sai', 'Reyansh',
  'Krishna', 'Arjun', 'Arnav', 'Rohan', 'Neha', 'Pooja', 'Riya', 'Aditi', 'Siddharth', 'Vikram',
  'Amit', 'Rahul', 'Suresh', 'Ramesh', 'Rajesh', 'Priya', 'Sunita', 'Geeta', 'Anjali', 'Sanjay',
  'Vijay', 'Deepak', 'Pranav', 'Yash', 'Kunal', 'Karan', 'Meera', 'Radhika', 'Sneha', 'Swati',
  'Kiran', 'Harish', 'Naresh', 'Rakesh', 'Mukesh', 'Anil', 'Sunil', 'Vinod', 'Dinesh', 'Manish'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Mehta', 'Patel', 'Reddy', 'Joshi', 'Iyer', 'Nair', 'Singh',
  'Kumar', 'Rao', 'Choudhury', 'Banerjee', 'Chatterjee', 'Sen', 'Ghosh', 'Das', 'Mishra', 'Trivedi',
  'Bhatt', 'Desai', 'Kulkarni', 'Deshmukh', 'Patil', 'Pillai', 'Shetty', 'Menon', 'Kapoor', 'Khanna'
];

const BLOCKS = ['Block A', 'Block B', 'Block C', 'Block D'];
const FLAT_NUMBERS = ['101', '102', '103', '104', '201', '202', '203', '204', '301', '302', '303', '304', '401', '402', '403', '404', '501', '502', '503', '504'];
const VEHICLE_NAMES = ['Honda City', 'Maruti Swift', 'Hyundai i20', 'Tata Nexon', 'Activa 6G', 'Bajaj Pulsar', 'Royal Enfield', 'Ather 450X'];
const RELATIONS = ['Spouse', 'Child', 'Parent', 'Sibling'];
const VISITOR_PURPOSES = ['Courier Delivery', 'Plumbing Audit', 'Friend Visit', 'Maid Service', 'Electrician repair', 'Family guest', 'Driver service'];

const COMPLAINT_TITLES = {
  Plumbing: ['Water seepage in toilet ceiling', 'Kitchen washbasin sink blockage', 'Main supply valve pipeline leakage', 'Flush tank not working'],
  Electrical: ['Corridor common tubelight blinking', 'Power trip breaker switch box issue', 'Lobby security doorbell not working', 'Elevator fan faulty'],
  Security: ['Intercom line noisy', 'CCTV camera blind spot in parking', 'Gate barcode scanner unresponsive'],
  Cleaning: ['Garbage collection dump overflowing', 'Lobby corridor stairs dirty', 'Clubhouse garden litter'],
  'Lift Maintenance': ['Gym machine cable broken', 'Elevator cabin indicator display error', 'Swimming pool filtration issue'],
  Other: ['Parking slot line painting faded', 'Stray cats roaming near Block B']
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (startDaysAgo, endDaysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - getRandomNum(endDaysAgo, startDaysAgo));
  return date;
};

const clearData = async () => {
  console.log('Clearing existing society data...');
  await User.deleteMany({});
  await ResidentProfile.deleteMany({});
  await Visitor.deleteMany({});
  await Complaint.deleteMany({});
  await MaintenanceBill.deleteMany({});
  await FacilityBooking.deleteMany({});
  await Notice.deleteMany({});
  await Poll.deleteMany({});
  await Notification.deleteMany({});
  await AuditLog.deleteMany({});
  console.log('Database cleared.');
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected to database at ${MONGODB_URI}`);

    if (process.argv.includes('--clear')) {
      await clearData();
      mongoose.connection.close();
      return;
    }

    await clearData();

    console.log('Seeding demo credentials...');

    const demoAdmin = await User.create({
      name: 'Aditya Sharma',
      email: 'admin@society.com',
      password: 'Password@123',
      phone: '+919999988888',
      role: 'Admin',
      status: 'Approved',
      isVerified: true
    });

    const demoResident = await User.create({
      name: 'Rohan Verma',
      email: 'resident@society.com',
      password: 'Password@123',
      phone: '+919999977777',
      role: 'Resident',
      status: 'Approved',
      isVerified: true
    });

    const demoSecurity = await User.create({
      name: 'Sanjay Kumar',
      email: 'security@society.com',
      password: 'Password@123',
      phone: '+919999966666',
      role: 'Security Staff',
      status: 'Approved',
      isVerified: true
    });

    const demoMaintenance = await User.create({
      name: 'Vijay Singh',
      email: 'maintenance@society.com',
      password: 'Password@123',
      phone: '+919999955555',
      role: 'Maintenance Staff',
      status: 'Approved',
      isVerified: true
    });

    await ResidentProfile.create({
      user: demoResident._id,
      flatNumber: '102',
      block: 'Block A',
      occupancyType: 'Owner',
      familyMembers: [
        { name: 'Neha Verma', phone: '+919876543210', relation: 'Spouse' },
        { name: 'Kavya Verma', phone: '+919876543211', relation: 'Child' }
      ],
      vehicles: [
        { vehicleType: 'Car', vehicleName: 'Honda City', licensePlate: 'MH-12-AB-1234' }
      ]
    });

    console.log('Generating 50 Residents profiles...');
    const residentUsers = [demoResident];
    const flatAssignments = new Set();
    flatAssignments.add('Block A-102');

    for (let i = 0; i < 49; i++) {
      const firstName = getRandom(FIRST_NAMES);
      const lastName = getRandom(LAST_NAMES);
      const name = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@society.com`;
      const phone = `+919${getRandomNum(100000000, 999999999)}`;

      let block = getRandom(BLOCKS);
      let flatNumber = getRandom(FLAT_NUMBERS);
      let flatKey = `${block}-${flatNumber}`;
      while (flatAssignments.has(flatKey)) {
        block = getRandom(BLOCKS);
        flatNumber = getRandom(FLAT_NUMBERS);
        flatKey = `${block}-${flatNumber}`;
      }
      flatAssignments.add(flatKey);

      const user = await User.create({
        name,
        email,
        password: 'Password@123',
        phone,
        role: 'Resident',
        status: 'Approved',
        isVerified: true
      });
      residentUsers.push(user);

      const familyMembers = [];
      const numFamily = getRandomNum(0, 3);
      for (let f = 0; f < numFamily; f++) {
        familyMembers.push({
          name: `${getRandom(FIRST_NAMES)} ${lastName}`,
          phone: `+919${getRandomNum(100000000, 999999999)}`,
          relation: getRandom(RELATIONS)
        });
      }

      const vehicles = [];
      const numVehicles = getRandomNum(0, 2);
      for (let v = 0; v < numVehicles; v++) {
        vehicles.push({
          vehicleType: getRandom(['Car', 'Bike', 'EV', 'Other']),
          vehicleName: getRandom(VEHICLE_NAMES),
          licensePlate: `MH-${getRandomNum(10, 99)}-${String.fromCharCode(65 + getRandomNum(0, 25))}${String.fromCharCode(65 + getRandomNum(0, 25))}-${getRandomNum(1000, 9999)}`
        });
      }

      await ResidentProfile.create({
        user: user._id,
        flatNumber,
        block,
        occupancyType: getRandom(['Owner', 'Tenant']),
        familyMembers,
        vehicles
      });
    }

    const maintenanceStaffList = [demoMaintenance];
    for (let i = 0; i < 3; i++) {
      const name = `${getRandom(FIRST_NAMES)} ${getRandom(LAST_NAMES)}`;
      const email = `staff${i}@society.com`;
      const staff = await User.create({
        name,
        email,
        password: 'Password@123',
        phone: `+9198888${i}7777`,
        role: 'Maintenance Staff',
        status: 'Approved',
        isVerified: true
      });
      maintenanceStaffList.push(staff);
    }

    console.log('Generating 200 Gate Visitors log entries...');
    const visitorTypes = ['Guest', 'Delivery', 'Maid', 'Driver', 'Vendor', 'Other'];
    const visitorStatuses = ['Checked Out', 'Checked Out', 'Checked Out', 'Checked In', 'Approved', 'Pending', 'Rejected'];

    for (let i = 0; i < 200; i++) {
      const vFirstName = getRandom(FIRST_NAMES);
      const vLastName = getRandom(LAST_NAMES);
      const hostUser = getRandom(residentUsers);
      const profile = await ResidentProfile.findOne({ user: hostUser._id });

      const status = getRandom(visitorStatuses);
      const createdAt = getRandomDate(1, 30);
      let checkIn = null;
      let checkOut = null;

      if (status === 'Checked In' || status === 'Checked Out') {
        checkIn = new Date(createdAt);
        checkIn.setHours(checkIn.getHours() + getRandomNum(1, 4));
      }
      if (status === 'Checked Out') {
        checkOut = new Date(checkIn);
        checkOut.setMinutes(checkOut.getMinutes() + getRandomNum(15, 180));
      }

      const type = getRandom(visitorTypes);
      const uniqueVisitorId = `VST-${new Date(createdAt).getFullYear()}${String(new Date(createdAt).getMonth() + 1).padStart(2, '0')}-${String(1000 + i).slice(-4)}`;

      await Visitor.create({
        name: `${vFirstName} ${vLastName}`,
        phone: `+919${getRandomNum(100000000, 999999999)}`,
        visitorType: type,
        flatNumber: profile?.flatNumber || '101',
        block: profile?.block || 'Block A',
        hostResident: hostUser._id,
        purpose: getRandom(VISITOR_PURPOSES),
        status,
        uniqueVisitorId,
        checkIn,
        checkOut,
        recordedBy: demoSecurity._id,
        createdAt
      });
    }

    console.log('Generating 100 Maintenance complaints tickets...');
    const categories = ['Plumbing', 'Electrical', 'Security', 'Cleaning', 'Lift Maintenance', 'Other'];
    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    const complaintStatuses = ['Closed', 'Resolved', 'In Progress', 'Assigned', 'Open'];

    for (let i = 0; i < 100; i++) {
      const category = getRandom(categories);
      const title = getRandom(COMPLAINT_TITLES[category]);
      const raisedBy = getRandom(residentUsers);
      const priority = getRandom(priorities);
      const status = getRandom(complaintStatuses);
      const createdAt = getRandomDate(1, 60);

      const complaintData = {
        title,
        description: `This is a demo issue log report representing a utility ${category.toLowerCase()} complaint.`,
        category,
        raisedBy: raisedBy._id,
        priority,
        status,
        comments: [],
        createdAt
      };

      if (status !== 'Open') {
        const staff = getRandom(maintenanceStaffList);
        complaintData.assignedTo = staff._id;
        complaintData.sla = {
          assignedAt: new Date(createdAt)
        };
      }

      if (status === 'Resolved' || status === 'Closed') {
        const resolvedAt = new Date(createdAt);
        resolvedAt.setDate(resolvedAt.getDate() + getRandomNum(1, 4));
        complaintData.sla.resolvedAt = resolvedAt;
        complaintData.sla.resolutionDuration = getRandomNum(120, 2800);
        complaintData.completionNotes = 'Work has been audited and completed successfully.';
      }

      if (getRandomNum(0, 1) === 1) {
        complaintData.comments.push({
          author: raisedBy._id,
          text: 'Please look into this as soon as possible.',
          createdAt: new Date(createdAt)
        });
      }

      await Complaint.create(complaintData);
    }

    console.log('Generating 50 Resident Maintenance bills & invoices...');
    const billStatuses = ['Paid', 'Paid', 'Paid', 'Pending', 'Overdue'];
    const billMonths = [
      { month: 1, year: 2026 },
      { month: 2, year: 2026 },
      { month: 3, year: 2026 },
      { month: 4, year: 2026 },
      { month: 5, year: 2026 },
      { month: 6, year: 2026 }
    ];

    for (let i = 0; i < 50; i++) {
      const resident = getRandom(residentUsers);
      const period = getRandom(billMonths);
      const status = getRandom(billStatuses);

      const duplicate = await MaintenanceBill.findOne({
        resident: resident._id,
        month: period.month,
        year: period.year
      });
      if (duplicate) continue;

      const maintenanceCharges = 120;
      const waterCharges = 20;
      const parkingCharges = 15;
      const electricityCommonCharges = 25;
      const penalties = status === 'Overdue' ? 50 : 0;
      const amount = maintenanceCharges + waterCharges + parkingCharges + electricityCommonCharges + penalties;

      const datePart = `${period.year}${period.month.toString().padStart(2, '0')}`;
      const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const invoiceNumber = `INV-${datePart}-${randPart}`;

      const dueDate = new Date(period.year, period.month - 1, 28);

      const billData = {
        resident: resident._id,
        invoiceNumber,
        month: period.month,
        year: period.year,
        maintenanceCharges,
        waterCharges,
        parkingCharges,
        electricityCommonCharges,
        penalties,
        otherCharges: 0,
        amount,
        dueDate,
        status,
        createdBy: demoAdmin._id
      };

      if (status === 'Paid') {
        billData.paidAmount = amount;
        billData.paymentDetails = {
          transactionId: `TXN-${getRandomNum(100000, 999999)}`,
          paymentMethod: getRandom(['Card', 'UPI', 'Net Banking', 'Cash']),
          paidAt: new Date(dueDate)
        };
      }

      await MaintenanceBill.create(billData);
    }

    console.log('Generating 30 Amenity bookings...');
    const facilities = ['Club House', 'Gym', 'Community Hall', 'Swimming Pool', 'Sports Court', 'Garden Area'];
    const bookingStatuses = ['Approved', 'Approved', 'Pending', 'Cancelled'];

    for (let i = 0; i < 30; i++) {
      const facilityName = getRandom(facilities);
      const bookedBy = getRandom(residentUsers);
      const bookingDate = getRandomDate(-10, 15); 
      const status = getRandom(bookingStatuses);

      await FacilityBooking.create({
        facilityName,
        bookedBy: bookedBy._id,
        bookingDate,
        startTime: '10:00',
        endTime: '12:00',
        status
      });
    }

    console.log('Generating 20 Notices bulletin notices...');
    const noticeCategories = ['General', 'Maintenance', 'Event', 'Meeting', 'Emergency'];
    const noticeTitles = {
      General: 'Renovation guidelines and rules',
      Maintenance: 'Elevator audit and inspection scheduled',
      Event: 'Monsoon tree plantation drive next Sunday',
      Meeting: 'Monthly general assembly meeting scheduled',
      Emergency: 'Scheduled power shutdown for transformer repair'
    };

    for (let i = 0; i < 20; i++) {
      const category = getRandom(noticeCategories);
      const title = noticeTitles[category];
      const createdAt = getRandomDate(1, 15);

      await Notice.create({
        title: `${title} - #${i}`,
        content: `This is a generated notice announcement for the society community regarding ${category.toLowerCase()} parameters.`,
        category,
        targetRoles: ['Resident', 'Security Staff', 'Maintenance Staff'],
        status: 'Published',
        createdBy: demoAdmin._id,
        createdAt
      });
    }

    console.log('Generating 10 community Polls...');
    const pollQuestions = [
      'Should we install EV charging stations in parking lot?',
      'Do you support painting Block lobby corridors blue?',
      'Choose next festival cultural event date',
      'Should we increase visitor check-in logging security hours?',
      'Agreement on installing new gym treadmills budget'
    ];

    for (let i = 0; i < 10; i++) {
      const question = getRandom(pollQuestions);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + getRandomNum(1, 10));

      const poll = await Poll.create({
        question: `${question} (Poll #${i})`,
        options: [
          { optionText: 'Agree / Yes', votes: [] },
          { optionText: 'Disagree / No', votes: [] },
          { optionText: 'Neutral / Need Info', votes: [] }
        ],
        expiresAt,
        createdBy: demoAdmin._id
      });

      const votersCount = getRandomNum(5, 25);
      const voterSelection = new Set();
      for (let v = 0; v < votersCount; v++) {
        const voter = getRandom(residentUsers);
        if (!voterSelection.has(voter._id.toString())) {
          voterSelection.add(voter._id.toString());
          const randomOpt = getRandom(poll.options);
          randomOpt.votes.push({ user: voter._id });
        }
      }
      await poll.save();
    }

    console.log('\n======================================================');
    console.log('📊 DEMO DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('\nDemo User Accounts (Password is "Password@123"):');
    console.log('1. Admin:           admin@society.com');
    console.log('2. Resident:        resident@society.com');
    console.log('3. Security Staff:   security@society.com');
    console.log('4. Maintenance Staff: maintenance@society.com');
    console.log('\nRun client dev server and use these accounts to verify.');
    console.log('======================================================\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding database failed with error:', error);
    process.exit(1);
  }
};

seedDatabase();
