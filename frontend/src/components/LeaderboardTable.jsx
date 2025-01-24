import React from 'react';
import { Table, Button, Notification } from '@mantine/core';
import { useFetchLeaderboard } from '../hooks/useLeaderboardAPI';

const LeaderboardTable = ({ stageId }) => {
    const { data: scores, isLoading, error, isError, refetch } = useFetchLeaderboard(stageId);

    if (isLoading) return <div>Loading leaderboard...</div>;
    if (isError) {
        return (
            <Notification color="red" title="Error" disallowClose>
                {error.message}
            </Notification>
        );
    }

    return (
        <div>
            <Button onClick={refetch} variant="outline" color="blue" style={{ marginBottom: '1rem' }}>
                Refresh Leaderboard
            </Button>
            <Table striped highlightOnHover>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Display Name</th>
                        <th>Hit Factor</th>
                        <th>Time (s)</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {scores?.map((score, index) => (
                        <tr key={index}>
                            <td>{score.rank}</td>
                            <td>{score.displayname}</td>
                            <td>{score.hitFactor}</td>
                            <td>{score.timeInSeconds}</td>
                        </tr>
                    ))} */}
                </tbody>
            </Table>
        </div>
    );
};

export default LeaderboardTable;
