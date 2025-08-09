import React, { useState } from 'react';

export const View2D = ({
    mapBackground,
    zoomLevel,
    selectedTool,
    drawingData,
    currentPath,
    labelData,
    showBuildingOutlines,
    projectData,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setIsDrawing,
    setCurrentPath,
    t
}) => {
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [showBuildingLabels, setShowBuildingLabels] = useState(true);

    const backgroundStyle = mapBackground ? {
        backgroundImage: `url(${mapBackground})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        width: '100%',
        height: '100%',
    } : {
        background: 'linear-gradient(45deg, #e9ecef 25%, transparent 25%), linear-gradient(-45deg, #e9ecef 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e9ecef 75%), linear-gradient(-45deg, transparent 75%, #e9ecef 75%)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        width: '100%',
        height: '100%'
    };

    const handleBuildingClick = (building, event) => {
        event.stopPropagation();
        setSelectedBuilding(selectedBuilding?.id === building.id ? null : building);
    };

    return (
        <div
            className="h-100 position-relative d-flex align-items-center justify-content-center view-transition"
            style={{
                ...backgroundStyle,
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'center',
                transition: 'transform 0.3s ease-in-out',
                cursor: selectedTool === 'manual' ? 'crosshair' : selectedTool === 'delete' ? 'not-allowed' : 'default',
                overflow: 'hidden'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
                setIsDrawing(false);
                setCurrentPath([]);
            }}
            onClick={() => setSelectedBuilding(null)}
        >
            {!mapBackground && (
                <div className="text-center text-muted">
                    <div style={{ fontSize: '4rem' }}>📍</div>
                    <h4>{t.satelliteMapView || 'Map View'}</h4>
                    {projectData && (
                        <div className="mt-3">
                            <small className="badge bg-primary">{projectData.name}</small>
                        </div>
                    )}
                </div>
            )}

            {/* IMPROVED: Better building overlays */}
            {mapBackground && labelData && labelData.length > 0 && showBuildingLabels && (
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ pointerEvents: 'auto' }}>
                    {labelData.map((building) => {
                        const relativeX = (building.bounds.x / 1000) * 100;
                        const relativeY = (building.bounds.y / 1000) * 100;
                        const relativeWidth = (building.bounds.width / 1000) * 100;
                        const relativeHeight = (building.bounds.height / 1000) * 100;

                        const isSelected = selectedBuilding?.id === building.id;

                        return (
                            <div
                                key={building.id}
                                className="position-absolute border border-2 rounded building-overlay"
                                style={{
                                    left: `${Math.max(0, Math.min(95, relativeX))}%`,
                                    top: `${Math.max(0, Math.min(95, relativeY))}%`,
                                    width: `${Math.max(3, Math.min(15, relativeWidth))}%`,
                                    height: `${Math.max(3, Math.min(15, relativeHeight))}%`,
                                    opacity: isSelected ? 1 : 0.8,
                                    backgroundColor: building.buildingType === 'residential' ? 'rgba(76, 175, 80, 0.4)' :
                                        building.buildingType === 'commercial' ? 'rgba(33, 150, 243, 0.4)' :
                                            'rgba(255, 152, 0, 0.4)',
                                    borderColor: building.buildingType === 'residential' ? '#4CAF50' :
                                        building.buildingType === 'commercial' ? '#2196F3' :
                                            '#FF9800',
                                    zIndex: isSelected ? 20 : 5,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                                    boxShadow: isSelected ? '0 0 20px rgba(0,0,0,0.5)' : 'none'
                                }}
                                onClick={(e) => handleBuildingClick(building, e)}
                                title={`${building.buildingType} - ${building.groupId} - Height: ${building.bounds.height3D}m`}
                            >
                                {/* Building type label */}
                                <div className="position-absolute top-0 start-0 bg-dark text-white px-1" style={{
                                    fontSize: `${Math.max(8, 10 / (zoomLevel / 100))}px`,
                                    borderRadius: '0 0 3px 0',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {building.buildingType === 'residential' ? 'res' :
                                        building.buildingType === 'commercial' ? 'com' : 'ind'}
                                </div>

                                {/* Height indicator */}
                                <div className="position-absolute bottom-0 end-0 bg-secondary text-white px-1" style={{
                                    fontSize: `${Math.max(6, 8 / (zoomLevel / 100))}px`,
                                    borderRadius: '3px 0 0 0'
                                }}>
                                    {building.bounds.height3D}m
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Building detail popup */}
            {selectedBuilding && (
                <div
                    className="position-absolute bg-white border rounded shadow-lg p-3"
                    style={{
                        left: '50%',
                        top: '20%',
                        transform: 'translateX(-50%)',
                        zIndex: 100,
                        minWidth: '250px',
                        maxWidth: '300px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0">Building Details</h6>
                        <button
                            className="btn-close btn-sm"
                            onClick={() => setSelectedBuilding(null)}
                        ></button>
                    </div>
                    <div className="small">
                        <div><strong>ID:</strong> {selectedBuilding.groupId}</div>
                        <div><strong>Type:</strong>
                            <span className={`badge ms-1 bg-${selectedBuilding.buildingType === 'residential' ? 'success' : selectedBuilding.buildingType === 'commercial' ? 'primary' : 'warning'}`}>
                                {selectedBuilding.buildingType}
                            </span>
                        </div>
                        <div><strong>Height:</strong> {selectedBuilding.bounds.height3D}m</div>
                        <div><strong>Dimensions:</strong> {Math.round(selectedBuilding.bounds.width)}×{Math.round(selectedBuilding.bounds.height)}m</div>
                        <div><strong>Sub Group:</strong> {selectedBuilding.subGroupId}</div>
                    </div>
                </div>
            )}

            {/* IMPROVED: Building overlay toggle di kiri atas */}
            <div className="position-absolute top-0 start-0 m-3" style={{ zIndex: 50 }}>
                <div className="btn-group-vertical">
                    <button
                        className={`btn btn-sm ${showBuildingLabels ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => setShowBuildingLabels(!showBuildingLabels)}
                        title="Toggle Building Labels"
                    >
                        🏗️
                    </button>
                </div>
            </div>

            {/* Drawing SVG overlay */}
            <svg
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    pointerEvents: 'none',
                    zIndex: 10
                }}
            >
                {drawingData.map((drawing) => (
                    <g key={drawing.id}>
                        <path
                            d={`M ${drawing.path.map(point => `${point.x},${point.y}`).join(' L ')}`}
                            stroke={drawing.color}
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                ))}
                {currentPath.length > 1 && (
                    <path
                        d={`M ${currentPath.map(point => `${point.x},${point.y}`).join(' L ')}`}
                        stroke="#ff0000"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                )}
            </svg>

            {/* Building outlines toggle */}
            {showBuildingOutlines && labelData && (
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ pointerEvents: 'none' }}>
                    {labelData.map((building) => {
                        const relativeX = (building.bounds.x / 1000) * 100;
                        const relativeY = (building.bounds.y / 1000) * 100;
                        const relativeWidth = (building.bounds.width / 1000) * 100;
                        const relativeHeight = (building.bounds.height / 1000) * 100;

                        return (
                            <div
                                key={`outline-${building.id}`}
                                className="position-absolute border border-danger border-3 rounded"
                                style={{
                                    left: `${Math.max(0, Math.min(95, relativeX))}%`,
                                    top: `${Math.max(0, Math.min(95, relativeY))}%`,
                                    width: `${Math.max(3, Math.min(15, relativeWidth))}%`,
                                    height: `${Math.max(3, Math.min(15, relativeHeight))}%`,
                                    opacity: 0.9,
                                    animation: 'pulse 2s infinite',
                                    zIndex: 15,
                                    boxShadow: '0 0 10px rgba(220, 53, 69, 0.5)'
                                }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};