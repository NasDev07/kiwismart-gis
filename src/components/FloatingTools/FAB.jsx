import React from 'react';

export const FAB = ({ fabExpanded, setFabExpanded }) => (
    <button
        className="btn btn-secondary rounded-circle d-flex align-items-center justify-content-center shadow fab-tool"
        style={{ width: '56px', height: '56px', fontSize: '1.5rem' }}
        onClick={() => setFabExpanded(!fabExpanded)}
    >
        {fabExpanded ? '✕' : '🔧'}
    </button>
);