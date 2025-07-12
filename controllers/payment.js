const Member = require("../models/membership");
const Payment = require("../models/payment");

const createPayment = async (req, res) => {
  try {
    const { memberId, transactionId } = req.body;
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    const payment = await Payment.create({
      memberId: member._id,
      name: member.username,
      mobile: member.mobile,
      email: member.email,
      transactionId,
    });

    res.status(201).json({
      message: "Payment recorded successfully",
      payment,
    });
  } catch (error) {
    console.error("Payment creation failed:", error.message);
    res.status(500).json({
      error: "Failed to record payment",
      details: error.message,
    });
  }
};

const getPayment = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error("Error getting payments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  createPayment,getPayment
};
