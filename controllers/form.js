const UserForm = require("../models/form.js");
const sendEmail = require("../mailsend.js");

const saveFormData = async (req, res) => {
  try {
    const newForm = new UserForm(req.body);
    await newForm.save();
    res
      .status(201)
      .json({ message: "Form data saved successfully", status: "pending" });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({ error: "Failed to save form data" });
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

// const reviewForm = async (req, res) => {
//   try {
//     const { formId, action } = req.body;

//     if (!["approve", "reject"].includes(action)) {
//       return res.status(400).json({ message: "Invalid action" });
//     }

//     const updatedForm = await UserForm.findByIdAndUpdate(
//       formId,
//       { status: action === "approve" ? "approved" : "rejected" },
//       { new: true }
//     );

//     if (!updatedForm) {
//       return res.status(404).json({ message: "Form not found" });
//     }

//     res.status(200).json({
//       message: `Form ${action}d successfully`,
//       form: updatedForm,
//     });
//   } catch (error) {
//     console.error("Error reviewing form:", error);
//     res.status(500).json({ error: "Failed to review form" });
//   }
// };

// const reviewForm = async (req, res) => {
//   try {
//     const { formId, action } = req.body;

//     if (!["approve", "reject"].includes(action)) {
//       return res.status(400).json({ message: "Invalid action" });
//     }

//     const updatedForm = await UserForm.findByIdAndUpdate(
//       formId,
//       { status: action === "approve" ? "approved" : "rejected" },
//       { new: true }
//     );

//     if (!updatedForm) {
//       return res.status(404).json({ message: "Form not found" });
//     }

//     // ✅ Send email on approval
//     if (action === "approve") {
//       await sendEmail({
//         to: updatedForm.email,
//         subject: "Form Approved",
//         text: `Hello ${updatedForm.name}, .`,
//         html: `<p>Hello <strong>${updatedForm.name}</strong>,Your login request has been approved . Please login and explore biodatas.</p>`,
//       });
//     }

//     res.status(200).json({
//       message: `Form ${action}d successfully`,
//       form: updatedForm,
//     });
//   } catch (error) {
//     console.error("Error reviewing form:", error);
//     res.status(500).json({ error: "Failed to review form" });
//   }
// };


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

    // Send email on approval
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
    const { email } = req.params; // or use ID if available
    const user = await UserForm.findOne({ email });
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

const getFormCount = async (req, res) => {
  try {
    const count = await UserForm.countDocuments({ status: "approved" });
      res.status(200).json({ count }); 
  } catch (error) {
    console.log("Error fetching pending form count:", error);
    res.status(500).json({ error: "Failed to fetch count" });
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
};
