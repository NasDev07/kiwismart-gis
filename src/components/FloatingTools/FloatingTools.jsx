import React from 'react';
import { FAB } from './FAB';
import { ToolsExpanded } from './ToolsExpanded';

export const FloatingTools = ({
    fabExpanded,
    setFabExpanded,
    selectedTool,
    fabTools,
    handleToolClick,
    handleUndo,
    handleRedo,
    handleDelete,
    historyIndex,
    drawingHistory,
    drawingData,
    is3DView
}) => (
    <div 
        style={{
            position: 'absolute',
            bottom: '25px',
            right: '20px',
            zIndex: 1001
        }}
    >
        {fabExpanded && (
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
        )}
        <button
            className="btn btn-secondary rounded-circle d-flex align-items-center justify-content-center shadow fab-tool"
            style={{ width: '56px', height: '56px', fontSize: '1.5rem' }}
            onClick={() => setFabExpanded(!fabExpanded)}
        >
            {fabExpanded ? '✕' : '🔧'}
        </button>
    </div>
);