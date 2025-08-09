import React from 'react';

export const View3D = ({ canvasRef }) => {
    return (
        <div className="h-100 position-relative bg-dark">
            <canvas
                ref={canvasRef}
                className="w-100 h-100"
                style={{ 
                    display: 'block',
                    backgroundColor: '#87CEEB' // Sky blue background
                }}
            />
            {/* 3D View indicator */}
            <div className="position-absolute top-0 start-0 m-3 bg-success text-white px-2 py-1 rounded" style={{ zIndex: 1000 }}>
                <small>🌐 3D Mode Active</small>
            </div>
        </div>
    );
};