const Payment = require("../models/payment");

const savePayment = async (req, res) => {
  try {
    const { name, email, mobile, transaction } = req.body;

    if (!name || !email || !mobile || !transaction) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedPayment = await Payment.findOneAndUpdate(
      { email, transaction }, // Search criteria
      { name, mobile, email, transaction }, // Data to update
      { new: true, upsert: true } // Return updated doc or create if not found
    );

    res.status(200).json({
      message: "Payment saved successfully",
      data: updatedPayment,
    });
  } catch (error) {
    console.error("Error saving payment:", error);
    res.status(500).json({ message: "Internal server error" });
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

const updatePaymentForm = async (req, res) => {
  const { paymentId, formValue } = req.body;

  try {
  const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { uploadForm: formValue },
      { new: true } // Return the updated document
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(updatedPayment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  savePayment,getPayment ,updatePaymentForm,
};
