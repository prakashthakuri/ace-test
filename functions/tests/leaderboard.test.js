const { getFirestore } = require("firebase-admin/firestore");
const axios = require("axios");
const { fetchLeaderboard, getLeaderboard, getAllStageIds } = require("../functions-route/leaderboard");
const { onRequest } = require("firebase-functions/v2/https");

jest.mock("firebase-functions/v2/https", () => ({
  onRequest: jest.fn((config, handler) => handler)
}));
jest.mock("axios");
jest.mock("firebase-admin/firestore");
jest.mock("cors", () => jest.fn((options) => (req, res, next) => next()));
jest.mock("firebase-functions/v2/https", () => ({
  onRequest: jest.fn((config, handler) => handler),
}));
jest.mock("firebase-functions", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));
const leaderboard = require("../functions-route/leaderboard");
describe("Leaderboard Functions", () => {
  let mockFirestore;

  beforeEach(() => {
    mockFirestore = {
      collection: jest.fn(),
      batch: jest.fn(() => ({
        set: jest.fn(),
        commit: jest.fn().mockResolvedValue(null),
      })),
    };
    getFirestore.mockReturnValue(mockFirestore);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });
  describe("fetchLeaderboard", () => {
    it("should handle timeout and return partial results", async () => {
      const TIMEOUT = 10000; // Add this line
      const mockResults = Array(100).fill().map((_, i) => ({
        _id: `test-${i}`,
        stage_custom_stage: `stage-${i}`,
        scores_list_custom_score: [`score${i}`],
      }));
    
      axios.get.mockResolvedValueOnce({
        data: {
          response: {
            results: mockResults,
          },
        },
      });
    
      const req = { method: "GET", headers: {}, get: () => null };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        set: jest.fn(),
      };
    
      jest.advanceTimersByTime(TIMEOUT - 1000);
      await leaderboard.fetchLeaderboard(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
    
  });
  

  describe("getLeaderboard", () => {
    it("should return 400 if stageId is missing", async () => {
      const req = {
        method: "GET",
        query: {},
        headers: {},
        get: () => null,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        set: jest.fn(),
      };

      await getLeaderboard(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "stageId parameter is required",
      });
    });

    it("should return 500 if leaderboard not found", async () => {
      const mockStageDoc = {
        exists: false,
      };

      mockFirestore.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ exists: false }), // Fix here
        }),
      });
      

      const req = {
        method: "GET",
        query: { stageId: "non-existent" },
        headers: {},
        get: () => null,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        set: jest.fn(),
      };

      await getLeaderboard(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("should handle Firestore errors", async () => {
      mockFirestore.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockRejectedValue(new Error("Firestore Error")),
        }),
      });

      const req = {
        method: "GET",
        query: { stageId: "stage-1" },
        headers: {},
        get: () => null,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        set: jest.fn(),
      };

      await getLeaderboard(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            error: "Error retrieving leaderboard data",
          }),
      );
    });
  });

  describe("getAllStageIds", () => {

    it("should handle Firestore errors", async () => {
      mockFirestore.collection.mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error("Firestore Error")),
      });

      const req = {
        method: "GET",
        headers: {},
        get: () => null,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        set: jest.fn(),
      };

      await getAllStageIds(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            error: "Error retrieving stage IDs",
          }),
      );
    });
  });
});
