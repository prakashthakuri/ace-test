import React from 'react';
import { Paper, Stack, Container, Title } from '@mantine/core';
import './App.css'
import ImportButton from './components/ImportButton';
import LeaderboardTable from './components/LeaderboardTable';

function App() {
  const stageId = '1702862654102x427489097778987000'; 
  return (
    <Container size="lg" padding="md">
    <Paper shadow="sm" radius="md" withBorder padding="xl" className="app-paper">
      <Stack align="center" spacing="lg">
        <Title order={1} className="app-title">
          Leaderboard
        </Title>
        <ImportButton />
        <LeaderboardTable stageId={stageId} />
      </Stack>
    </Paper>
  </Container>
);
}

export default App
