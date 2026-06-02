const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

router.get("/seed-admins", async (req, res) => {
  try {
    await User.deleteMany({
      role: {
        $in: [
          "superadmin",
          "membershipadmin",
          "matrimonialadmin",
          "conferenceadmin",
        ],
      },
    });

    const users = [
      {
        email: "superadmin@mysite.com",
        password: await bcrypt.hash(process.env.SUPERADMIN_PASS, 10),
        role: "superadmin",
      },
      {
        email: "membershipadmin@mysite.com",
        password: await bcrypt.hash(process.env.MEMBERSHIPADMIN_PASS, 10),
        role: "membershipadmin",
      },
      {
        email: "matrimonialadmin@mysite.com",
        password: await bcrypt.hash(process.env.MATRIMONIALADMIN_PASS, 10),
        role: "matrimonialadmin",
      },
      {
        email: "conferenceadmin@mysite.com",
        password: await bcrypt.hash(process.env.CONFERENCEADMIN_PASS, 10),
        role: "conferenceadmin",
      },
    ];

    await User.insertMany(users);

    // TEST
    const hash = await bcrypt.hash(process.env.MATRIMONIALADMIN_PASS, 10);

    const admin = await User.findOne({
      email: "matrimonialadmin@mysite.com",
    });

    res.status(201).json({
      message: "Admins reseeded successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Seeding failed" });
  }
});

module.exports = router;
