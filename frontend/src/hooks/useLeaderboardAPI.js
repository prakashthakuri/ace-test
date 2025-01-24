import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

const BASE_API_URL = 'https://us-central1-ace-leaderboard.cloudfunctions.net';



// Generic function to fetch leaderboard data
const fetchLeaderboard = async ({ queryKey }) => {
  const [, stageId] = queryKey; // Extract the stageId from the queryKey
  const response = await axios.get(`${BASE_API_URL}/getLeaderboard?stageId=${stageId}`);
  return response.data;
};

// Generic function to import leaderboard data
const importLeaderboard = async () => {
  const response = await axios.get(`${BASE_API_URL}/fetchLeaderboard`);
  return response.data;
};


// Custom hook to fetch leaderboard data
export const useFetchLeaderboard = (stageId) => {
  const { data, isLoading, error, refetch, isError } = useQuery({
      queryKey: ['leaderboard', stageId],
      queryFn: fetchLeaderboard,
      enabled: !!stageId, // Only fetch if stageId exists
      staleTime: 60000,   // Cache data for 1 minute
  });

  return {
      data,
      isLoading,
      error,
      refetch,
      isError,
  };
};
// Custom hook to handle importing leaderboard data
export const useImportLeaderboard = () => {
  const [error, setError] =useState(null)
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
      mutationFn: importLeaderboard,
      onSuccess: () => {
          queryClient.invalidateQueries(['leaderboard']); // Invalidate all leaderboard caches
      },
      onError: (e) => {
        setError(e)
      }
  });

  return {
      mutate,
      isLoading,
      error,
  };
};

