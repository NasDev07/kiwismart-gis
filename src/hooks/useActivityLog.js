import { useCallback } from 'react';

export const useActivityLog = ({ setActivityLogs }) => {
    const addActivityLog = useCallback((action, type) => {
        const newLog = {
            id: Date.now(),
            action,
            timestamp: new Date().toLocaleString(),
            type
        };
        setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]);
    }, [setActivityLogs]);

    return { addActivityLog };
};