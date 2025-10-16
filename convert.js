const csv = require("csvtojson");
const fs = require("fs");

const csvFilePath = "ABBS Life members - Adhiveshan 2025 registration.csv";


const headers = [
  "SL",
  "Col_x",
  "LM_NO",
  "Year",
  "Title",        
  "Member_Name",
  "Card_Issued",
  "S_O_D_O_W_0",
  "Date_of_Birth",
  "Address",
  "City",
  "Pin",
  "Contact_No",
  "Email",
  "Gotra",
  "Kuldevi",
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

  fs.writeFileSync("newlifemembers.json", JSON.stringify(mapped, null, 2), "utf-8");
  console.log("✅ Clean JSON created: newlifemembers.json");
});




