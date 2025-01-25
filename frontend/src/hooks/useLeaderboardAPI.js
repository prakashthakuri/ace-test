import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

// Generic function to fetch leaderboard data
const fetchLeaderboard = async ({ queryKey }) => {
  const [, stageId] = queryKey; // Extract the stageId from the queryKey
  const response = await axios.get(
    `${BASE_API_URL}/getLeaderboard?stageId=${stageId}`
  );
  return response.data;
};

// Generic function to import leaderboard data
const importLeaderboard = async () => {
  const response = await axios.get(`${BASE_API_URL}/fetchLeaderboard`);
  return response.data;
};

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
export const useImportLeaderboard = () => {
  const [toastMessage, setToastMessage] = useState(null);
  const queryClient = useQueryClient();
  const {mutate, isPending} = useMutation({
    mutationFn: importLeaderboard,
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
