const admin = require("firebase-admin");
const fs = require("fs");


const db = admin.firestore();

// ✅ Use absolute path for the JSON file
const filePath = __dirname + "/diagnoses.json";

// ✅ Read and parse the JSON data
const data = JSON.parse(fs.readFileSync(filePath));

/**
 * Imports test data into Firestore.
 * @async
 * @function importData
 * @return {Promise<void>} A promise that resolves once the data is inserted.
 */
async function importData() {
  const batch = db.batch();

  data.forEach((item) => {
    const docRef = db.collection("doctor_diagnoses").doc();
    batch.set(docRef, item);
  });

  await batch.commit();
  console.log("✅ Data imported successfully.");
}

importData().catch(console.error);
