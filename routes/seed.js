const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// router.get('/seed-admins', async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash('admin123', 10);

//     const users = [
//       {
//         email: 'superadmin@example.com',
//         password: hashedPassword,
//         role: 'superadmin',
//       },
//       {
//         email: 'membershipadmin@example.com',
//         password: hashedPassword,
//         role: 'membershipadmin',
//       },
//       {
//         email: 'matrimonialadmin@example.com',
//         password: hashedPassword,
//         role: 'matrimonialadmin',
//       },
//     ];

//     await User.insertMany(users);
//     res.status(201).json({ message: 'Dummy admins seeded successfully' });
//   } catch (error) {
//     console.error('Error seeding users:', error);
//     res.status(500).json({ error: 'Failed to seed users' });
//   }
// });

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const User = require('../models/user');

// router.get('/seed-admins', async (req, res) => {
//   try {
//     const users = [
//       {
//         email: 'superadmin@example.com',
//         password: 'superadmin123', 
//         role: 'superadmin',
//       },
//       {
//         email: 'membershipadmin@example.com',
//         password: 'membership345',
//         role: 'membershipadmin',
//       },
//       {
//         email: 'matrimonialadmin@example.com',
//         password: 'matrimonial567',
//         role: 'matrimonialadmin',
//       },
//     ];

//     await User.insertMany(users);
//     res.status(201).json({ message: 'Dummy admins seeded successfully' });
//   } catch (error) {
//     console.error('Error seeding users:', error);
//     res.status(500).json({ error: 'Failed to seed users' });
//   }
// });

// module.exports = router;


router.get('/seed-admins', async (req, res) => {
  try {
    // Step 1: Remove old admin users
    await User.deleteMany({ role: { $in: ['superadmin', 'membershipadmin', 'matrimonialadmin'] } });

    // Step 2: Hash new passwords
    const superAdminPass = await bcrypt.hash('Super@123', 10);
    const membershipAdminPass = await bcrypt.hash('Membership@456', 10);
    const matrimonialAdminPass = await bcrypt.hash('Matrimonial@789', 10);

    // Step 3: Add new admins
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
    ];

    await User.insertMany(users);

    res.status(201).json({ message: 'Admins reseeded with new credentials.' });
  } catch (error) {
    console.error('Error reseeding admins:', error);
    res.status(500).json({ error: 'Seeding failed.' });
  }
});

module.exports = router;