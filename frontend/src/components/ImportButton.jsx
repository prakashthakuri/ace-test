import React from 'react';
import { Button, Notification } from '@mantine/core';
import { useImportLeaderboard } from '../hooks/useLeaderboardAPI';

const ImportButton = () => {
    const { mutate, isLoading, error, isError } = useImportLeaderboard();

    return (
        <div>
            <Button 
                onClick={() => mutate()} 
                loading={isLoading} 
                variant="filled" 
                color="blue"
            >
                Import Leaderboard
            </Button>
            {isError && (
                <Notification color="red" title="Error" disallowClose>
                    {error.message}
                </Notification>
            )}
        </div>
    );
};

export default ImportButton;
