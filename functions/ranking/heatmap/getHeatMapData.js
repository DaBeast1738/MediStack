const admin = require("firebase-admin");
const express = require("express");
const app = express();

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

// Mapping symptoms to body regions
const symptomToRegion = {
  "cough": "lungs",
  "fever": "body",
  "chest pain": "heart",
  "headache": "head",
  "stomach pain": "stomach",
};

// API to fetch heatmap data
app.get("/getHeatmapData", async (req, res) => {
  try {
    const submissionsRef = db.collection("submissions").orderBy("createdAt", "desc").limit(10);
    const snapshot = await submissionsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No symptoms found" });
    }

    let heatmapData = { head: 0, lungs: 0, heart: 0, stomach: 0, body: 0 };

    snapshot.forEach((doc) => {
      const symptoms = doc.data().symptoms || [];
      symptoms.forEach((symptom) => {
        if (symptomToRegion[symptom.toLowerCase()]) {
          heatmapData[symptomToRegion[symptom.toLowerCase()]] += 1;
        }
      });
    });

    res.json(heatmapData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server (for local testing)
app.listen(3000, () => console.log("Heatmap API running on port 3000"));