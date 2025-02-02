const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {updateRankings} = require("./ranking/ranking");

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * 🏥 Patient Submission API
 * Patients submit symptoms, and the system provides possible diagnoses.
 */
exports.submitPatientSymptoms = functions.https.onRequest(async (req, res) => {
  try {
    const {userId, symptoms} = req.body;

    if (!userId || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({error: "Invalid input"});
    }

    const submissionRef = await db.collection("submissions").add({
      userId,
      symptoms,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({submissionId: submissionRef.id});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({error: "Internal server error"});
  }
});

/**
 * 🏥 Doctor Diagnosis Submission API
 * Doctors submit a confirmed diagnosis for a patient submission.
 */
exports.submitDoctorDiagnosis = functions.https.onRequest(async (req, res) => {
  try {
    const {doctorId, submissionId, confirmedDiagnosis, confidence} = req.body;

    if (
      !doctorId ||
      !submissionId ||
      !confirmedDiagnosis ||
      typeof confidence !== "number"
    ) {
      return res.status(400).json({error: "Invalid input"});
    }

    await db.collection("doctor_diagnoses").add({
      doctorId,
      submissionId,
      confirmedDiagnosis,
      confidence,
      votes: [], // Initialize with an empty votes array
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({message: "Diagnosis submitted successfully"});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({error: "Internal server error"});
  }
});

/**
 * 🔼🔽 Voting API
 * Allows users to upvote or downvote a diagnosis.
 */
exports.submitVote = functions.https.onRequest(async (req, res) => {
  try {
    const {diagnosisId, vote} = req.body;

    // Ensure vote is either 1 (upvote) or -1 (downvote)
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

    await diagnosisRef.update({votes: updatedVotes});

    // Automatically update rankings after a vote
    await updateRankings();

    res.json({message: "Vote submitted successfully, rankings updated"});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({error: "Internal server error"});
  }
});

/**
 * 📊 Ranking Update API
 * Manually trigger ranking updates.
 */
exports.updateRankings = functions.https.onRequest(async (req, res) => {
  try {
    await updateRankings();
    res.json({message: "Rankings updated successfully."});
  } catch (error) {
    console.error("Error updating rankings:", error);
    res.status(500).json({error: "Internal server error"});
  }
});
