import React from 'react';

export const StatusBar = ({
    setIsProjectOpen,
    handleMenuClick,
    handleExport,
    handleToolClick,
    is3DView,
    cameraDistance,
    zoomLevel,
    t
}) => (
    <div 
        className="status-bar bg-dark text-light"
        style={{
            width: '100%',
            height: '60px',
            minHeight: '60px',
            maxHeight: '60px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1000,
            backgroundColor: '#343a40',
            borderTop: '1px solid #495057',
            flexShrink: 0,
            bottom: 0,
            left: 0,
            right: 0
        }}
    >
        <div className="container-fluid">
            <div className="d-flex justify-content-center gap-2 align-items-center flex-wrap">
                {/* Main Action Buttons */}
                <button
                    className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
                    onClick={() => setIsProjectOpen(false)}
                    style={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
                >
                    <span>🏠</span>
                    <span className="d-none d-sm-inline">{t.backToHome}</span>
                </button>
                
                <button
                    className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                    onClick={() => handleMenuClick('save')}
                    style={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
                >
                    <span>💾</span>
                    <span className="d-none d-sm-inline">{t.saveProgress}</span>
                </button>
                
                <button
                    className="btn btn-success btn-sm d-flex align-items-center gap-1"
                    onClick={handleExport}
                    style={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
                >
                    <span>📥</span>
                    <span className="d-none d-sm-inline">{t.exportLabels}</span>
                </button>
                
                <button
                    className={`btn btn-sm d-flex align-items-center gap-1 ${is3DView ? 'btn-warning' : 'btn-info'}`}
                    onClick={() => handleToolClick('3d')}
                    style={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
                >
                    <span>📐</span>
                    <span className="d-none d-sm-inline">
                        {is3DView ? 'Switch to 2D' : 'Switch to 3D'}
                    </span>
                </button>
                
                {is3DView && (
                    <button
                        className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
                        onClick={() => handleToolClick('reset')}
                        style={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
                    >
                        <span>🔄</span>
                        <span className="d-none d-sm-inline">{t.resetView}</span>
                    </button>
                )}
                
                {/* Separator */}
                <div className="vr d-none d-lg-block mx-2" style={{ height: '24px' }}></div>
                
                {/* Status Info */}
                <div className="d-none d-md-flex align-items-center gap-2">
                    <div className="d-flex align-items-center gap-1">
                        <small className="text-light">Mode:</small>
                        <span className={`badge bg-${is3DView ? 'success' : 'primary'}`}>
                            {is3DView ? '3D' : '2D'}
                        </span>
                    </div>
                    
                    {is3DView && (
                        <div className="d-flex align-items-center gap-1">
                            <small className="text-light">Distance:</small>
                            <span className="badge bg-info">{Math.round(cameraDistance)}m</span>
                        </div>
                    )}
                    
                    {!is3DView && (
                        <div className="d-flex align-items-center gap-1">
                            <small className="text-light">Zoom:</small>
                            <span className="badge bg-secondary">{zoomLevel}%</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);