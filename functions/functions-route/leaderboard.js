const admin = require("../firebaseInit");
const { logger } = require("firebase-functions");
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const axios = require("axios");
const {
  fetchScoresInChunks,
  storeLeaderboardData,
  getLeaderboardScores,
} = require("../util/util");

const getFirestore = admin.firestore();
/**
 * Cloud Function to fetch leaderboard data from an external API and store it in Firestore.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - Responds with success or error messages.
 *
 * This function fetches leaderboard data from an external API, processes the associated scores,
 * and stores the results in Firestore. It uses CORS to handle cross-origin requests and logs
 * any errors encountered during the operation.
 */
exports.fetchLeaderboard = onRequest({
  invoker: 'public',
  timeoutSeconds: 540,
}, async (req, res) => {
  return cors(req, res, async () => {
    const startTime = Date.now();
    const TIMEOUT = 10000;
    const timeoutBuffer = 1000;
    const processedStages = [];

    try {
      const response = await axios.get(
        "https://platform.acexr.com/api/1.1/obj/leaderboard", 
        { timeout: 3000 }
      );
      
      if (!response.data?.response?.results) {
        throw new Error("No results found");
      }

      for (const result of response.data.response.results) {
        if (Date.now() - startTime > TIMEOUT - timeoutBuffer) break;

        const scores = await fetchScoresInChunks(result.scores_list_custom_score || []);
        await storeLeaderboardData(result, scores);
        processedStages.push(result.stage_custom_stage);
      }

      res.status(200).json({
        message: "Process completed",
        status: processedStages.length < response.data.response.results.length ? "partial" : "complete",
        processedStages: processedStages.length,
        totalStages: response.data.response.results.length,
        timeElapsed: Date.now() - startTime
      });
    } catch (error) {
      logger.error("Error", { error: error.message });
      res.status(200).json({
        status: "error",
        processedStages: processedStages.length,
        error: error.message,
        timeElapsed: Date.now() - startTime
      });
    }
  });
});

/**
 * Cloud Function to retrieve leaderboard and associated scores from Firestore.
 *
 * @param {Object} req - The HTTP request object containing a `stageId` query parameter.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - Responds with leaderboard data or error messages.
 *
 * This function fetches a leaderboard document from Firestore using the provided `stageId`,
 * retrieves its associated scores, and returns the results. If the `stageId` is missing or
 * the leaderboard does not exist, it responds with appropriate error messages.
 */
exports.getLeaderboard = functions.https.onRequest(
    {
      invoker: "public",
    },
    async (req, res) => {
      return cors(req, res, async () => {
        try {
          const { stageId } = req.query;

          if (!stageId) {
            res.status(400).json({ error: "stageId parameter is required" });
            return;
          }

          const stageDoc = await getFirestore
              .collection("leaderboards")
              .doc(stageId)
              .get();

          if (!stageDoc.exists) {
            res.status(404).json({ error: "Leaderboard not found" });
            return;
          }

          const scores = await getLeaderboardScores(stageDoc);

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
    },
);

/**
 * Cloud Function to retrieve all stage IDs of leaderboards from Firestore.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - Responds with a list of stage IDs or an error message.
 *
 * This function queries Firestore for all leaderboard documents, extracts their IDs,
 * and returns the list along with a count of the total IDs found. It logs any errors
 * encountered during the operation.
 */

exports.getAllStageIds = onRequest(
  {
    invoker: "public",
  },
  async (req, res) => {
    return cors(req, res, async () => {
      try {
        const db = getFirestore();
        const leaderboardsSnapshot = await db
          .collection("leaderboards")
          .get();

        const stageIds = leaderboardsSnapshot.docs.map((doc) => doc.id);

        res.status(200).json({
          stageIds,
          count: stageIds.length,
        });
      } catch (error) {
        logger.error("Error retrieving stage IDs", { error: error.message });
        res.status(500).json({
          error: "Error retrieving stage IDs",
          details: error.message,
        });
      }
    });
  },
);