const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

router.get('/seed-admins', async (req, res) => {
  try {
    // Delete existing admin users
    await User.deleteMany({ role: { $in: ['superadmin', 'membershipadmin', 'matrimonialadmin', 'conferenceadmin'] } });

    // Hash passwords
    const superAdminPass = await bcrypt.hash('Super@123', 10);
    const membershipAdminPass = await bcrypt.hash('Membership@456', 10);
    const matrimonialAdminPass = await bcrypt.hash('Matrimonial@789', 10);
    const conferenceAdminPass = await bcrypt.hash('Conference@321', 10);  // NEW

    // Define admin users
    const users = [
      {
        email: 'superadmin@mysite.com',
        password: superAdminPass,
        role: 'superadmin',
      },
      {
        email: 'membershipadmin@mysite.com',
        password: membershipAdminPass,
        role: 'membershipadmin',
      },
      {
        email: 'matrimonialadmin@mysite.com',
        password: matrimonialAdminPass,
        role: 'matrimonialadmin',
      },
      {
        email: 'conferenceadmin@mysite.com',  // NEW
        password: conferenceAdminPass,        // NEW
        role: 'conferenceadmin',              // NEW
      },
    ];

    await User.insertMany(users);

    res.status(201).json({ message: 'Admins reseeded with new credentials including conference admin.' });
  } catch (error) {
    console.error('Error reseeding admins:', error);
    res.status(500).json({ error: 'Seeding failed.' });
  }
});

module.exports = router;
