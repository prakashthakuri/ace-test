import React from "react";
import { formatTime, getRankColor } from "../util/util";

const TableData = ({ score, position }) => (
  <tr className="hover:bg-gray-200">
    <td className="px-6 py-4 text-lg font-bold text-black">{position}</td>
    <td className="px-6 py-4 text-base font-medium text-black">{score.displayName}</td>
    <td className="px-6 py-4">
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getRankColor(score.rank)}`}>
        {score.rank}
      </span>
    </td>
    <td className="px-6 py-4 text-right font-mono text-black">{score.hitFactor.toFixed(2)}</td>
    <td className="px-6 py-4 text-right font-mono text-black">{formatTime(score.timeInSeconds)}</td>
  </tr>
);

export default TableData;