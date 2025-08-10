import { useCallback } from 'react';

export const useDrawing = ({
    selectedTool,
    is3DView,
    zoomLevel,
    setIsDrawing,
    setCurrentPath,
    currentPath,
    isDrawing,
    drawingData,
    setDrawingData,
    drawingHistory,
    setDrawingHistory,
    historyIndex,
    setHistoryIndex,
    addActivityLog
}) => {
    const saveToHistory = useCallback((newDrawingData) => {
        const newHistory = drawingHistory.slice(0, historyIndex + 1);
        newHistory.push([...newDrawingData]);
        setDrawingHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [drawingHistory, historyIndex, setDrawingHistory, setHistoryIndex]);

    const handleMouseDown = useCallback((e) => {
        if (selectedTool === 'manual' && !is3DView) {
            setIsDrawing(true);
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / (zoomLevel / 100);
            const y = (e.clientY - rect.top) / (zoomLevel / 100);
            setCurrentPath([{ x, y }]);
        }
    }, [selectedTool, is3DView, zoomLevel, setIsDrawing, setCurrentPath]);

    const handleMouseMove = useCallback((e) => {
        if (isDrawing && selectedTool === 'manual' && !is3DView) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / (zoomLevel / 100);
            const y = (e.clientY - rect.top) / (zoomLevel / 100);
            setCurrentPath(prev => [...prev, { x, y }]);
        }
    }, [isDrawing, selectedTool, is3DView, zoomLevel, setCurrentPath]);

    const handleMouseUp = useCallback(() => {
        if (isDrawing && selectedTool === 'manual' && currentPath.length > 1 && !is3DView) {
            const newDrawing = {
                id: Date.now(),
                path: currentPath,
                tool: selectedTool,
                color: '#ff0000',
                timestamp: new Date().toISOString()
            };
            const newDrawingData = [...drawingData, newDrawing];
            setDrawingData(newDrawingData);
            saveToHistory(newDrawingData);
            addActivityLog('manualDrawingAdded', 'info');
        }
        setIsDrawing(false);
        setCurrentPath([]);
    }, [isDrawing, selectedTool, currentPath, is3DView, drawingData, setDrawingData, saveToHistory, addActivityLog, setIsDrawing, setCurrentPath]);

    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setDrawingData(drawingHistory[historyIndex - 1] || []);
            addActivityLog('undoAction', 'info');
        }
    }, [historyIndex, setHistoryIndex, setDrawingData, drawingHistory, addActivityLog]);

    const handleRedo = useCallback(() => {
        if (historyIndex < drawingHistory.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setDrawingData(drawingHistory[historyIndex + 1]);
            addActivityLog('redoAction', 'info');
        }
    }, [historyIndex, setHistoryIndex, setDrawingData, drawingHistory, addActivityLog]);

    const handleDelete = useCallback(() => {
        if (drawingData.length > 0) {
            const newDrawingData = [];
            setDrawingData(newDrawingData);
            saveToHistory(newDrawingData);
            addActivityLog('allDrawingsDeleted', 'info');
        }
    }, [drawingData, setDrawingData, saveToHistory, addActivityLog]);

    return {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleUndo,
        handleRedo,
        handleDelete
    };
};