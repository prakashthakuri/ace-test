export const getRankColor = (rank) => {
  const colors = {
    Diamond: "bg-blue-700 text-white border-blue-500",
    Platinum: "bg-purple-700 text-white border-purple-500",
    Gold: "bg-yellow-700 text-white border-yellow-500",
    Silver: "bg-gray-600 text-white border-gray-400",
    Bronze: "bg-orange-700 text-white border-orange-500",
    Steel: "bg-zinc-700 text-white border-zinc-500",
    Ace: "bg-green-700 text-white border-green-500",
  };
  return colors[rank] || "bg-gray-700 text-white border-gray-400";
};

export const formatTime = (timeInSeconds) => {
  if (timeInSeconds >= 60) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = (timeInSeconds % 60).toFixed(1);
    return `${minutes}m ${seconds}s`;
  }
  return `${(timeInSeconds * 100).toFixed(1)}s`;
};
