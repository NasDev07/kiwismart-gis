import { useState, useRef } from 'react';

export const useKiwiSmartState = () => {
    // Project states
    const [isProjectOpen, setIsProjectOpen] = useState(false);
    const [projectData, setProjectData] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [mapBackground, setMapBackground] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // UI states
    const [fabExpanded, setFabExpanded] = useState(false);
    const [selectedTool, setSelectedTool] = useState('select');
    const [sidebarPanel, setSidebarPanel] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    // AI & Labeling states
    const [isAutoLabeling, setIsAutoLabeling] = useState(false);
    const [labelingProgress, setLabelingProgress] = useState(0);
    const [showBuildingOutlines, setShowBuildingOutlines] = useState(false);

    // View states
    const [language, setLanguage] = useState('zh');
    const [zoomLevel, setZoomLevel] = useState(100);
    const [is3DView, setIs3DView] = useState(false);
    const [cameraDistance, setCameraDistance] = useState(1000);

    // Modal states
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [saveAsName, setSaveAsName] = useState('');

    // Drawing states
    const [drawingData, setDrawingData] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState([]);
    const [drawingHistory, setDrawingHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Data states
    const [activityLogs, setActivityLogs] = useState([
        { id: 1, action: 'projectOpened', timestamp: '2024-08-02 14:30:00', type: 'info' },
        { id: 2, action: 'aiLabelingCompleted', timestamp: '2024-08-02 14:25:00', type: 'success' }
    ]);

    const [labelData, setLabelData] = useState([
        { id: 1, groupId: 'GROUP_001', subGroupId: 'SUB_001', buildingType: 'residential', bounds: { x: 300, y: 200, width: 100, height: 60, height3D: 120 } },
        { id: 2, groupId: 'GROUP_002', subGroupId: 'SUB_001', buildingType: 'commercial', bounds: { x: 500, y: 400, width: 120, height: 80, height3D: 180 } },
        { id: 3, groupId: 'GROUP_003', subGroupId: 'SUB_002', buildingType: 'industrial', bounds: { x: 400, y: 300, width: 80, height: 50, height3D: 80 } },
        { id: 4, groupId: 'GROUP_004', subGroupId: 'SUB_003', buildingType: 'residential', bounds: { x: 350, y: 350, width: 90, height: 70, height3D: 100 } },
        { id: 5, groupId: 'GROUP_005', subGroupId: 'SUB_003', buildingType: 'commercial', bounds: { x: 450, y: 250, width: 110, height: 90, height3D: 200 } },
        { id: 6, groupId: 'GROUP_006', subGroupId: 'SUB_004', buildingType: 'industrial', bounds: { x: 600, y: 350, width: 130, height: 100, height3D: 60 } }
    ]);

    // Refs
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const animationRef = useRef(null);
    const buildingMeshesRef = useRef([]);

    return {
        // Project states
        isProjectOpen, setIsProjectOpen,
        projectData, setProjectData,
        uploadedFile, setUploadedFile,
        mapBackground, setMapBackground,
        imagePreview, setImagePreview,

        // UI states
        fabExpanded, setFabExpanded,
        selectedTool, setSelectedTool,
        sidebarPanel, setSidebarPanel,
        activeDropdown, setActiveDropdown,
        isFullScreen, setIsFullScreen,
        isDragOver, setIsDragOver,

        // AI & Labeling states
        isAutoLabeling, setIsAutoLabeling,
        labelingProgress, setLabelingProgress,
        showBuildingOutlines, setShowBuildingOutlines,

        // View states
        language, setLanguage,
        zoomLevel, setZoomLevel,
        is3DView, setIs3DView,
        cameraDistance, setCameraDistance,

        // Modal states
        showAboutModal, setShowAboutModal,
        showSettingsModal, setShowSettingsModal,
        showSaveModal, setShowSaveModal,
        saveAsName, setSaveAsName,

        // Drawing states
        drawingData, setDrawingData,
        isDrawing, setIsDrawing,
        currentPath, setCurrentPath,
        drawingHistory, setDrawingHistory,
        historyIndex, setHistoryIndex,

        // Data states
        activityLogs, setActivityLogs,
        labelData, setLabelData,

        // Refs
        fileInputRef,
        canvasRef,
        sceneRef,
        cameraRef,
        rendererRef,
        controlsRef,
        animationRef,
        buildingMeshesRef
    };
};