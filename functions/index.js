/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

exports.fetchLeaderboard = functions.https.onRequest(async (req, res) => {
  const leaderboardApiUrl =
    "https://platform.acexr.com/api/1.1/obj/leaderboard/1702862655868x214682417459388640";

  try {
    // Fetch leaderboard data
    const response = await axios.get(leaderboardApiUrl);
    console.log("API Response:", JSON.stringify(response.data, null, 2));
    const leaderboard = response.data.response;

    // Check if leaderboard data exists
    if (!leaderboard || !leaderboard.scores_list_custom_score) {
      throw new Error("Leaderboard data or scores list is missing");
    }

    // Fetch scores in smaller chunks to avoid large query strings
    const scoreIds = leaderboard.scores_list_custom_score;
    const chunkSize = 50; // Adjust based on API limits
    const scoreChunks = [];
    for (let i = 0; i < scoreIds.length; i += chunkSize) {
      scoreChunks.push(scoreIds.slice(i, i + chunkSize));
    }

    const scores = [];
    for (const chunk of scoreChunks) {
      const scoresApiUrl = `https://platform.acexr.com/api/1.1/obj/score?constraints=[{"key":"_id","constraint_type":"in","value":[${chunk
          .map((id) => `"${id}"`)
          .join(",")}]}]`;
      const scoreResponse = await axios.get(scoresApiUrl);
      scores.push(...scoreResponse.data.response.results);
    }

    // Store leaderboard data in Firestore
    const stageDoc = db
        .collection("leaderboards")
        .doc(leaderboard.stageid_text);
    await stageDoc.set({
      stageName: leaderboard.stagename_text,
      threshold: leaderboard.threshold_number,
    });

    const batch = db.batch();
    scores.forEach((score) => {
      const scoreRef = stageDoc.collection("scores").doc(score._id);
      batch.set(scoreRef, {
        displayname: score.displayname_text,
        hitFactor: score.hitfactor_number,
        rank: score.acerank_option_rank,
        timeInSeconds: score.timeinseconds_number,
      });
    });

    await batch.commit();
    res.status(200).send("Leaderboard data fetched and stored successfully.");
  } catch (error) {
    console.error("Error fetching leaderboard data:", error.stack);
    res.status(500).send("Error fetching leaderboard data.");
  }
});

exports.getLeaderboard = functions.https.onRequest(async (req, res) => {
  const stageId = req.query.stageId;
  if (!stageId) {
    res.status(400).send("stageId query parameter is required");
    return;
  }

  try {
    const leaderboardRef = db.collection("leaderboards").doc(stageId);
    const leaderboardDoc = await leaderboardRef.get();

    if (!leaderboardDoc.exists) {
      res.status(404).send("Leaderboard not found");
      return;
    }

    const scoresSnapshot = await leaderboardRef
        .collection("scores")
        .orderBy("hitFactor", "desc")
        .get();

    const scores = scoresSnapshot.docs.map((doc) => doc.data());
    res.status(200).json({
      stageInfo: leaderboardDoc.data(),
      scores,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Failed to retrieve leaderboard data");
  }
});
