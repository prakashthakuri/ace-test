const axios = require("axios");
const { getFirestore } = require("firebase-admin/firestore");
const {
  fetchScoresInChunks,
  storeLeaderboardData,
} = require("../../util/util");


jest.mock("axios");
jest.mock("firebase-admin/firestore");

describe("Utility Functions", () => {
  let mockFirestore;

  beforeEach(() => {
    mockFirestore = {
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          set: jest.fn(),
          collection: jest.fn(() => ({
            doc: jest.fn(() => ({
              set: jest.fn(),
            })),
          })),
        })),
      })),
      batch: jest.fn(() => ({
        set: jest.fn(),
        commit: jest.fn().mockResolvedValue(),
      })),
    };

    getFirestore.mockReturnValue(mockFirestore);
    jest.clearAllMocks();
  });

  describe("fetchScoresInChunks", () => {
    it("should fetch scores in chunks", async () => {
      const mockResponse = {
        data: {
          response: {
            results: [
              { _id: "score1", score: 100 },
              { _id: "score2", score: 200 },
            ],
          },
        },
      };

      axios.get.mockResolvedValue(mockResponse);

      const scoreIds = ["score1", "score2", "score3"];
      const scores = await fetchScoresInChunks(scoreIds);

      expect(scores).toHaveLength(2);
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it("should handle empty score list", async () => {
      const scores = await fetchScoresInChunks([]);
      expect(scores).toHaveLength(0);
    });

    it("should throw an error for API failures", async () => {
      axios.get.mockRejectedValue(new Error("API Error"));
      await expect(fetchScoresInChunks(["score1"])).rejects.toThrow("API Error");
    });
  });

  describe("storeLeaderboardData", () => {
    const mockLeaderboard = {
      stageid_text: "stage-1",
      stagename_text: "Test Stage",
      threshold_number: 100,
    };

    const mockScores = [
      {
        _id: "score1",
        displayname_text: "Player 1",
        hitfactor_number: 10,
        acerank_option_rank: 1,
        timeinseconds_number: 60,
      },
    ];

    it("should store leaderboard data successfully", async () => {
      const mockBatch = {
        set: jest.fn(),
        commit: jest.fn().mockResolvedValue(),
      };

      mockFirestore.batch.mockReturnValue(mockBatch);

      await storeLeaderboardData(mockLeaderboard, mockScores);

      expect(mockFirestore.collection).toHaveBeenCalledWith("leaderboards");
      expect(mockBatch.set).toHaveBeenCalledTimes(1);
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("should handle empty scores array", async () => {
      const mockBatch = {
        set: jest.fn(),
        commit: jest.fn().mockResolvedValue(),
      };

      mockFirestore.batch.mockReturnValue(mockBatch);

      await storeLeaderboardData(mockLeaderboard, []);
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("should throw an error for Firestore failures", async () => {
      mockFirestore.collection.mockImplementation(() => {
        throw new Error("Firestore Error");
      });

      await expect(
          storeLeaderboardData(mockLeaderboard, mockScores)).rejects.toThrow("Firestore Error");
    });
  });
});
