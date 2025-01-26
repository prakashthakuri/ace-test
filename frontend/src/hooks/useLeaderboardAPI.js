import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

/**
 * @description Fetches leaderboard data for a specific stage
 * @param {Object} param - Query key object
 * @param {Array} param.queryKey - Array containing the query key and stageId
 * @returns {Promise<Object>} Leaderboard data including stage info and scores
 */
const fetchLeaderboard = async ({ queryKey }) => {
  const [, stageId] = queryKey; // Extract the stageId from the queryKey
  const response = await axios.get(
    `${BASE_API_URL}/getLeaderboard?stageId=${stageId}`
  );
  return response.data;
};

/**
 * @description Imports leaderboard data from external API
 * @returns {Promise<Object>} Import status and processed stages count
 */
const importLeaderboard = async () => {
  const response = await axios.get(`${BASE_API_URL}/fetchLeaderboard`);
  return response.data;
};

/**
 * @description Fetches all available stage IDs
 * @returns {Promise<Object>} List of stage IDs and total count
 */
const fetchStageIds = async () => {
  const response = await axios.get(`${BASE_API_URL}/getAllStageIds`);
  return response.data;
};


/**
 * Custom hook for fetching leaderboard data
 * @param {string} stageId - ID of the stage to fetch
 * @returns {Object} Leaderboard data, loading state, error state, and refetch function
 * @property {Object} data - Leaderboard data
 * @property {boolean} isFetching - Loading state
 * @property {Object} error - Error object if request fails
 * @property {Function} refetch - Function to manually refetch data
 * @property {boolean} isError - Error state
 */
export const useFetchLeaderboard = (stageId) => {
  const { data, isFetching, error, refetch, isError } = useQuery({
    queryKey: ["leaderboard", stageId],
    queryFn: fetchLeaderboard,
    enabled: !!stageId,
    staleTime: 60000,
  });

  return {
    data,
    isFetching,
    error,
    refetch,
    isError,
  };
};

/**
 * Custom hook for importing leaderboard data
 * @returns {Object} Mutation function, loading state, and toast message
 * @property {Function} mutate - Function to trigger import
 * @property {boolean} isPending - Loading state
 * @property {Object} toastMessage - Toast notification state
 */
export const useImportLeaderboard = () => {
  const [toastMessage, setToastMessage] = useState(null);
  const queryClient = useQueryClient();
  const {mutate, isPending} = useMutation({
    mutationFn: importLeaderboard,
    onMutate: () => {
      setToastMessage({
        message: "Your data is being imported",
        type: "info"
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["leaderboard"]);
      console.log(data)
      setToastMessage({
        message: data?.message || "Leaderboard is stored successfully!",
        type: "success",
      });
      console.log(toastMessage)
      setTimeout(() => setToastMessage(null), 3000);
    },
    onError: (e) => {
      setToastMessage({
        message: e?.message || "Failed to import leaderboard!",
        type: "success",
      });
      setTimeout(() => setToastMessage(null), 3000);
    },
  });
  return {
    mutate,
    isPending,
    toastMessage,
  };
};


/**
 * Custom hook for fetching all stage IDs
 * @returns {Object} Stage IDs data and loading state
 * @property {Object} data - Stage IDs and count
 * @property {boolean} isFetching - Loading state
 */
export const useStageIds = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["stageIds"],
    queryFn: fetchStageIds
  });
  return { data, isFetching };
};