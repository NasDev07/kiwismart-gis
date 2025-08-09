import React from 'react';

export const ZoomControls = ({
    is3DView,
    zoomLevel,
    mapBackground,
    handleMenuClick,
    handleToolClick,
    fileInputRef,
    setMapBackground,
    setImagePreview,
    setProjectData,
    addActivityLog,
    language,
    t
}) => (
    <div className="position-absolute top-0 start-0 m-3 fixed-ui mt-5" style={{ zIndex: 1001 }}>
        <div className="btn-group-vertical mt-5" role="group">
            <button
                className="btn btn-light btn-sm border"
                onClick={() => handleMenuClick('zoomIn')}
                title={is3DView ? "Zoom In (3D)" : "Zoom In"}
            >
                ➕
            </button>
            <button
                className="btn btn-light btn-sm border"
                onClick={() => handleMenuClick('zoomOut')}
                title={is3DView ? "Zoom Out (3D)" : "Zoom Out"}
            >
                ➖
            </button>
            <button
                className="btn btn-info btn-sm border"
                title={`Current View: ${is3DView ? '3D Camera' : `2D ${zoomLevel}%`}`}
                disabled
            >
                {is3DView ? '3D' : `${zoomLevel}%`}
            </button>
            {is3DView && (
                <button
                    className="btn btn-warning btn-sm border mt-2"
                    onClick={() => handleToolClick('reset')}
                    title={t.resetCamera}
                >
                    🔄
                </button>
            )}
            {mapBackground && !is3DView && (
                <>
                    <button
                        className="btn btn-warning btn-sm border mt-2"
                        onClick={() => fileInputRef.current?.click()}
                        title={language === 'en' ? 'Change Image' : '更換圖片'}
                    >
                        🖼️
                    </button>
                    <button
                        className="btn btn-danger btn-sm border"
                        onClick={() => {
                            setMapBackground(null);
                            setImagePreview(null);
                            setProjectData(null);
                            addActivityLog('backgroundCleared', 'info');
                        }}
                        title={language === 'en' ? 'Remove Image' : '移除圖片'}
                    >
                        🗑️
                    </button>
                </>
            )}
            <button
                className={`btn ${is3DView ? 'btn-success' : 'btn-info'} btn-sm border mt-2`}
                onClick={() => handleToolClick('3d')}
                title={t.toggle3D}
            >
                📐
            </button>
        </div>
    </div>
);