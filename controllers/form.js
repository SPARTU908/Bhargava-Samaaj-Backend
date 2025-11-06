const UserForm = require("../models/form.js");
const sendEmail = require("../mailsend.js");
const nodemailer = require("nodemailer");

const saveFormData = async (req, res) => {
  try {
    const email = req.body.email;
    const existingForm = await UserForm.findOne({ email });
    if (existingForm) {
      return res.status(409).json({
        errorMessage: "A form with this email already exists.",
      });
    }
    const photoFile = req.files?.photo?.[0];
    const bioDataFile = req.files?.bioData?.[0];

    const photoUrl = photoFile ? photoFile.location : "";
    const bioDataUrl = bioDataFile ? bioDataFile.location : "";

    const formData = {
      ...req.body,
      photo: photoUrl,
      bioData: bioDataUrl,
    };

    const newForm = new UserForm(formData);
    await newForm.save();

   
    res.status(201).json({
      message: "Form data saved successfully",
      status: "pending",
      photo: photoUrl,
      bioData: bioDataUrl,
    });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({ errorMessage: "Something went wrong" });
  }
};

const getApprovedFormData = async (req, res) => {
  try {
    const forms = await UserForm.find({ status: "approved" });
    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching approved form data:", error);
    res.status(500).json({ error: "Failed to fetch form data" });
  }
};

const getPendingFormData = async (req, res) => {
  try {
    const pendingForms = await UserForm.find({ status: "pending" });
    res.status(200).json(pendingForms);
  } catch (error) {
    console.error("Error fetching pending forms:", error);
    res.status(500).json({ error: "Failed to fetch pending forms" });
  }
};

const reviewForm = async (req, res) => {
  try {
    const { formId, action } = req.body;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const updatedForm = await UserForm.findByIdAndUpdate(
      formId,
      { status: action === "approve" ? "approved" : "rejected" },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

   if (action === "approve") {
      await sendEmail({
        to: updatedForm.email,
        subject: "Form Approved",
        text: `Hello ${updatedForm.name}, your login request has been approved. Visit: https://bhargavasamajglobal.org/`,
        html: `
          <p>Hello <strong>${updatedForm.name}</strong>,</p>
          <p>Your login request has been <b>approved</b>. Please click the button below to login and explore biodatas.</p>
          <p>
            <a href="https://bhargavasamajglobal.org/findyourmatch/" style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #4CAF50;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
            ">
              Login
            </a>
          </p>
          <p>Thank you,<br>Bhargava Samaaj Global</p>
        `,
      });
    }

    res.status(200).json({
      message: `Form ${action}d successfully`,
      form: updatedForm,
    });
  } catch (error) {
    console.error("Error reviewing form:", error);
    res.status(500).json({ error: "Failed to review form" });
  }
};

const getUserStatus = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const user = await UserForm.findOne({
      email: { $regex: `^${email}$`, $options: "i" },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ status: user.status });
  } catch (error) {
    console.error("Error fetching user status:", error);
    res.status(500).json({ error: "Failed to fetch user status" });
  }
};

const getPendingFormCount = async (req, res) => {
  try {
    const count = await UserForm.countDocuments({ status: "pending" });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching pending form count:", error);
    res.status(500).json({ error: "Failed to fetch count" });
  }
};

const getRejectedFormCount = async (req, res) => {
  try {
    const count = await UserForm.countDocuments({ status: "rejected" });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching pending form count:", error);
    res.status(500).json({ error: "Failed to fetch count" });
  }
};

const getRejectedForms = async (req, res) => {
  try {
    const rejectedForms = await UserForm.find({ status: "rejected" });
    res.status(200).json({ data: rejectedForms }); 
  } catch (error) {
    console.error("Error fetching rejected forms:", error);
    res.status(500).json({ error: "Failed to fetch rejected forms" });
  }
};

const getFormCount = async (req, res) => {
  try {
    const count = await UserForm.countDocuments({ status: "approved" });
    res.status(200).json({ count });
  } catch (error) {
    console.log("Error fetching pending form count:", error);
    res.status(500).json({ error: "Failed to fetch count" });
  }
};



const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;  
    

    const deletedUser = await UserForm.findByIdAndUpdate(
      id, 
      { 
        status: 'deleted', 
        deletedAt: new Date()  
      },
      { new: true }  
    );

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User soft deleted successfully",
      deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to soft delete user" });
  }
};


const updateUserDetails = async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = { ...req.body };
    if (req.files) {
      if (req.files.photo && req.files.photo[0]) {
        updateData.photo = req.files.photo[0].location;
      }
      if (req.files.bioData && req.files.bioData[0]) {
        updateData.bioData = req.files.bioData[0].location;
      }
    }
    const updatedUser = await UserForm.findOneAndUpdate({ email }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User details updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update details of user" });
  }
};


const requestResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await UserForm.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); 
    const expires = Date.now() + 10 * 60 * 1000; 

    user.resetOTP = otp;
    user.resetOTPExpires = expires;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
  from: `"Bhargava Samaaj Global" <${process.env.EMAIL_USER}>`,
  to: user.email,
  subject: "Your OTP for Password Reset",
  text: `
Dear ${user.name || "User"},

We received a request to reset your password for your Bhargava Samaaj Global Matrimonial Account.

🔐 Your One-Time Password (OTP) is: ${otp}

This OTP is valid for the next 10 minutes only. Please do not share this OTP with anyone. If you did not request a password reset, you can safely ignore this email.

If you face any issues, feel free to reach out to our support team.

Warm regards,  
Bhargava Samaaj Global 
`,
});


    res.json({ message: "OTP sent to your email." });

  } catch (err) {
    console.error("OTP Request Error:", err); 
    res.status(500).json({ errorMessage: "Something went wrong" });
  }
};

const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await UserForm.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

  
    if (
      user.resetOTP !== Number(otp) ||
      !user.resetOTPExpires ||
      user.resetOTPExpires < Date.now()
    ) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



module.exports = {
  saveFormData,
  getApprovedFormData,
  getPendingFormData,
  reviewForm,
  getUserStatus,
  getPendingFormCount,
  getFormCount,
  getRejectedFormCount,
  getRejectedForms,
  deleteUser,
  updateUserDetails,
  requestResetOtp,
  verifyResetOtp,
};
