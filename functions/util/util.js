const axios = require("axios");
const { getFirestore } = require("firebase-admin/firestore");


/**
 * Fetches scores in chunks from an external API.
 * @param {Array<string>} scoreIds - An array of score IDs to fetch.
 * @return {Promise<Array<Object>>} - A promise that resolves to an array of score objects.
 * The function splits the input array of score IDs into chunks (default size: 50).
 * It then makes API requests for each chunk to fetch the corresponding scores
 * and returns the aggregated results.
 */
async function fetchScoresInChunks(scoreIds) {
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

  return scores;
}

/**
 * Stores leaderboard data and associated scores in Firestore.
 *
 * @param {Object} leaderboard - The leaderboard object containing stage details.
 * @param {string} leaderboard.stageid_text - The stage ID.
 * @param {string} leaderboard.stagename_text - The name of the stage.
 * @param {number} leaderboard.threshold_number - The threshold score for the stage.
 * @param {Array<Object>} scores - An array of score objects to store.
 * @return {Promise<void>} - A promise that resolves when the data is successfully stored.
 *
 * The function first saves the leaderboard details in Firestore. It then uses a batch
 * operation to store the associated scores under the leaderboard document.
 */
async function storeLeaderboardData(leaderboard, scores) {
  const stageDoc = getFirestore()
      .collection("leaderboards")
      .doc(leaderboard.stageid_text);

  await stageDoc.set({
    stageName: leaderboard.stagename_text,
    threshold: leaderboard.threshold_number,
  });

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
}

/**
 * Retrieves and formats leaderboard scores from Firestore.
 *
 * @param {Object} stageDoc - A Firestore document reference representing the stage.
 * @return {Promise<Array<Object>>} - A promise that resolves to an array of formatted score objects.
 *
 * The function queries the "scores" subcollection of the specified stage document,
 * orders the scores by the `hitFactor` field in descending order, and limits the
 * results to the top 100 scores. It then formats and returns the retrieved scores.
 */
async function getLeaderboardScores(stageDoc) {
  const scoresSnapshot = await stageDoc.ref
      .collection("scores")
      .orderBy("hitFactor", "desc")
      .limit(100)
      .get();

  return scoresSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

module.exports = {
  fetchScoresInChunks,
  storeLeaderboardData,
  getLeaderboardScores,
};
