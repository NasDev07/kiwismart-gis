import React from 'react';
import { NavigationBar } from '../NavigationBar/NavigationBar';
import { MainWorkspace } from '../MainWorkspace/MainWorkspace';
import { FloatingTools } from '../FloatingTools/FloatingTools';
import { SidebarPanels } from '../SidebarPanels/SidebarPanels';
import { StatusBar } from '../StatusBar/StatusBar';
import { Modals } from '../Modals/Modals';

export const ProjectInterface = ({
    // All state values
    isFullScreen,
    language,
    setLanguage,
    activeDropdown,
    setActiveDropdown,
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
    setShowBuildingOutlines,
    projectData,
    fabExpanded,
    setFabExpanded,
    fabTools,
    sidebarPanel,
    setSidebarPanel,
    activityLogs,
    cameraDistance,
    historyIndex,
    drawingHistory,
    isAutoLabeling,
    setIsAutoLabeling,
    labelingProgress,
    showSaveModal,
    setShowSaveModal,
    saveAsName,
    setSaveAsName,
    showAboutModal,
    setShowAboutModal,
    showSettingsModal,
    setShowSettingsModal,
    setIsProjectOpen,
    fileInputRef,
    // Handlers
    handleMenuClick,
    handleToolClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setIsDrawing,
    setCurrentPath,
    handleUndo,
    handleRedo,
    handleDelete,
    handleSaveAsProject,
    handleExport,
    handleFileUpload,
    addActivityLog,
    t
}) => (
    // FIXED: Root container with proper flexbox layout
    <div 
        className={`project-interface ${isFullScreen ? 'fullscreen-mode' : ''}`}
        style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: isFullScreen ? 'fixed' : 'relative',
            top: isFullScreen ? 0 : 'auto',
            left: isFullScreen ? 0 : 'auto',
            right: isFullScreen ? 0 : 'auto',
            bottom: isFullScreen ? 0 : 'auto',
            zIndex: isFullScreen ? 9999 : 'auto'
        }}
    >
        {/* Navigation Bar - Fixed height at top */}
        <div style={{ flexShrink: 0 }}>
            <NavigationBar
                language={language}
                setLanguage={setLanguage}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                handleMenuClick={handleMenuClick}
                handleToolClick={handleToolClick}
                isFullScreen={isFullScreen}
                setIsProjectOpen={setIsProjectOpen}
                setSidebarPanel={setSidebarPanel}
                historyIndex={historyIndex}
                drawingHistory={drawingHistory}
                drawingData={drawingData}
                is3DView={is3DView}
                t={t}
            />
        </div>
        
        {/* Main Content Area - Takes remaining space minus status bar */}
        <div 
            className="main-content-area"
            style={{
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f8f9fa'
            }}
            onClick={() => setActiveDropdown(null)}
        >
            {/* Workspace Container - Takes available space above status bar */}
            <div 
                className="workspace-container"
                style={{
                    flex: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    // Reserve space for status bar at bottom
                    height: 'calc(100% - 60px)'
                }}
            >
                <MainWorkspace
                    is3DView={is3DView}
                    canvasRef={canvasRef}
                    mapBackground={mapBackground}
                    setMapBackground={setMapBackground}
                    setImagePreview={setImagePreview}
                    setProjectData={setProjectData}
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
                    handleMenuClick={handleMenuClick}
                    handleToolClick={handleToolClick}
                    fileInputRef={fileInputRef}
                    addActivityLog={addActivityLog}
                    language={language}
                    t={t}
                />
                
                {/* Floating UI Elements - Positioned within workspace */}
                <FloatingTools
                    fabExpanded={fabExpanded}
                    setFabExpanded={setFabExpanded}
                    selectedTool={selectedTool}
                    fabTools={fabTools}
                    handleToolClick={handleToolClick}
                    handleUndo={handleUndo}
                    handleRedo={handleRedo}
                    handleDelete={handleDelete}
                    historyIndex={historyIndex}
                    drawingHistory={drawingHistory}
                    drawingData={drawingData}
                    is3DView={is3DView}
                />
                
                <SidebarPanels
                    sidebarPanel={sidebarPanel}
                    setSidebarPanel={setSidebarPanel}
                    activityLogs={activityLogs}
                    labelData={labelData}
                    is3DView={is3DView}
                    cameraDistance={cameraDistance}
                    zoomLevel={zoomLevel}
                    handleToolClick={handleToolClick}
                    showBuildingOutlines={showBuildingOutlines}
                    setShowBuildingOutlines={setShowBuildingOutlines}
                    t={t}
                />
            </div>
            
            {/* Status Bar - Fixed at bottom of main content area */}
            <div 
                style={{ 
                    flexShrink: 0,
                    width: '100%',
                    height: '60px',
                    position: 'relative',
                    zIndex: 1000
                }}
            >
                <StatusBar
                    setIsProjectOpen={setIsProjectOpen}
                    handleMenuClick={handleMenuClick}
                    handleExport={handleExport}
                    handleToolClick={handleToolClick}
                    is3DView={is3DView}
                    cameraDistance={cameraDistance}
                    zoomLevel={zoomLevel}
                    t={t}
                />
            </div>
        </div>

        {/* Modals - Overlay on top */}
        <Modals
            isAutoLabeling={isAutoLabeling}
            setIsAutoLabeling={setIsAutoLabeling}
            labelingProgress={labelingProgress}
            showSaveModal={showSaveModal}
            setShowSaveModal={setShowSaveModal}
            saveAsName={saveAsName}
            setSaveAsName={setSaveAsName}
            handleSaveAsProject={handleSaveAsProject}
            showAboutModal={showAboutModal}
            setShowAboutModal={setShowAboutModal}
            showSettingsModal={showSettingsModal}
            setShowSettingsModal={setShowSettingsModal}
            language={language}
            setLanguage={setLanguage}
            showBuildingOutlines={showBuildingOutlines}
            setShowBuildingOutlines={setShowBuildingOutlines}
            addActivityLog={addActivityLog}
            t={t}
        />

        {/* Hidden file input */}
        <input
            ref={fileInputRef}
            type="file"
            className="d-none"
            accept=".shp,.json,.geojson,.gpkg,.tiff,.tif,.jpg,.jpeg,.png,.gif,.bmp,.webp"
            onChange={handleFileUpload}
        />
    </div>
);