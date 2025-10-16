const Member = require("../models/membership");
const Payment = require("../models/payment");
const sendEmail = require("../mailsend.js");

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


    await sendEmail({
      to: member.email,
      subject: "Payment Received - Thank You",
      text: `Dear ${member.username}, we have successfully received your payment. Transaction ID: ${transactionId}`,
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color:#0066cc;">Payment Confirmation</h2>
    <p>Dear <b>${member.username}</b>,</p>

    <p>We are pleased to inform you that we have successfully received your payment.  
    Below are the details of your transaction:</p>

    <table style="border-collapse: collapse; margin: 15px 0; width: 100%; max-width: 500px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><b>Transaction ID</b></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${transactionId}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><b>Name</b></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${member.username}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><b>Email</b></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${member.email}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><b>Mobile</b></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${member.mobile}</td>
      </tr>
    </table>

    <p>On behalf of <b> Bhargava Samaaj Global</b>, we sincerely thank you for your contribution and continued support towards our community initiatives.</p>

    <p>We will review your form and revert back.If you have any questions or require assistance, please feel free to reply to this email.</p>

    <br/>
    <p>Warm Regards,</p>
    <p><b>Bhargava Samaaj Global</b><br/>
    <span style="font-size: 12px; color: #777;">This is an automated confirmation email. Please do not reply directly to this message.</span></p>
  </div>
`,
    });

    res.status(201).json({
      success: true,
      message: "Payment done successfully",
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
  createPayment,
  getPayment,
};
