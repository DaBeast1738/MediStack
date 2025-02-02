const admin = require("firebase-admin");

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * 🏥 Ranking Algorithm
 * Automatically updates the ranking collection based on votes.
 */
async function updateRankings() {
  try {
    const snapshot = await db.collection("doctor_diagnoses").get();
    const rankings = snapshot.docs.map((doc) => {
      const data = doc.data();
      const voteSum = data.votes ? data.votes.reduce((s, v) => s + v, 0) : 0;
      return {
        diagnosisId: doc.id,
        confirmedDiagnosis: data.confirmedDiagnosis,
        voteSum,
      };
    });

    // Sort by total votes in descending order
    const sortedRankings = rankings.sort((a, b) => b.voteSum - a.voteSum);

    // Store rankings in Firestore
    await db.collection("rankings").doc("latest").set({
      rankings: sortedRankings,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("✅ Rankings updated successfully.");
  } catch (error) {
    console.error("Error updating rankings:", error);
  }
}

// Export the function so it can be called from index.js
module.exports = {updateRankings};
