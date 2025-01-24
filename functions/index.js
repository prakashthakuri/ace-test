/* eslint-disable */
const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const cors = require('cors')({origin: true});
const axios = require("axios");

initializeApp();
const db = getFirestore();

// This works
exports.addmessage = onRequest(async (req, res) => {
  const original = req.query.text;
  const writeResult = await getFirestore()
      .collection("messages")
      .add({original: original});
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

// Aligned fetchLeaderboard with same pattern
exports.fetchLeaderboard = onRequest({
  invoker: 'public'
},async (req, res) => {
  return cors(req, res, async () => {
    const leaderboardApiUrl =
      "https://platform.acexr.com/api/1.1/obj/leaderboard/1702862655868x214682417459388640";

    try {
      // Step 1: Fetch leaderboard data
      const response = await axios.get(leaderboardApiUrl);
      const leaderboard = response.data.response;

      if (!leaderboard || !leaderboard.scores_list_custom_score) {
        throw new Error("Leaderboard data or scores list is missing");
      }

      logger.info("Fetched leaderboard data", {
        leaderboardId: leaderboard._id,
      });

      const scoreIds = leaderboard.scores_list_custom_score;
      const chunkSize = 50;
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

      // Use getFirestore() instead of db
      const stageDoc = getFirestore()
        .collection("leaderboards")
        .doc(leaderboard.stageid_text);
      
      await stageDoc.set({
        stageName: leaderboard.stagename_text,
        threshold: leaderboard.threshold_number,
      });

      // Use batch from getFirestore()
      const batch = getFirestore().batch();
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
      res.status(200).json({
        message: "Leaderboard data fetched and stored successfully",
        scoresCount: scores.length
      });
    } catch (error) {
      logger.error("Error fetching leaderboard data", { error: error.message });
      res.status(500).json({
        error: "Error fetching leaderboard data",
        details: error.message
      });
    }
});
});

// Aligned getLeaderboard with same pattern
exports.getLeaderboard = onRequest({
  invoker: 'public'
}, async (req, res) => {
  return cors(req, res, async () => {

  try {
    const stageId = req.query.stageId;

    if (!stageId) {
      res.status(400).json({ error: "stageId parameter is required" });
      return;
    }

    // Use getFirestore() instead of db
    const stageDoc = await getFirestore()
      .collection("leaderboards")
      .doc(stageId)
      .get();

    if (!stageDoc.exists) {
      res.status(404).json({ error: "Leaderboard not found" });
      return;
    }

    const scoresSnapshot = await stageDoc.ref
      .collection("scores")
      .orderBy("hitFactor", "desc")
      .limit(100)
      .get();

    const scores = scoresSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      stage: stageDoc.data(),
      scores,
    });
  } catch (error) {
    logger.error("Error retrieving leaderboard", { error: error.message });
    res.status(500).json({
      error: "Error retrieving leaderboard data",
      details: error.message,
    });
  }
});
});