import React from 'react';

export const ToolsExpanded = ({
    fabTools,
    selectedTool,
    handleToolClick,
    handleUndo,
    handleRedo,
    handleDelete,
    historyIndex,
    drawingHistory,
    drawingData,
    is3DView
}) => (
    <div className="d-flex align-items-center mb-3 p-2 rounded-pill" style={{
        background: 'rgba(0,0,0,0.85)'
    }}>
        {fabTools.map((tool) => (
            <button
                key={tool.id}
                className={`btn btn-sm rounded-circle me-2 d-flex align-items-center justify-content-center fab-tool ${selectedTool === tool.id ? 'btn-primary' : 'btn-light'}`}
                style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}
                onClick={() => {
                    if (tool.id === 'undo') {
                        handleUndo();
                    } else if (tool.id === 'redo') {
                        handleRedo();
                    } else if (tool.id === 'delete') {
                        handleDelete();
                    } else {
                        handleToolClick(tool.id);
                    }
                }}
                title={tool.label}
                disabled={
                    (tool.id === 'undo' && historyIndex <= 0) ||
                    (tool.id === 'redo' && historyIndex >= drawingHistory.length - 1) ||
                    (tool.id === 'delete' && drawingData.length === 0) ||
                    (tool.id === 'manual' && is3DView)
                }
            >
                {tool.icon}
            </button>
        ))}
    </div>
);