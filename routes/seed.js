const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

router.get('/seed-admins', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const users = [
      {
        email: 'superadmin@example.com',
        password: hashedPassword,
        role: 'superadmin',
      },
      {
        email: 'membershipadmin@example.com',
        password: hashedPassword,
        role: 'membershipadmin',
      },
      {
        email: 'matrimonialadmin@example.com',
        password: hashedPassword,
        role: 'matrimonialadmin',
      },
    ];

    await User.insertMany(users);
    res.status(201).json({ message: 'Dummy admins seeded successfully' });
  } catch (error) {
    console.error('Error seeding users:', error);
    res.status(500).json({ error: 'Failed to seed users' });
  }
});

module.exports = router;


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
//         password: 'membership123',
//         role: 'membershipadmin',
//       },
//       {
//         email: 'vivahparamarsh@gmail.com',
//         password: 'vivah@paramarsh',
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


