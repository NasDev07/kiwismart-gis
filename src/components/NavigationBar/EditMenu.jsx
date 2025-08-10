import React from 'react';

export const EditMenu = ({ 
    activeDropdown, 
    setActiveDropdown, 
    handleMenuClick, 
    historyIndex, 
    drawingHistory, 
    drawingData, 
    is3DView, 
    t 
}) => (
    <div className="dropdown me-3">
        <button
            className="btn btn-dark btn-sm dropdown-toggle border-0"
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'edit' ? null : 'edit')}
        >
            {t.edit}
        </button>
        {activeDropdown === 'edit' && (
            <div className="dropdown-menu show position-absolute" style={{ zIndex: 1050 }}>
                <button 
                    className="dropdown-item" 
                    onClick={() => handleMenuClick('undo')} 
                    disabled={historyIndex <= 0 || is3DView}
                >
                    ↶ {t.undo}
                </button>
                <button 
                    className="dropdown-item" 
                    onClick={() => handleMenuClick('redo')} 
                    disabled={historyIndex >= drawingHistory.length - 1 || is3DView}
                >
                    ↷ {t.redo}
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => handleMenuClick('cut')} disabled={is3DView}>
                    ✂️ {t.cut}
                </button>
                <button className="dropdown-item" onClick={() => handleMenuClick('copy')} disabled={is3DView}>
                    📋 {t.copy}
                </button>
                <button className="dropdown-item" onClick={() => handleMenuClick('paste')} disabled={is3DView}>
                    📌 {t.paste}
                </button>
                <div className="dropdown-divider"></div>
                <button 
                    className="dropdown-item" 
                    onClick={() => handleMenuClick('delete')} 
                    disabled={drawingData.length === 0 || is3DView}
                >
                    🗑️ {t.delete}
                </button>
            </div>
        )}
    </div>
);