const ConferenceRegistration = require("../models/conferenceRegistration");

const NewLifeMember = require("../models/lifememberregistration");

const generateRegistrationNumbers = require("../utils/generateRegistrationNumbers");

const PRICE_PER_PERSON = 50;

const crypto = require("crypto");

const sendEmail = require("../mailsend");

const generateConferenceRegistrationPdf = require("../utils/generateConferenceRegistrationPdf");

const createConferenceRegistration = async (req, res) => {
  try {
    const { memberId, familyDetails } = req.body;

    if (!memberId) {
      return res.status(400).json({
        message: "Member ID is required",
      });
    }

    const member = await NewLifeMember.findById(memberId);

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    let family = [];

    if (familyDetails) {
      try {
        family =
          typeof familyDetails === "string"
            ? JSON.parse(familyDetails)
            : familyDetails;
      } catch (error) {
        return res.status(400).json({
          message: "Invalid family details format",
        });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Total Members
    |--------------------------------------------------------------------------
    */

    const totalMembers = 1 + family.length;

    /*
    |--------------------------------------------------------------------------
    | Calculate Amount
    |--------------------------------------------------------------------------
    */

    const amount = totalMembers * PRICE_PER_PERSON;

    /*
    |--------------------------------------------------------------------------
    | Generate Registration Numbers
    |--------------------------------------------------------------------------
    */

    // const registrationNumbers = await generateRegistrationNumbers(totalMembers);

    /*
    |--------------------------------------------------------------------------
    | Primary Member
    |--------------------------------------------------------------------------
    */

    const conferenceMembers = [
      {
        // registrationNumber: registrationNumbers[0],
        registrationNumber: "",

        memberType: "Primary",

        relation: "",

        LM_NO: member.LM_NO || "",
        Year: member.Year || "",
        Title: member.Title || "",
        Member_Name: member.Member_Name || "",
        Card_Issued: member.Card_Issued || "",
        S_O_D_O_W_O: member.S_O_D_O_W_O || "",
        Date_of_Birth: member.Date_of_Birth || "",
        Address: member.Address || "",
        City: member.City || "",
        Pin: member.Pin || "",
        Contact_No: member.Contact_No || "",
        Email: member.Email || "",
        Gotra: member.Gotra || "",
        Kuldevi: member.Kuldevi || "",
        gender: member.gender || "",
        category: member.category || "",
        occupation: member.occupation || "",
        photo: member.photo || "",
      },
    ];

    /*
    |--------------------------------------------------------------------------
    | Family Members
    |--------------------------------------------------------------------------
    */

    family.forEach((familyMember, index) => {
      conferenceMembers.push({
        // registrationNumber: registrationNumbers[index + 1],

        registrationNumber: "",

        memberType: "Family",

        relation: familyMember.Relation || "",

        LM_NO: familyMember.LM_NO || "",
        Year: familyMember.Year || "",
        Title: familyMember.Title || "",
        Member_Name: familyMember.Member_Name || "",
        Card_Issued: familyMember.Card_Issued || "",
        S_O_D_O_W_O: familyMember.S_O_D_O_W_O || "",
        Date_of_Birth: familyMember.Date_of_Birth || "",
        Address: familyMember.Address || "",
        City: familyMember.City || "",
        Pin: familyMember.Pin || "",
        Contact_No: familyMember.Contact_No || "",
        Email: familyMember.Email || "",
        Gotra: familyMember.Gotra || "",
        Kuldevi: familyMember.Kuldevi || "",
        gender: familyMember.gender || "",
        category: familyMember.category || "",
        occupation: familyMember.occupation || "",
        photo: familyMember.photo || "",
      });
    });

    /*
    |--------------------------------------------------------------------------
    | Save Conference Registration
    |--------------------------------------------------------------------------
    */

    const registration = new ConferenceRegistration({
      primaryMemberId: member._id,

      members: conferenceMembers,

      totalMembers,

      amount,

      payment: {
        status: "pending",
      },

      registrationStatus: "payment_pending",
    });

    await registration.save();

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({
      message: "Conference registration created successfully",

      registrationId: registration._id,

      // primaryRegistrationNumber: registrationNumbers[0],

      // registrationNumbers,

      totalMembers,

      amount,

      members: registration.members,

      paymentStatus: "pending",
    });
  } catch (error) {
    console.error("Conference registration error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Conference Registration
|--------------------------------------------------------------------------
*/

const getConferenceRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const registration =
      await ConferenceRegistration.findById(id).populate("primaryMemberId");

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    return res.status(200).json(registration);
  } catch (error) {
    console.error("Get conference registration error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Submit Payment
|--------------------------------------------------------------------------
*/

const submitConferencePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        message: "Transaction ID / UTR is required",
      });
    }

    const paymentScreenshot = req.files?.paymentScreenshot?.[0];

    if (!paymentScreenshot) {
      return res.status(400).json({
        message: "Payment screenshot is required",
      });
    }

    const registration = await ConferenceRegistration.findById(id);

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    if (registration.payment.status === "verified") {
      return res.status(400).json({
        message: "Payment has already been verified",
      });
    }

    // registration.payment.transactionId = transactionId.trim();

    // registration.payment.screenshot = paymentScreenshot.location;

    // registration.payment.status = "submitted";

    // registration.payment.submittedAt = new Date();

    // registration.registrationStatus = "payment_submitted";

    /*
|--------------------------------------------------------------------------
| Generate Registration Numbers AFTER Payment
|--------------------------------------------------------------------------
*/

const alreadyGenerated =
  registration.members.every(
    (member) => member.registrationNumber
  );

if (!alreadyGenerated) {
  const registrationNumbers =
    await generateRegistrationNumbers(
      registration.totalMembers
    );

  registration.members.forEach(
    (member, index) => {
      member.registrationNumber =
        registrationNumbers[index];
    }
  );
}

/*
|--------------------------------------------------------------------------
| Save Payment
|--------------------------------------------------------------------------
*/

registration.payment.transactionId =
  transactionId.trim();

registration.payment.screenshot =
  paymentScreenshot.location;

registration.payment.status = "submitted";

registration.payment.submittedAt =
  new Date();

registration.registrationStatus =
  "payment_submitted";



    const approvalToken = crypto.randomBytes(32).toString("hex");

    registration.approval.token = approvalToken;

    registration.approval.tokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );

    await registration.save();

    const pdfBuffer =
  await generateConferenceRegistrationPdf(
    registration
  );
  const primaryMember =
  registration.members.find(
    (member) =>
      member.memberType === "Primary"
  );
  const approveUrl =
  `${process.env.BACKEND_URL}` +
  `/api/conference-registration/${registration._id}` +
  `/admin-action?token=${approvalToken}&action=approve`;

const declineUrl =
  `${process.env.BACKEND_URL}` +
  `/api/conference-registration/${registration._id}` +
  `/admin-action?token=${approvalToken}&action=decline`;
  const memberRows =
  registration.members
    .map(
      (member) => `
        <tr>
          <td
            style="
              padding:10px;
              border:1px solid #ddd;
            "
          >
            ${member.Member_Name}
          </td>

          <td
            style="
              padding:10px;
              border:1px solid #ddd;
            "
          >
            ${
              member.memberType === "Primary"
                ? "Primary"
                : member.relation || "Family"
            }
          </td>

          <td
            style="
              padding:10px;
              border:1px solid #ddd;
            "
          >
            ${member.registrationNumber}
          </td>
        </tr>
      `
    )
    .join("");
    const adminEmailHtml = `
<div
  style="
    font-family:Arial,sans-serif;
    color:#333;
    max-width:750px;
    margin:auto;
  "
>

  <h2 style="color:#f26522;">
    New Conference Payment Submitted
  </h2>

  <p>
    A conference registration payment
    has been submitted and requires
    verification.
  </p>

  <h3>
    Primary Member
  </h3>

  <p>
    <strong>Name:</strong>
    ${primaryMember?.Member_Name || "-"}
  </p>

  <p>
    <strong>LM No:</strong>
    ${primaryMember?.LM_NO || "-"}
  </p>

  <p>
    <strong>Mobile:</strong>
    ${primaryMember?.Contact_No || "-"}
  </p>

  <p>
    <strong>Email:</strong>
    ${primaryMember?.Email || "-"}
  </p>

  <h3>
    Registration Numbers
  </h3>

  <table
    style="
      width:100%;
      border-collapse:collapse;
    "
  >
    <thead>
      <tr>
        <th
          style="
            padding:10px;
            border:1px solid #ddd;
            text-align:left;
          "
        >
          Member
        </th>

        <th
          style="
            padding:10px;
            border:1px solid #ddd;
            text-align:left;
          "
        >
          Relation
        </th>

        <th
          style="
            padding:10px;
            border:1px solid #ddd;
            text-align:left;
          "
        >
          Registration No.
        </th>
      </tr>
    </thead>

    <tbody>
      ${memberRows}
    </tbody>
  </table>

  <br/>

  <h3>
    Payment
  </h3>

  <p>
    <strong>Total Members:</strong>
    ${registration.totalMembers}
  </p>

  <p>
    <strong>Total Amount:</strong>
    Rs. ${registration.amount}
  </p>

  <p>
    <strong>Transaction ID:</strong>
    ${registration.payment.transactionId}
  </p>



<p>
  <strong>Payment Screenshot:</strong>
</p>

<p>
  <a
    href="${registration.payment.screenshot}"
    target="_blank"
    style="
      display:inline-block;
      color:#f26522;
      font-weight:bold;
      text-decoration:none;
    "
  >
    View Payment Screenshot
  </a>
</p>

<p>
  The complete registration details
  are attached as a PDF.
</p>

<div
  style="
    margin-top:30px;
    padding-top:20px;
    border-top:1px solid #ddd;
    text-align:center;
  "
>
  

    <a
      href="${approveUrl}"
      style="
        display:inline-block;
        background:#198754;
        color:#fff;
        text-decoration:none;
        padding:13px 28px;
        margin:5px;
        border-radius:6px;
        font-weight:bold;
      "
    >
      ✓ Approve Registration
    </a>

    <a
      href="${declineUrl}"
      style="
        display:inline-block;
        background:#dc3545;
        color:#fff;
        text-decoration:none;
        padding:13px 28px;
        margin:5px;
        border-radius:6px;
        font-weight:bold;
      "
    >
      ✕ Decline Registration
    </a>

  </div>

  <p
    style="
      margin-top:25px;
      font-size:12px;
      color:#777;
    "
  >
    These approval links are private.
    Do not forward this email.
  </p>

</div>
`;
await sendEmail({
  to:
    process.env.EMAIL_USER1,

  subject:
    `Conference Payment Verification - ${
      primaryMember?.Member_Name
    }`,

  html:
    adminEmailHtml,

  attachments: [
    {
      filename:
        `Conference-Registration-${registration._id}.pdf`,

      content:
        pdfBuffer,

      contentType:
        "application/pdf",
    },
  ],
});

    return res.status(200).json({
      message: "Payment details submitted successfully",

      registrationId: registration._id,

      primaryRegistrationNumber: registration.members[0].registrationNumber,

      registrationNumbers: registration.members.map(
        (member) => member.registrationNumber,
      ),

      totalMembers: registration.totalMembers,

      amount: registration.amount,

      transactionId: registration.payment.transactionId,

      paymentStatus: registration.payment.status,
    });
  } catch (error) {
    console.error("Payment submission error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const handleConferenceAdminAction =
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        token,
        action,
      } = req.query;

      /*
      |--------------------------------------------------------------------------
      | Validation
      |--------------------------------------------------------------------------
      */

      if (!token) {
        return res.status(400).send(
          "Invalid approval link."
        );
      }

      if (
        !["approve", "decline"].includes(
          action
        )
      ) {
        return res.status(400).send(
          "Invalid action."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Find Registration
      |--------------------------------------------------------------------------
      */

      const registration =
        await ConferenceRegistration.findOne({
          _id: id,
          "approval.token": token,
        });

      if (!registration) {
        return res.status(404).send(
          "Invalid or expired approval link."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Check expiration
      |--------------------------------------------------------------------------
      */

      if (
        !registration.approval
          .tokenExpiresAt ||
        new Date() >
          registration.approval
            .tokenExpiresAt
      ) {
        return res.status(400).send(
          "This approval link has expired."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Prevent second action
      |--------------------------------------------------------------------------
      */

      if (
        registration.registrationStatus ===
          "approved" ||
        registration.registrationStatus ===
          "rejected"
      ) {
        return res.status(400).send(
          `This registration has already been ${registration.registrationStatus}.`
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Primary Member
      |--------------------------------------------------------------------------
      */

      const primaryMember =
        registration.members.find(
          (member) =>
            member.memberType ===
            "Primary"
        );

      /*
      |--------------------------------------------------------------------------
      | APPROVE
      |--------------------------------------------------------------------------
      */

      if (action === "approve") {
        registration.payment.status =
          "verified";

        registration.payment.verifiedAt =
          new Date();

        registration.registrationStatus =
          "approved";

        registration.approval.actionAt =
          new Date();

        // invalidate token immediately
        registration.approval.token = "";

        await registration.save();

        /*
        Generate FINAL receipt
        */

        const pdfBuffer =
          await generateConferenceRegistrationPdf(
            registration
          );

        const rows =
          registration.members
            .map(
              (member) => `
                <tr>
                  <td
                    style="
                      border:1px solid #ddd;
                      padding:8px;
                    "
                  >
                    ${member.Member_Name}
                  </td>

                  <td
                    style="
                      border:1px solid #ddd;
                      padding:8px;
                      color:#f26522;
                      font-weight:bold;
                    "
                  >
                    ${member.registrationNumber}
                  </td>
                </tr>
              `
            )
            .join("");

        /*
        User email
        */

        await sendEmail({
          to:
            primaryMember.Email,

          subject:
            "ABBS Conference Registration Approved",

          html: `
            <div
              style="
                font-family:Arial,sans-serif;
                color:#333;
              "
            >

              <h2
                style="
                  color:#198754;
                "
              >
                Registration Approved
              </h2>

              <p>
                Dear ${
                  primaryMember.Member_Name
                },
              </p>

              <p>
                Your payment has been verified
                and your registration for the
                ABBS Conference has been
                successfully approved.
              </p>

              <table
                style="
                  border-collapse:collapse;
                  width:100%;
                  max-width:600px;
                "
              >
                <thead>
                  <tr>
                    <th
                      style="
                        border:1px solid #ddd;
                        padding:8px;
                        text-align:left;
                      "
                    >
                      Member
                    </th>

                    <th
                      style="
                        border:1px solid #ddd;
                        padding:8px;
                        text-align:left;
                      "
                    >
                      Registration Number
                    </th>
                  </tr>
                </thead>

                <tbody>
                  ${rows}
                </tbody>
              </table>

              <p>
                <strong>
                  Total Members:
                </strong>
                ${registration.totalMembers}
              </p>

              <p>
                <strong>
                  Amount:
                </strong>
                Rs. ${registration.amount}
              </p>

              <p>
                <strong>
                  Transaction ID:
                </strong>
                ${
                  registration.payment
                    .transactionId
                }
              </p>

              <p>
                Your final registration receipt
                is attached.
              </p>

              <br/>

              <p>
                Regards,<br/>
                ABBS Conference Team
              </p>

            </div>
          `,

          attachments: [
            {
              filename:
                `ABBS-Conference-Receipt.pdf`,

              content:
                pdfBuffer,

              contentType:
                "application/pdf",
            },
          ],
        });

        return res.send(`
          <html>
            <body
              style="
                font-family:Arial;
                text-align:center;
                padding:80px 20px;
              "
            >
              <h1 style="color:#198754;">
                ✓ Registration Approved
              </h1>

              <p>
                ${
                  primaryMember.Member_Name
                }'s conference registration
                has been approved successfully.
              </p>
            </body>
          </html>
        `);
      }

      /*
      |--------------------------------------------------------------------------
      | DECLINE
      |--------------------------------------------------------------------------
      */

      registration.payment.status =
        "rejected";

      registration.registrationStatus =
        "rejected";

      registration.approval.actionAt =
        new Date();

      registration.approval.token =
        "";

      await registration.save();

      /*
      |--------------------------------------------------------------------------
      | Send rejection email
      |--------------------------------------------------------------------------
      */

      await sendEmail({
        to:
          primaryMember.Email,

        subject:
          "ABBS Conference Registration - Payment Verification Failed",

        html: `
          <div
            style="
              font-family:Arial,sans-serif;
              color:#333;
            "
          >

            <h2
              style="
                color:#dc3545;
              "
            >
              Payment Verification Unsuccessful
            </h2>

            <p>
              Dear ${
                primaryMember.Member_Name
              },
            </p>

            <p>
              We were unable to verify the
              payment submitted for your
              conference registration.
            </p>

            <p>
              <strong>
                Transaction ID:
              </strong>
              ${
                registration.payment
                  .transactionId
              }
            </p>

            <p>
              Please contact the ABBS office
              for further assistance or submit
              the correct payment details.
            </p>

            <br/>

            <p>
              Regards,<br/>
              ABBS Conference Team
            </p>

          </div>
        `,
      });

      return res.send(`
        <html>
          <body
            style="
              font-family:Arial;
              text-align:center;
              padding:80px 20px;
            "
          >
            <h1 style="color:#dc3545;">
              Registration Declined
            </h1>

            <p>
              The applicant has been notified
              by email.
            </p>
          </body>
        </html>
      `);

    } catch (error) {
      console.error(
        "Conference admin action error:",
        error
      );

      return res
        .status(500)
        .send(
          "Unable to process registration."
        );
    }
  };

const getAllConferenceRegistrations = async (req, res) => {
  try {
     const registrations =
      await ConferenceRegistration.find({})
        .sort({ createdAt: -1 })
        .lean();

   return res.status(200).json({
      success: true,
      total: registrations.length,
      registrations: registrations,
    });

  } catch (error) {
    console.error(
      "GET ALL CONFERENCE REGISTRATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch conference registrations",
      error: error.message,
      stack: error.stack,
    });
  }
};

// const checkApprovedConferenceRegistration = async (req, res) => {
//   try {
//     const { memberId } = req.params;

//     if (!memberId) {
//       return res.status(400).json({
//         success: false,
//         message: "Member ID is required",
//       });
//     }

//     const registration = await ConferenceRegistration.findOne({
//       primaryMemberId: memberId,
//       registrationStatus: "approved",
//       "payment.status": "verified",
//     });

//     if (!registration) {
//       return res.status(200).json({
//         success: true,
//         alreadyRegistered: false,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       alreadyRegistered: true,

//       message:
//         "You have already registered for the conference and your registration has been approved.",

//       registrationId: registration._id,

//       registrationStatus: registration.registrationStatus,

//       paymentStatus: registration.payment.status,

//       registrationNumbers: registration.members.map((member) => ({
//         name: member.Member_Name,
//         registrationNumber: member.registrationNumber,
//       })),
//     });
//   } catch (error) {
//     console.error(
//       "Check approved conference registration error:",
//       error,
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Unable to check registration status",
//       error: error.message,
//     });
//   }
// };
const checkApprovedConferenceRegistration = async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "Member ID is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | STEP 1 - Approved registration ko first priority
    |--------------------------------------------------------------------------
    */

    let registration = await ConferenceRegistration.findOne({
      primaryMemberId: memberId,
      registrationStatus: "approved",
    }).sort({ updatedAt: -1 });

    /*
    |--------------------------------------------------------------------------
    | STEP 2 - Approved nahi mila to payment_submitted check karo
    |--------------------------------------------------------------------------
    */

    if (!registration) {
      registration = await ConferenceRegistration.findOne({
        primaryMemberId: memberId,
        registrationStatus: "payment_submitted",
      }).sort({ updatedAt: -1 });
    }

    /*
    |--------------------------------------------------------------------------
    | No submitted / approved registration
    |--------------------------------------------------------------------------
    */

    if (!registration) {
      return res.status(200).json({
        success: true,
        alreadyRegistered: false,
      });
    }

    let message = "";

    if (registration.registrationStatus === "approved") {
      message =
        "You have already registered for the conference and your registration has been approved.";
    } else if (
      registration.registrationStatus === "payment_submitted"
    ) {
      message =
        "Your registration form and payment have already been submitted. Please wait for approval.";
    }

    return res.status(200).json({
      success: true,
      alreadyRegistered: true,

      message,

      registrationId: registration._id,

      registrationStatus:
        registration.registrationStatus,

      paymentStatus:
        registration.payment?.status,

      registrationNumbers:
        registration.members?.map((member) => ({
          name: member.Member_Name,
          registrationNumber:
            member.registrationNumber,
        })) || [],
    });

  } catch (error) {
    console.error(
      "Check conference registration status error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to check conference registration status",
    });
  }
};


const checkNonAbbsConferenceRegistration = async (req, res) => {
  try {
    const { email, contactNo } = req.query;

    if (!email || !contactNo) {
      return res.status(400).json({
        success: false,
        message: "Email and mobile number are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const normalizedContact = contactNo
      .replace(/\D/g, "")
      .trim();

    /*
    |--------------------------------------------------------------------------
    | Escape regex special characters
    |--------------------------------------------------------------------------
    */

    const escapeRegex = (value) =>
      value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    /*
    |--------------------------------------------------------------------------
    | STEP 1 - APPROVED registration first priority
    |--------------------------------------------------------------------------
    |
    | Directly ConferenceRegistration.members ke Primary Member ko
    | Email + Mobile se check kar rahe hain.
    |
    */

    let registration =
      await ConferenceRegistration.findOne({
        registrationStatus: "approved",

        members: {
          $elemMatch: {
            memberType: "Primary",

            Email: {
              $regex: `^${escapeRegex(normalizedEmail)}$`,
              $options: "i",
            },

            Contact_No: normalizedContact,
          },
        },
      }).sort({
        updatedAt: -1,
      });

    /*
    |--------------------------------------------------------------------------
    | STEP 2 - PAYMENT SUBMITTED
    |--------------------------------------------------------------------------
    */

    if (!registration) {
      registration =
        await ConferenceRegistration.findOne({
          registrationStatus: "payment_submitted",

          members: {
            $elemMatch: {
              memberType: "Primary",

              Email: {
                $regex: `^${escapeRegex(normalizedEmail)}$`,
                $options: "i",
              },

              Contact_No: normalizedContact,
            },
          },
        }).sort({
          updatedAt: -1,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Nothing found
    |--------------------------------------------------------------------------
    */

    if (!registration) {
      return res.status(200).json({
        success: true,
        alreadyRegistered: false,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Registration found
    |--------------------------------------------------------------------------
    */

    const message =
      registration.registrationStatus === "approved"
        ? "You have already registered for the conference and your registration has been approved."
        : "Your registration form and payment have already been submitted. Please wait for approval.";

    return res.status(200).json({
      success: true,

      alreadyRegistered: true,

      message,

      registrationId:
        registration._id,

      primaryMemberId:
        registration.primaryMemberId,

      registrationStatus:
        registration.registrationStatus,

      paymentStatus:
        registration.payment?.status,

      registrationNumbers:
        registration.members?.map(
          (item) => ({
            name: item.Member_Name,
            registrationNumber:
              item.registrationNumber,
          }),
        ) || [],
    });

  } catch (error) {
    console.error(
      "Check Non-ABBS registration error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to check registration status",
      error: error.message,
    });
  }
};

module.exports = {
  createConferenceRegistration,
  getConferenceRegistration,
  submitConferencePayment,
  handleConferenceAdminAction,
  getAllConferenceRegistrations,
  checkApprovedConferenceRegistration,
 checkNonAbbsConferenceRegistration,
};
