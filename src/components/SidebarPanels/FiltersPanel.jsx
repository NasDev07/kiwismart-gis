import React from 'react';

export const FiltersPanel = ({ 
    is3DView, 
    labelData, 
    cameraDistance, 
    zoomLevel, 
    handleToolClick, 
    showBuildingOutlines, 
    setShowBuildingOutlines, 
    t 
}) => (
    <div>
        <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>View Mode:</strong>
                <span className={`badge bg-${is3DView ? 'success' : 'secondary'}`}>
                    {is3DView ? '3D Active' : '2D Active'}
                </span>
            </div>
            <div className="small">
                <div>Buildings: <span className="badge bg-info">{labelData.length}</span></div>
                <div>View: <span className="badge bg-primary">{is3DView ? '3D Scene' : '2D Map'}</span></div>
                <div>Zoom: <span className="badge bg-secondary">
                    {is3DView ? `${Math.round(cameraDistance)}m` : `${zoomLevel}%`}
                </span></div>
                <div>Drawing: <span className={`badge bg-${is3DView ? 'warning' : 'success'}`}>
                    {is3DView ? 'Disabled in 3D' : 'Enabled'}
                </span></div>
                {is3DView && (
                    <div>Camera: <span className="badge bg-info">
                        Interactive
                    </span></div>
                )}
            </div>
        </div>
        <hr />
        <div className="mb-3">
            <strong>Building Statistics:</strong>
            <div className="mt-2">
                <div className="d-flex justify-content-between">
                    <span>🏠 Residential:</span>
                    <span className="badge bg-success">
                        {labelData.filter(b => b.buildingType === 'residential').length}
                    </span>
                </div>
                <div className="d-flex justify-content-between mt-1">
                    <span>🏢 Commercial:</span>
                    <span className="badge bg-primary">
                        {labelData.filter(b => b.buildingType === 'commercial').length}
                    </span>
                </div>
                <div className="d-flex justify-content-between mt-1">
                    <span>🏭 Industrial:</span>
                    <span className="badge bg-warning">
                        {labelData.filter(b => b.buildingType === 'industrial').length}
                    </span>
                </div>
            </div>
        </div>
        <div className="mb-3">
            <label className="form-label">{t.buildingType}</label>
            <select className="form-select form-select-sm">
                <option>{t.all}</option>
                <option>{t.residential}</option>
                <option>{t.commercial}</option>
                <option>{t.industrial}</option>
            </select>
        </div>
        {is3DView && (
            <div className="mt-3">
                <button 
                    className="btn btn-warning btn-sm w-100 mb-2"
                    onClick={() => handleToolClick('reset')}
                >
                    🔄 {t.resetCamera}
                </button>
                <button 
                    className="btn btn-info btn-sm w-100"
                    onClick={() => setShowBuildingOutlines(!showBuildingOutlines)}
                >
                    📋 {showBuildingOutlines ? 'Hide' : 'Show'} Building Info
                </button>
            </div>
        )}
    </div>
);