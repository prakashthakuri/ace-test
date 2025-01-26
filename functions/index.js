/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
/* eslint-disable */

const functions = require("firebase-functions");
const logger = require("firebase-functions/logger");
const leaderboardFunctions = require("./functions-route/leaderboard");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const cors = require('cors')({origin: true});
const axios = require("axios");
initializeApp();
const db = getFirestore();
exports.fetchLeaderboard = functions.https.onRequest(
  {
    invoker: "public",
  },
  async (req, res) => {
    return cors(req, res, async () => {
      const leaderboardApiUrl =
      "https://platform.acexr.com/api/1.1/obj/leaderboard";

      try {
        const response = await axios.get(leaderboardApiUrl);
        const leaderboard = response.data.response;

        if (!leaderboard.scores_list_custom_score) {
          throw new Error("Leaderboard data or scores list is missing");
        }

        logger.info("Fetched leaderboard data", {
          leaderboardId: leaderboard._id,
        });

        const scores = await fetchScoresInChunks(
            leaderboard.scores_list_custom_score,
        );
        await storeLeaderboardData(leaderboard, scores);

        res.status(200).json({
          message: "Leaderboard data fetched and stored successfully",
          scoresCount: scores.length,
        });
      } catch (error) {
        logger.error("Error fetching leaderboard data", {
          error: error.message,
        });
        res.status(500).json({
          error: "Error fetching leaderboard data",
          details: error.message,
        });
      }
    });
  },
);


// exports.fetchLeaderboard = leaderboardFunctions.fetchLeaderboard;
// exports.getLeaderboard = leaderboardFunctions.getLeaderboard;
// exports.getAllStageIds = leaderboardFunctions.getAllStageIds;
