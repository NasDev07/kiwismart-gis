import React from 'react';

export const ViewMenu = ({ 
    activeDropdown, 
    setActiveDropdown, 
    handleMenuClick, 
    handleToolClick, 
    is3DView, 
    t 
}) => (
    <div className="dropdown me-3">
        <button
            className="btn btn-dark btn-sm dropdown-toggle border-0"
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'view' ? null : 'view')}
        >
            {t.view}
        </button>
        {activeDropdown === 'view' && (
            <div className="dropdown-menu show position-absolute" style={{ zIndex: 1050 }}>
                <button className="dropdown-item" onClick={() => handleMenuClick('zoomIn')}>
                    🔍 {t.zoomIn}
                </button>
                <button className="dropdown-item" onClick={() => handleMenuClick('zoomOut')}>
                    🔍 {t.zoomOut}
                </button>
                <button className="dropdown-item" onClick={() => handleMenuClick('fullScreen')}>
                    ⛶ {t.fullScreen}
                </button>
                <button className="dropdown-item" onClick={() => handleToolClick('3d')}>
                    📐 {t.toggle3D}
                </button>
                {is3DView && (
                    <button className="dropdown-item" onClick={() => handleToolClick('reset')}>
                        🔄 {t.resetCamera}
                    </button>
                )}
            </div>
        )}
    </div>
);