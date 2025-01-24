import React from 'react';
import { Container, Title } from '@mantine/core';
import './App.css'
import ImportButton from './components/ImportButton';
import LeaderboardTable from './components/LeaderboardTable';

function App() {
  const stageId = '1702862654102x427489097778987000'; 
  return (
    <Container>
        <Title order={1} align="center" style={{ marginBottom: '2rem' }}>
            Leaderboard
        </Title>
        <ImportButton />
        <LeaderboardTable stageId={stageId} />
    </Container>
);
}

export default App
