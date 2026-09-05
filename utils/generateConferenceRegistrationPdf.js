const PDFDocument = require("pdfkit");

const generateConferenceRegistrationPdf = (
  registration
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
      });

      const buffers = [];

      doc.on("data", (chunk) => {
        buffers.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });

      /*
      |--------------------------------------------------------------------------
      | Helpers
      |--------------------------------------------------------------------------
      */

      const safe = (value) => {
        if (
          value === undefined ||
          value === null ||
          String(value).trim() === ""
        ) {
          return "-";
        }

        return String(value);
      };

      const addField = (label, value) => {
        doc
          .font("Helvetica-Bold")
          .text(`${label}: `, {
            continued: true,
          })
          .font("Helvetica")
          .text(safe(value));
      };

      const addSectionTitle = (title) => {
        doc.moveDown(0.8);

        doc
          .font("Helvetica-Bold")
          .fontSize(14)
          .text(title);

        doc
          .moveTo(
            doc.x,
            doc.y + 3
          )
          .lineTo(
            555,
            doc.y + 3
          )
          .strokeColor("#cccccc")
          .stroke();

        doc.moveDown(0.8);
      };

      /*
      |--------------------------------------------------------------------------
      | HEADER
      |--------------------------------------------------------------------------
      */

      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .text(
          "AKHIL BHARTIYA BHARGAVA SAMAJ",
          {
            align: "center",
          }
        );

      doc.moveDown(0.3);

      doc
        .fontSize(16)
        .text(
          "Conference Registration Details",
          {
            align: "center",
          }
        );

      doc.moveDown(0.2);

      doc
        .font("Helvetica")
        .fontSize(11)
        .text(
          "135th Annual Conference - Jaipur",
          {
            align: "center",
          }
        );

      doc.moveDown(1.5);

      /*
      |--------------------------------------------------------------------------
      | PRIMARY MEMBER
      |--------------------------------------------------------------------------
      */

      const primary =
        registration.members.find(
          (member) =>
            member.memberType === "Primary"
        );

      addSectionTitle(
        "Primary Member Details"
      );

      doc.fontSize(10.5);

      addField(
        "Registration Number",
        primary?.registrationNumber
      );

      addField(
        "Member Type",
        primary?.memberType
      );

      addField(
        "ABBS Life Membership No",
        primary?.LM_NO
      );

      addField(
        "ABBS Membership Card Issued Year",
        primary?.Year
      );

      addField(
        "Title",
        primary?.Title
      );

      addField(
        "Member Name",
        primary?.Member_Name
      );

      addField(
        "Card Issued",
        primary?.Card_Issued
      );

      addField(
        "S/O, D/O, W/O",
        primary?.S_O_D_O_W_O
      );

      addField(
        "Date of Birth",
        primary?.Date_of_Birth
      );

      addField(
        "Gender",
        primary?.gender
      );

      addField(
        "Gotra",
        primary?.Gotra
      );

      addField(
        "Kuldevi",
        primary?.Kuldevi
      );

      addField(
        "Category",
        primary?.category
      );

      addField(
        "Occupation",
        primary?.occupation
      );

      addField(
        "Mobile No",
        primary?.Contact_No
      );

      addField(
        "Email",
        primary?.Email
      );

      addField(
        "Address",
        primary?.Address
      );

      addField(
        "City",
        primary?.City
      );

      addField(
        "PIN Code",
        primary?.Pin
      );

      addField(
        "Photo URL",
        primary?.photo
      );

      /*
      |--------------------------------------------------------------------------
      | FAMILY MEMBERS
      |--------------------------------------------------------------------------
      */

      const familyMembers =
        registration.members.filter(
          (member) =>
            member.memberType === "Family"
        );

      if (familyMembers.length > 0) {
        addSectionTitle(
          "Family Member Details"
        );

        familyMembers.forEach(
          (member, index) => {
            /*
            |--------------------------------------------------------------------------
            | Page overflow protection
            |--------------------------------------------------------------------------
            */

            if (doc.y > 620) {
              doc.addPage();
            }

            doc
              .font("Helvetica-Bold")
              .fontSize(12)
              .text(
                `Family Member ${index + 1}`
              );

            doc.moveDown(0.4);

            doc.fontSize(10.5);

            addField(
              "Registration Number",
              member.registrationNumber
            );

            addField(
              "Member Type",
              member.memberType
            );

            addField(
              "Relation",
              member.relation
            );

            addField(
              "ABBS Life Membership No",
              member.LM_NO
            );

            addField(
              "ABBS Membership Card Issued Year",
              member.Year
            );

            addField(
              "Title",
              member.Title
            );

            addField(
              "Member Name",
              member.Member_Name
            );

            addField(
              "Card Issued",
              member.Card_Issued
            );

            addField(
              "S/O, D/O, W/O",
              member.S_O_D_O_W_O
            );

            addField(
              "Date of Birth",
              member.Date_of_Birth
            );

            addField(
              "Gender",
              member.gender
            );

            addField(
              "Gotra",
              member.Gotra
            );

            addField(
              "Kuldevi",
              member.Kuldevi
            );

            addField(
              "Category",
              member.category
            );

            addField(
              "Occupation",
              member.occupation
            );

            addField(
              "Mobile No",
              member.Contact_No
            );

            addField(
              "Email",
              member.Email
            );

            addField(
              "Address",
              member.Address
            );

            addField(
              "City",
              member.City
            );

            addField(
              "PIN Code",
              member.Pin
            );

            addField(
              "Photo URL",
              member.photo
            );

            doc.moveDown(0.8);

            doc
              .moveTo(
                40,
                doc.y
              )
              .lineTo(
                555,
                doc.y
              )
              .strokeColor("#e0e0e0")
              .stroke();

            doc.moveDown();
          }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | PAYMENT DETAILS
      |--------------------------------------------------------------------------
      */

      if (doc.y > 610) {
        doc.addPage();
      }

      addSectionTitle(
        "Payment Details"
      );

      doc.fontSize(10.5);

      addField(
        "Total Members",
        registration.totalMembers
      );

      addField(
        "Fee Per Person",
        "Rs. 50"
      );

      addField(
        "Total Amount",
        `Rs. ${registration.amount}`
      );

      addField(
        "Transaction ID / UTR",
        registration.payment
          ?.transactionId
      );

      addField(
        "Payment Status",
        registration.payment
          ?.status
      );

      // addField(
      //   "Registration Status",
      //   registration.registrationStatus
      // );

      // addField(
      //   "Payment Screenshot",
      //   registration.payment
      //     ?.screenshot
      // );
      if (registration.payment?.screenshot) {
  try {
    const response = await fetch(
      registration.payment.screenshot
    );

    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    doc.moveDown(0.5);

    doc
      .font("Helvetica-Bold")
      .text("Payment Screenshot:");

    doc.moveDown(0.5);

    doc.image(imageBuffer, {
      fit: [250, 250],
    });

    doc.moveDown();
  } catch (error) {
    console.log("Screenshot PDF error:", error);
  }
}

      if (
        registration.payment
          ?.submittedAt
      ) {
        addField(
          "Payment Submitted At",
          new Date(
            registration.payment.submittedAt
          ).toLocaleString("en-IN")
        );
      }

      if (
        registration.payment
          ?.verifiedAt
      ) {
        addField(
          "Payment Verified At",
          new Date(
            registration.payment.verifiedAt
          ).toLocaleString("en-IN")
        );
      }

      if (
        registration.payment
          ?.remarks
      ) {
        addField(
          "Payment Remarks",
          registration.payment.remarks
        );
      }

      /*
      |--------------------------------------------------------------------------
      | SYSTEM DETAILS
      |--------------------------------------------------------------------------
      */

      // addSectionTitle(
      //   "Registration Summary"
      // );

      // addField(
      //   "Conference Registration ID",
      //   registration._id
      // );

      // if (
      //   registration.createdAt
      // ) {
      //   addField(
      //     "Registration Created At",
      //     new Date(
      //       registration.createdAt
      //     ).toLocaleString("en-IN")
      //   );
      // }

      // if (
      //   registration.updatedAt
      // ) {
      //   addField(
      //     "Last Updated At",
      //     new Date(
      //       registration.updatedAt
      //     ).toLocaleString("en-IN")
      //   );
      // }

      // doc.moveDown(2);

      /*
      |--------------------------------------------------------------------------
      | FOOTER
      |--------------------------------------------------------------------------
      */

      // doc
      //   .font("Helvetica")
      //   .fontSize(8.5)
      //   .fillColor("#666666")
      //   .text(
      //     "This document was generated automatically from the ABBS online conference registration system.",
      //     {
      //       align: "center",
      //     }
      //   );

      doc.moveDown(0.3);

      // doc.text(
      //   "Please retain this document for registration and payment verification.",
      //   {
      //     align: "center",
      //   }
      // );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports =
  generateConferenceRegistrationPdf;