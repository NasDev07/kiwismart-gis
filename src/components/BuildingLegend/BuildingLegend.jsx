import React from 'react';

export const BuildingLegend = ({ labelData, t, isVisible = true }) => {
    if (!isVisible || !labelData || labelData.length === 0) {
        return null;
    }

    const stats = {
        residential: labelData.filter(b => b.buildingType === 'residential').length,
        commercial: labelData.filter(b => b.buildingType === 'commercial').length,
        industrial: labelData.filter(b => b.buildingType === 'industrial').length
    };

    const total = stats.residential + stats.commercial + stats.industrial;

    return (
        <div 
            className="position-fixed bg-white border rounded shadow-sm p-3" 
            style={{ 
                top: '35%', 
                right: '20px', 
                transform: 'translateY(-50%)',
                zIndex: 999,
                minWidth: '200px',
                maxWidth: '250px'
            }}
        >
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="fw-bold small">Building Types</div>
                <span className="badge bg-secondary">{total} total</span>
            </div>
            
            <div className="d-flex flex-column gap-2">
                {/* Residential */}
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                        <div 
                            className="border rounded" 
                            style={{ 
                                width: '16px', 
                                height: '16px',
                                backgroundColor: 'rgba(76, 175, 80, 0.4)',
                                borderColor: '#4CAF50'
                            }}
                        ></div>
                        <span className="small">Residential</span>
                    </div>
                    <span className="badge bg-success">{stats.residential}</span>
                </div>

                {/* Commercial */}
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                        <div 
                            className="border rounded" 
                            style={{ 
                                width: '16px', 
                                height: '16px',
                                backgroundColor: 'rgba(33, 150, 243, 0.4)',
                                borderColor: '#2196F3'
                            }}
                        ></div>
                        <span className="small">Commercial</span>
                    </div>
                    <span className="badge bg-primary">{stats.commercial}</span>
                </div>

                {/* Industrial */}
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                        <div 
                            className="border rounded" 
                            style={{ 
                                width: '16px', 
                                height: '16px',
                                backgroundColor: 'rgba(255, 152, 0, 0.4)',
                                borderColor: '#FF9800'
                            }}
                        ></div>
                        <span className="small">Industrial</span>
                    </div>
                    <span className="badge bg-warning">{stats.industrial}</span>
                </div>
            </div>

            {/* Percentage breakdown */}
            {total > 0 && (
                <div className="mt-2 pt-2 border-top">
                    <div className="small text-muted mb-1">Distribution:</div>
                    <div className="progress" style={{ height: '8px' }}>
                        <div 
                            className="progress-bar bg-success" 
                            style={{ width: `${(stats.residential / total) * 100}%` }}
                            title={`Residential: ${((stats.residential / total) * 100).toFixed(1)}%`}
                        ></div>
                        <div 
                            className="progress-bar bg-primary" 
                            style={{ width: `${(stats.commercial / total) * 100}%` }}
                            title={`Commercial: ${((stats.commercial / total) * 100).toFixed(1)}%`}
                        ></div>
                        <div 
                            className="progress-bar bg-warning" 
                            style={{ width: `${(stats.industrial / total) * 100}%` }}
                            title={`Industrial: ${((stats.industrial / total) * 100).toFixed(1)}%`}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};