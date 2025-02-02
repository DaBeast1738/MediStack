const functions = require("firebase-functions");
const admin = require("firebase-admin");


const db = admin.firestore();

/**
 * Submit a vote (either upvote or downvote) for a diagnosis.
 */
exports.submitVote = functions.https.onRequest(async (req, res) => {
  try {
    const {diagnosisId, vote} = req.body;

    // Ensure the vote is either 1 (upvote) or -1 (downvote)
    if (!diagnosisId || (vote !== 1 && vote !== -1)) {
      return res.status(400).json({error: "Invalid input"});
    }

    const diagnosisRef = db.collection("doctor_diagnoses").doc(diagnosisId);
    const diagnosisDoc = await diagnosisRef.get();

    if (!diagnosisDoc.exists) {
      return res.status(404).json({error: "Diagnosis not found"});
    }

    const diagnosisData = diagnosisDoc.data();
    const updatedVotes = [...(diagnosisData.votes || []), vote];

    // Update votes array in Firestore
    await diagnosisRef.update({votes: updatedVotes});

    // Trigger ranking update
    await updateRankings();

    res.json({message: "Vote submitted successfully, rankings updated"});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({error: "Internal server error"});
  }
});

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
