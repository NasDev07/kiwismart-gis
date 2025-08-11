import React from 'react';
import { useKiwiSmartState } from '../hooks/useKiwiSmartState';
import { use3DVisualization } from '../hooks/use3DVisualization';
import { useFileUpload } from '../hooks/useFileUpload';
import { useDrawing } from '../hooks/useDrawing';
import { useActivityLog } from '../hooks/useActivityLog';
import { useProjectHandlers } from '../hooks/useProjectHandlers';
import { translations } from '../utils/translations';
import { MainPage } from './MainPage/MainPage';
import { ProjectInterface } from './ProjectInterface/ProjectInterface';
import '../styles/KiwiSmartApp.css';

const KiwiSmartApp = () => {
    // Initialize all state
    const state = useKiwiSmartState();
    const t = translations[state.language];

    // Initialize activity log
    const { addActivityLog } = useActivityLog({
        setActivityLogs: state.setActivityLogs
    });

    // Initialize 3D visualization
    use3DVisualization({
        is3DView: state.is3DView,
        canvasRef: state.canvasRef,
        labelData: state.labelData,
        sceneRef: state.sceneRef,
        cameraRef: state.cameraRef,
        rendererRef: state.rendererRef,
        controlsRef: state.controlsRef,
        animationRef: state.animationRef,
        buildingMeshesRef: state.buildingMeshesRef,
        setCameraDistance: state.setCameraDistance
    });

    // Initialize file upload
    const { handleFileUpload } = useFileUpload({
        setUploadedFile: state.setUploadedFile,
        setMapBackground: state.setMapBackground,
        setImagePreview: state.setImagePreview,
        setProjectData: state.setProjectData,
        setIsProjectOpen: state.setIsProjectOpen,
        setLabelData: state.setLabelData,
        addActivityLog
    });

    // Initialize drawing functionality
    const {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleUndo,
        handleRedo,
        handleDelete
    } = useDrawing({
        selectedTool: state.selectedTool,
        is3DView: state.is3DView,
        zoomLevel: state.zoomLevel,
        setIsDrawing: state.setIsDrawing,
        setCurrentPath: state.setCurrentPath,
        currentPath: state.currentPath,
        isDrawing: state.isDrawing,
        drawingData: state.drawingData,
        setDrawingData: state.setDrawingData,
        drawingHistory: state.drawingHistory,
        setDrawingHistory: state.setDrawingHistory,
        historyIndex: state.historyIndex,
        setHistoryIndex: state.setHistoryIndex,
        addActivityLog
    });

    // Initialize project handlers
    const {
        handleSaveProject,
        handleSaveAsProject,
        handleExport,
        loadSampleImage
    } = useProjectHandlers({
        projectData: state.projectData,
        language: state.language,
        zoomLevel: state.zoomLevel,
        mapBackground: state.mapBackground,
        labelData: state.labelData,
        activityLogs: state.activityLogs,
        saveAsName: state.saveAsName,
        setSaveAsName: state.setSaveAsName,
        setShowSaveModal: state.setShowSaveModal,
        addActivityLog
    });

    // FAB tools configuration
    const fabTools = [
        { id: 'select', icon: '🖱️', label: t.selectTool },
        { id: 'ai', icon: '🤖', label: t.autoLabel },
        { id: 'manual', icon: '✏️', label: t.manualLabel },
        { id: 'delete', icon: '🗑️', label: t.deleteLabel },
        { id: 'undo', icon: '↶', label: t.undo },
        { id: 'redo', icon: '↷', label: t.redo },
        { id: '3d', icon: '📐', label: t.toggle3D },
        { id: 'reset', icon: '🔄', label: t.resetView }
    ];

    // Tool click handler
    const handleToolClick = (toolId) => {
        if (toolId === 'ai') {
            state.setIsAutoLabeling(true);
            state.setLabelingProgress(0);
            addActivityLog('aiLabelingStarted', 'info');

            const interval = setInterval(() => {
                state.setLabelingProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        state.setIsAutoLabeling(false);
                        addActivityLog('aiLabelingCompleted', 'success');
                        return 100;
                    }
                    return prev + 2;
                });
            }, 100);
        } else if (toolId === '3d') {
            state.setIs3DView(!state.is3DView);
            addActivityLog('viewToggled3D', 'info');
        } else if (toolId === 'reset') {
            if (state.is3DView && state.controlsRef.current) {
                state.controlsRef.current.reset();
                addActivityLog('cameraReset', 'info');
            } else {
                state.setZoomLevel(100);
                addActivityLog('viewReset', 'info');
            }
        } else {
            state.setSelectedTool(toolId);
            addActivityLog(`toolSelected_${toolId}`, 'info');
        }
    };

    // Menu click handler
    const handleMenuClick = (action) => {
        switch (action) {
            case 'home':
                state.setIsProjectOpen(false);
                state.setIs3DView(false);
                addActivityLog('returnedHome', 'info');
                break;
            case 'newProject':
                state.fileInputRef.current?.click();
                addActivityLog('newProjectInitiated', 'info');
                break;
            case 'openProject':
                state.fileInputRef.current?.click();
                addActivityLog('openProjectInitiated', 'info');
                break;
            case 'save':
                handleSaveProject();
                break;
            case 'saveAs':
                state.setShowSaveModal(true);
                break;
            case 'zoomIn':
                if (state.is3DView && state.controlsRef.current && state.cameraRef.current) {
                    // PERBAIKAN: Gunakan method yang benar untuk zoom
                    const camera = state.cameraRef.current;
                    const controls = state.controlsRef.current;

                    // Method 1: Dolly/Zoom langsung
                    const zoomFactor = 0.8;
                    camera.position.multiplyScalar(zoomFactor);
                    controls.update();

                    addActivityLog('zoomedIn_3D', 'info');
                } else {
                    state.setZoomLevel(prev => {
                        const newZoom = Math.min(prev + 25, 200);
                        addActivityLog(`zoomedIn_${newZoom}`, 'info');
                        return newZoom;
                    });
                }
                break;
            case 'zoomOut':
                if (state.is3DView && state.controlsRef.current && state.cameraRef.current) {
                    // PERBAIKAN: Gunakan method yang benar untuk zoom
                    const camera = state.cameraRef.current;
                    const controls = state.controlsRef.current;

                    // Method 1: Dolly/Zoom langsung
                    const zoomFactor = 1.25; // Semakin besar = zoom out lebih banyak
                    camera.position.multiplyScalar(zoomFactor);
                    controls.update();

                    addActivityLog('zoomedOut_3D', 'info');
                } else {
                    state.setZoomLevel(prev => {
                        const newZoom = Math.max(prev - 25, 50);
                        addActivityLog(`zoomedOut_${newZoom}`, 'info');
                        return newZoom;
                    });
                }
                break;
            case 'fullScreen':
                state.setIsFullScreen(!state.isFullScreen);
                addActivityLog('fullScreenToggled', 'info');
                break;
            case 'about':
                state.setShowAboutModal(true);
                break;
            case 'settings':
                state.setShowSettingsModal(true);
                break;
            case 'undo':
                handleUndo();
                break;
            case 'redo':
                handleRedo();
                break;
            case 'cut':
                addActivityLog('cutSelection', 'info');
                break;
            case 'copy':
                addActivityLog('copySelection', 'info');
                break;
            case 'paste':
                addActivityLog('pasteSelection', 'info');
                break;
            case 'delete':
                handleDelete();
                break;
            default:
                addActivityLog(action, 'info');
        }
        state.setActiveDropdown(null);
    };

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        state.setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        state.setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        state.setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            const event = {
                target: {
                    files: [file]
                }
            };
            handleFileUpload(event);
        }
    };

    // Sample image loader
    const handleLoadSampleImage = (imageType) => {
        const sampleData = loadSampleImage(imageType);
        state.setMapBackground(sampleData.url);
        state.setProjectData(sampleData);
        addActivityLog('sampleImageLoaded', 'info');
    };

    return (
        <div className="App">
            {!state.isProjectOpen ? (
                <MainPage
                    language={state.language}
                    setLanguage={state.setLanguage}
                    isDragOver={state.isDragOver}
                    handleDragOver={handleDragOver}
                    handleDragLeave={handleDragLeave}
                    handleDrop={handleDrop}
                    fileInputRef={state.fileInputRef}
                    setIsProjectOpen={state.setIsProjectOpen}
                    loadSampleImage={handleLoadSampleImage}
                    handleFileUpload={handleFileUpload}
                    t={t}
                />
            ) : (
                <ProjectInterface
                    // Pass all state
                    {...state}
                    // Pass tools configuration
                    fabTools={fabTools}
                    // Pass handlers
                    handleMenuClick={handleMenuClick}
                    handleToolClick={handleToolClick}
                    handleMouseDown={handleMouseDown}
                    handleMouseMove={handleMouseMove}
                    handleMouseUp={handleMouseUp}
                    handleUndo={handleUndo}
                    handleRedo={handleRedo}
                    handleDelete={handleDelete}
                    handleSaveAsProject={handleSaveAsProject}
                    handleExport={handleExport}
                    handleFileUpload={handleFileUpload}
                    addActivityLog={addActivityLog}
                    // Pass translations
                    t={t}
                />
            )}
        </div>
    );
};

export default KiwiSmartApp;