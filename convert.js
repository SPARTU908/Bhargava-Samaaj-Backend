const csv = require("csvtojson");
const fs = require("fs");

const csvFilePath = "ABBS Life members upto 25.8.2025.csv";


const headers = [
  "sl",
  "duplicate_of",
  "col_x",        
  "lm_no",
  "year",
  "col_y",        
  "member_name",
  "card_issue",
  "add",
  "dob",
  "address1",
  "address_extra",
  "new_col",
  "city",
  "pin",
  "rect_no",
  "amount",
  "contact_no",
  "email",
];

csv({
  noheader: true,
  output: "json"
})
.fromFile(csvFilePath)
.then((jsonArray) => {
  
  const dataRows = jsonArray.slice(2);

  
  const mapped = dataRows.map((row) => {
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = row[`field${idx + 1}`] || "";
    });
    return obj;
  });

  fs.writeFileSync("lifemembers.json", JSON.stringify(mapped, null, 2), "utf-8");
  console.log("✅ Clean JSON created: lifemembers.json");
});




