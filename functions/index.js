const leaderboardFunctions = require("./functions-route/leaderboard");

exports.fetchLeaderboard = leaderboardFunctions.fetchLeaderboard;
exports.getLeaderboard = leaderboardFunctions.getLeaderboard;
exports.getAllStageIds = leaderboardFunctions.getAllStageIds;
