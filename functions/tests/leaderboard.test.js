const { getFirestore } = require("firebase-admin/firestore");
const axios = require("axios");
const {
  fetchLeaderboard,
  getLeaderboard,
  getAllStageIds,
} = require("../functions-route/leaderboard");
jest.mock("axios");
jest.mock("firebase-admin/firestore");
jest.mock("cors", () => jest.fn(() => (req, res, next) => next()));
jest.mock("firebase-functions", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

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
  });

  describe("fetchLeaderboard", () => {
    it("should fetch and store leaderboard data successfully", async () => {
      const mockLeaderboardData = {
        data: {
          response: {
            _id: "test-id",
            stageid_text: "stage-1",
            stagename_text: "Test Stage",
            threshold_number: 100,
            scores_list_custom_score: ["score1"],
          },
        },
      };

      const mockScoresData = {
        data: {
          response: {
            results: [
              {
                _id: "score1",
                displayname_text: "Player 1",
                hitfactor_number: 10,
                acerank_option_rank: 1,
                timeinseconds_number: 60,
              },
            ],
          },
        },
      };

      axios.get.mockImplementation((url) => {
        if (url.includes("leaderboard")) {
          return Promise.resolve(mockLeaderboardData);
        }
        return Promise.resolve(mockScoresData);
      });

      const mockCollection = {
        doc: jest.fn().mockReturnThis(),
        collection: jest.fn().mockReturnThis(),
        set: jest.fn().mockResolvedValue(null),
      };

      mockFirestore.collection.mockReturnValue(mockCollection);

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

      await fetchLeaderboard(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Leaderboard data fetched and stored successfully",
            scoresCount: 1,
          }),
      );
    });

    it("should handle missing leaderboard data", async () => {
      axios.get.mockResolvedValue({ data: { response: {} } });

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

      await fetchLeaderboard(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            error: "Error fetching leaderboard data",
          }),
      );
    });

    it("should handle API errors", async () => {
      axios.get.mockRejectedValue(new Error("API Error"));

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

      await fetchLeaderboard(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            error: "Error fetching leaderboard data",
            details: "API Error",
          }),
      );
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

    it("should return 404 if leaderboard not found", async () => {
      const mockStageDoc = {
        exists: false,
      };

      mockFirestore.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(mockStageDoc),
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

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Leaderboard not found",
      });
    });

    it("should return leaderboard data successfully", async () => {
      const mockStageDoc = {
        exists: true,
        data: () => ({
          stageName: "Test Stage",
          threshold: 100,
        }),
        ref: {
          collection: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          get: jest.fn().mockResolvedValue({
            docs: [
              {
                id: "score1",
                data: () => ({
                  displayname: "Player 1",
                  hitFactor: 10,
                }),
              },
            ],
          }),
        },
      };

      mockFirestore.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(mockStageDoc),
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

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        stage: expect.any(Object),
        scores: expect.any(Array),
      });
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
    it("should return all stage IDs successfully", async () => {
      const mockDocs = [{ id: "stage-1" }, { id: "stage-2" }];

      mockFirestore.collection.mockReturnValue({
        get: jest.fn().mockResolvedValue({ docs: mockDocs }),
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

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        stageIds: ["stage-1", "stage-2"],
        count: 2,
      });
    });

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
