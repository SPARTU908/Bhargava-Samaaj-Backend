const RegisteredUser = require("../models/registeredUser");
const sendEmail = require("../mailsend.js");

const register = async (req, res) => {
  try {
    const {
      abbsMembershipNo,
      name,
      gender,
      dob,
      address,
      city,
      pincode,
      mobileNo,
      email,
      category,
    } = req.body;

    const paymentSlip = req.files?.paymentSlip?.[0]?.path;
    const photo = req.files?.photo?.[0]?.path;

    const newForm = new RegisteredUser({
      abbsMembershipNo,
      name,
      gender,
      dob,
      address,
      city,
      pincode,
      mobileNo,
      email,
      category,
      paymentSlip,
      photo,
    });

    await newForm.save();

    await sendEmail({
      to: email,
      subject: "Registration Successful - ABBS Conference",
      text: `Hello ${name}, your registration for the 133rd Annual ABBS Conference has been received.`,
      html: `
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for registering for the <strong>133<sup>rd</sup> Annual ABBS Conference</strong> to be held at <strong>Ujjain</strong> on <strong>20th, 21st, and 22nd December</strong>.</p>
        <p>We have received your registration details and payment slip.</p>
        <p>Please keep this email for your reference.</p>
        <br/>
        <p>Warm regards,</p>
        <p><strong>ABBS Conference Committee</strong></p>
      `,
    });

    res
      .status(201)
      .json({ message: "Form submitted successfully", form: newForm });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await RegisteredUser.find().sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

module.exports = {
  register,
  getAllUsers,
};

module.exports = { register, getAllUsers };
