import React from 'react';
import { View2D } from './View2D';
import { View3D } from './View3D';
import { ZoomControls } from './ZoomControls';
import { BuildingLegend } from '../BuildingLegend/BuildingLegend';

export const MainWorkspace = ({
    is3DView,
    canvasRef,
    mapBackground,
    setMapBackground,
    setImagePreview,
    setProjectData,
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
    handleMenuClick,
    handleToolClick,
    fileInputRef,
    addActivityLog,
    language,
    t
}) => {
    const [showLegend, setShowLegend] = React.useState(true);

    return (
        <div className="flex-grow-1 position-relative bg-light">
            <div className="h-100 position-relative overflow-hidden">
                {is3DView ? (
                    <View3D canvasRef={canvasRef} />
                ) : (
                    <View2D
                        mapBackground={mapBackground}
                        zoomLevel={zoomLevel}
                        selectedTool={selectedTool}
                        drawingData={drawingData}
                        currentPath={currentPath}
                        labelData={labelData}
                        showBuildingOutlines={showBuildingOutlines}
                        projectData={projectData}
                        handleMouseDown={handleMouseDown}
                        handleMouseMove={handleMouseMove}
                        handleMouseUp={handleMouseUp}
                        setIsDrawing={setIsDrawing}
                        setCurrentPath={setCurrentPath}
                        t={t}
                    />
                )}
                
                <ZoomControls
                    is3DView={is3DView}
                    zoomLevel={zoomLevel}
                    mapBackground={mapBackground}
                    handleMenuClick={handleMenuClick}
                    handleToolClick={handleToolClick}
                    fileInputRef={fileInputRef}
                    setMapBackground={setMapBackground}
                    setImagePreview={setImagePreview}
                    setProjectData={setProjectData}
                    addActivityLog={addActivityLog}
                    language={language}
                    t={t}
                />

                {/* TAMBAHKAN: BuildingLegend di sini */}
                {(mapBackground || labelData.length > 0) && (
                    <>
                        <BuildingLegend 
                            labelData={labelData}
                            t={t}
                            isVisible={showLegend}
                        />
                        
                        {/* Legend toggle button */}
                        <button
                            className="btn btn-outline-secondary btn-sm position-fixed mt-5"
                            style={{ 
                                top: '20px', 
                                right: '20px', 
                                zIndex: 1000 
                            }}
                            onClick={() => setShowLegend(!showLegend)}
                            title="Toggle Building Legend"
                        >
                            {showLegend ? '🔻' : '🔺'} Legend
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};