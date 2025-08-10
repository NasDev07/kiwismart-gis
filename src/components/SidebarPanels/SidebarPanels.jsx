import React from 'react';
import { ActivityLogPanel } from './ActivityLogPanel';
import { LabelTablePanel } from './LabelTablePanel';
import { FiltersPanel } from './FiltersPanel';

export const SidebarPanels = ({
    sidebarPanel,
    setSidebarPanel,
    activityLogs,
    labelData,
    is3DView,
    cameraDistance,
    zoomLevel,
    handleToolClick,
    showBuildingOutlines,
    setShowBuildingOutlines,
    t
}) => {
    return (
        <>
            {/* Panel Controls - Positioned above status bar */}
            <div 
                style={{
                    position: 'absolute',
                    bottom: '15px',
                    left: '20px',
                    zIndex: 1001
                }}
            >
                <div className="btn-group" role="group">
                    <button
                        className={`btn btn-sm border d-flex align-items-center gap-2 ${sidebarPanel === 'activity' ? 'btn-primary' : 'btn-light'}`}
                        onClick={() => setSidebarPanel(sidebarPanel === 'activity' ? null : 'activity')}
                        title={t.activityLog || 'Activity Log'}
                    >
                        📋
                        <span className="d-none d-md-inline">{t.activityLog || 'Activity'}</span>
                        {activityLogs.length > 0 && (
                            <span className="badge bg-danger rounded-pill">{activityLogs.length}</span>
                        )}
                    </button>
                    <button
                        className={`btn btn-sm border d-flex align-items-center gap-2 ${sidebarPanel === 'table' ? 'btn-primary' : 'btn-light'}`}
                        onClick={() => setSidebarPanel(sidebarPanel === 'table' ? null : 'table')}
                        title={t.labelTableSidebar || 'Label Table'}
                    >
                        📊
                        <span className="d-none d-md-inline">{t.labelTableSidebar || 'Labels'}</span>
                        {labelData.length > 0 && (
                            <span className="badge bg-success rounded-pill">{labelData.length}</span>
                        )}
                    </button>
                    <button
                        className={`btn btn-sm border d-flex align-items-center gap-2 ${sidebarPanel === 'filters' ? 'btn-primary' : 'btn-light'}`}
                        onClick={() => setSidebarPanel(sidebarPanel === 'filters' ? null : 'filters')}
                        title={t.filters || 'Filters'}
                    >
                        🔍
                        <span className="d-none d-md-inline">{t.filters || 'Filters'}</span>
                    </button>
                </div>
            </div>

            {/* Panel Content - Positioned above controls */}
            {sidebarPanel && (
                <div
                    className="card position-absolute shadow-lg border-0"
                    style={{
                        left: '20px',
                        bottom: '50px',
                        width: window.innerWidth < 768 ? '90vw' : '350px',
                        maxWidth: '90vw',
                        height: window.innerWidth < 768 ? '50vh' : '400px',
                        maxHeight: '60vh',
                        zIndex: 1002
                    }}
                >
                    <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
                        <h6 className="mb-0 d-flex align-items-center gap-2">
                            {sidebarPanel === 'activity' && (
                                <>
                                    <span>📋</span> {t.activityLog}
                                </>
                            )}
                            {sidebarPanel === 'table' && (
                                <>
                                    <span>📊</span> {t.labelTableSidebar}
                                </>
                            )}
                            {sidebarPanel === 'filters' && (
                                <>
                                    <span>🔍</span> {t.filters}
                                </>
                            )}
                        </h6>
                        <button
                            className="btn btn-link btn-sm p-0 text-white"
                            onClick={() => setSidebarPanel(null)}
                            title="Close"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="card-body p-3 overflow-auto">
                        {sidebarPanel === 'activity' && (
                            <ActivityLogPanel activityLogs={activityLogs} t={t} />
                        )}
                        {sidebarPanel === 'table' && (
                            <LabelTablePanel labelData={labelData} t={t} />
                        )}
                        {sidebarPanel === 'filters' && (
                            <FiltersPanel
                                is3DView={is3DView}
                                labelData={labelData}
                                cameraDistance={cameraDistance}
                                zoomLevel={zoomLevel}
                                handleToolClick={handleToolClick}
                                showBuildingOutlines={showBuildingOutlines}
                                setShowBuildingOutlines={setShowBuildingOutlines}
                                t={t}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};