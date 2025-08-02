import React, { useState, useRef } from 'react';

const KiwiSmartApp = () => {
    const [isProjectOpen, setIsProjectOpen] = useState(false);
    const [fabExpanded, setFabExpanded] = useState(false);
    const [selectedTool, setSelectedTool] = useState('select');
    const [sidebarPanel, setSidebarPanel] = useState(null);
    const [isAutoLabeling, setIsAutoLabeling] = useState(false);
    const [labelingProgress, setLabelingProgress] = useState(0);
    const [language, setLanguage] = useState('zh');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [projectData, setProjectData] = useState(null);
    const [mapBackground, setMapBackground] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [saveAsName, setSaveAsName] = useState('');
    const [activityLogs, setActivityLogs] = useState([
        { id: 1, action: 'projectOpened', timestamp: '2024-08-02 14:30:00', type: 'info' },
        { id: 2, action: 'aiLabelingCompleted', timestamp: '2024-08-02 14:25:00', type: 'success' }
    ]);
    const [labelData, setLabelData] = useState([
        { id: 1, groupId: 'GROUP_001', subGroupId: 'SUB_001', buildingType: 'residential' },
        { id: 2, groupId: 'GROUP_002', subGroupId: 'SUB_001', buildingType: 'commercial' },
        { id: 3, groupId: 'GROUP_003', subGroupId: 'SUB_002', buildingType: 'industrial' }
    ]);
    const [drawingData, setDrawingData] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState([]);
    const [drawingHistory, setDrawingHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [showBuildingOutlines, setShowBuildingOutlines] = useState(false);

    const fileInputRef = useRef(null);

    // Translations
    const translations = {
        en: {
            appTitle: 'KiwiSmart',
            appSubtitle: 'Intelligent Geographic Information System',
            newProject: 'Start New Project',
            openProject: 'Open Existing Project',
            file: 'File',
            edit: 'Edit',
            view: 'View',
            window: 'Window',
            help: 'Help',
            home: 'Home',
            newProjectMenu: 'New Project',
            openProjectMenu: 'Open Project',
            save: 'Save',
            saveAs: 'Save As',
            newFile: 'New File',
            closeProject: 'Close Project',
            closeProgram: 'Close Program',
            undo: 'Undo',
            redo: 'Redo',
            cut: 'Cut',
            copy: 'Copy',
            paste: 'Paste',
            delete: 'Delete',
            select: 'Select',
            zoomIn: 'Zoom In',
            zoomOut: 'Zoom Out',
            fullScreen: 'Toggle Full Screen',
            minimize: 'Minimize',
            newWindow: 'New Window',
            activityLogs: 'Activity Logs',
            labelTable: 'Label Table',
            about: 'About',
            settings: 'Settings',
            preferences: 'Preferences',
            userManual: 'User Manual',
            selectTool: 'Select Tool',
            autoLabel: 'Auto Label (AI)',
            manualLabel: 'Manual Label',
            deleteLabel: 'Delete Label',
            activityLog: 'Activity Log',
            labelTableSidebar: 'Label Table',
            filters: 'Filters',
            autoLabelingInProgress: 'Automating building labeling...',
            buildingsLabeled: 'buildings labeled',
            abort: 'Abort',
            backToHome: 'Back to Home',
            saveProgress: 'Save Progress',
            exportLabels: 'Export Labels',
            satelliteMapView: 'Satellite Map View',
            groupId: 'Group ID',
            subGroupId: 'Sub Group ID',
            buildingType: 'Building Type',
            all: 'All',
            residential: 'Residential',
            commercial: 'Commercial',
            industrial: 'Industrial',
            projectOpened: 'Project Opened',
            aiLabelingCompleted: 'AI Labeling Completed',
            uploadFile: 'Upload File',
            selectFile: 'Select File',
            supportedFormats: 'Supported formats: Shapefile, GeoJSON, GPKG, GeoTIFF, Images (JPG, PNG)',
            fileUploaded: 'File uploaded successfully',
            processing: 'Processing...',
            aboutTitle: 'About KiwiSmart',
            aboutContent: 'KiwiSmart is an intelligent GIS application for building labeling and analysis.',
            version: 'Version 1.0.0',
            close: 'Close',
            settingsTitle: 'Settings',
            theme: 'Theme',
            languageLabel: 'Language',
            autoSave: 'Auto Save',
            enabled: 'Enabled',
            disabled: 'Disabled',
            imageUploaded: 'Image uploaded successfully',
            fileProcessed: 'File processed successfully',
            projectSaved: 'Project saved successfully',
            projectSavedAs: 'Project saved as',
            enterFileName: 'Enter file name',
            fileName: 'File Name',
            cancel: 'Cancel',
            saveAsTitle: 'Save Project As',
            undoAction: 'Undo last action',
            redoAction: 'Redo last action',
            cutSelection: 'Cut selection',
            copySelection: 'Copy selection',
            pasteSelection: 'Paste selection',
            deleteSelection: 'Delete selection',
            manualDrawingAdded: 'Manual drawing added',
            allDrawingsDeleted: 'All drawings deleted',
            buildingOutlinesToggled: 'Building outlines toggled'
        },
        zh: {
            appTitle: 'KiwiSmart',
            appSubtitle: '智慧型地理資訊系統',
            newProject: '開始新專案',
            openProject: '開啟現有專案',
            file: '檔案',
            edit: '編輯',
            view: '檢視',
            window: '視窗',
            help: '說明',
            home: '首頁',
            newProjectMenu: '新專案',
            openProjectMenu: '開啟專案',
            save: '儲存',
            saveAs: '另存新檔',
            newFile: '新檔案',
            closeProject: '關閉專案',
            closeProgram: '關閉程式',
            undo: '復原',
            redo: '重做',
            cut: '剪下',
            copy: '複製',
            paste: '貼上',
            delete: '刪除',
            select: '選取',
            zoomIn: '放大',
            zoomOut: '縮小',
            fullScreen: '切換全螢幕',
            minimize: '最小化',
            newWindow: '新視窗',
            activityLogs: '活動記錄',
            labelTable: '標籤表格',
            about: '關於',
            settings: '設定',
            preferences: '偏好設定',
            userManual: '使用手冊',
            selectTool: '選擇工具',
            autoLabel: '自動標籤',
            manualLabel: '手動標籤',
            deleteLabel: '刪除標籤',
            activityLog: '活動記錄',
            labelTableSidebar: '標籤表格',
            filters: '篩選器',
            autoLabelingInProgress: '自動建築物標籤中...',
            buildingsLabeled: '建築物已標籤',
            abort: '中止',
            backToHome: '返回首頁',
            saveProgress: '儲存進度',
            exportLabels: '匯出標籤',
            satelliteMapView: '衛星地圖視圖',
            groupId: '群組 ID',
            subGroupId: '子群組 ID',
            buildingType: '建築類型',
            all: '全部',
            residential: '住宅',
            commercial: '商業',
            industrial: '工業',
            projectOpened: '專案已開啟',
            aiLabelingCompleted: 'AI 標籤完成',
            uploadFile: '上傳檔案',
            selectFile: '選擇檔案',
            supportedFormats: '支援格式：Shapefile、GeoJSON、GPKG、GeoTIFF、圖片 (JPG, PNG)',
            fileUploaded: '檔案上傳成功',
            processing: '處理中...',
            aboutTitle: '關於 KiwiSmart',
            aboutContent: 'KiwiSmart 是一個智慧型 GIS 應用程式，用於建築物標籤和分析。',
            version: '版本 1.0.0',
            close: '關閉',
            settingsTitle: '設定',
            theme: '主題',
            languageLabel: '語言',
            autoSave: '自動儲存',
            enabled: '啟用',
            disabled: '停用',
            imageUploaded: '圖片上傳成功',
            fileProcessed: '檔案處理完成',
            projectSaved: '專案儲存成功',
            projectSavedAs: '專案另存為',
            enterFileName: '輸入檔案名稱',
            fileName: '檔案名稱',
            cancel: '取消',
            saveAsTitle: '專案另存新檔',
            undoAction: '復原上一步操作',
            redoAction: '重做上一步操作',
            cutSelection: '剪下選取項目',
            copySelection: '複製選取項目',
            pasteSelection: '貼上選取項目',
            deleteSelection: '刪除選取項目',
            manualDrawingAdded: '手動繪圖已添加',
            allDrawingsDeleted: '所有繪圖已刪除',
            buildingOutlinesToggled: '建築物輪廓已切換'
        }
    };

    const t = translations[language];

    const fabTools = [
        { id: 'select', icon: '🖱️', label: t.selectTool },
        { id: 'ai', icon: '🤖', label: t.autoLabel },
        { id: 'manual', icon: '✏️', label: t.manualLabel },
        { id: 'delete', icon: '🗑️', label: t.deleteLabel },
        { id: 'undo', icon: '↶', label: t.undo },
        { id: 'redo', icon: '↷', label: t.redo }
    ];

    // Event Handlers
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);
            addActivityLog('fileUploaded', 'success');

            // Check if file is an image
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setMapBackground(e.target.result);
                    setImagePreview(e.target.result);
                };
                reader.readAsDataURL(file);
            }

            // Simulate file processing
            setTimeout(() => {
                setProjectData({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    lastModified: file.lastModified,
                    isImage: file.type.startsWith('image/')
                });
                setIsProjectOpen(true);
            }, 1000);
        }
    };

    const handleToolClick = (toolId) => {
        if (toolId === 'ai') {
            setIsAutoLabeling(true);
            setLabelingProgress(0);
            addActivityLog('aiLabelingStarted', 'info');

            const interval = setInterval(() => {
                setLabelingProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setIsAutoLabeling(false);
                        addActivityLog('aiLabelingCompleted', 'success');
                        return 100;
                    }
                    return prev + 2;
                });
            }, 100);
        }
        setSelectedTool(toolId);
        addActivityLog(`toolSelected_${toolId}`, 'info');
    };

    // Drawing functions
    const saveToHistory = (newDrawingData) => {
        const newHistory = drawingHistory.slice(0, historyIndex + 1);
        newHistory.push([...newDrawingData]);
        setDrawingHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleMouseDown = (e) => {
        if (selectedTool === 'manual') {
            setIsDrawing(true);
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / (zoomLevel / 100);
            const y = (e.clientY - rect.top) / (zoomLevel / 100);
            setCurrentPath([{ x, y }]);
        }
    };

    const handleMouseMove = (e) => {
        if (isDrawing && selectedTool === 'manual') {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / (zoomLevel / 100);
            const y = (e.clientY - rect.top) / (zoomLevel / 100);
            setCurrentPath(prev => [...prev, { x, y }]);
        }
    };

    const handleMouseUp = () => {
        if (isDrawing && selectedTool === 'manual' && currentPath.length > 1) {
            const newDrawing = {
                id: Date.now(),
                path: currentPath,
                tool: selectedTool,
                color: '#ff0000',
                timestamp: new Date().toISOString()
            };
            const newDrawingData = [...drawingData, newDrawing];
            setDrawingData(newDrawingData);
            saveToHistory(newDrawingData);
            addActivityLog('manualDrawingAdded', 'info');
        }
        setIsDrawing(false);
        setCurrentPath([]);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setDrawingData(drawingHistory[historyIndex - 1] || []);
            addActivityLog('undoAction', 'info');
        }
    };

    const handleRedo = () => {
        if (historyIndex < drawingHistory.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setDrawingData(drawingHistory[historyIndex + 1]);
            addActivityLog('redoAction', 'info');
        }
    };

    const handleDelete = () => {
        if (drawingData.length > 0) {
            const newDrawingData = [];
            setDrawingData(newDrawingData);
            saveToHistory(newDrawingData);
            addActivityLog('allDrawingsDeleted', 'info');
        }
    };

    const handleSaveProject = () => {
        const projectToSave = {
            name: projectData?.name || 'Untitled Project',
            timestamp: new Date().toISOString(),
            zoomLevel,
            language,
            mapBackground,
            labelData,
            activityLogs: activityLogs.slice(0, 10) // Save last 10 logs
        };

        // Simulate save to local storage or server
        localStorage.setItem('kiwismart_project', JSON.stringify(projectToSave));
        addActivityLog('projectSaved', 'success');

        // Show success message
        alert(language === 'en' ? 'Project saved successfully!' : '專案儲存成功！');
    };

    const handleSaveAsProject = () => {
        if (!saveAsName.trim()) {
            alert(language === 'en' ? 'Please enter a file name' : '請輸入檔案名稱');
            return;
        }

        const projectToSave = {
            name: saveAsName,
            timestamp: new Date().toISOString(),
            zoomLevel,
            language,
            mapBackground,
            labelData,
            activityLogs: activityLogs.slice(0, 10)
        };

        // Save with new name
        localStorage.setItem(`kiwismart_project_${saveAsName}`, JSON.stringify(projectToSave));
        addActivityLog('projectSavedAs', 'success');
        setShowSaveModal(false);
        setSaveAsName('');

        alert(`${language === 'en' ? 'Project saved as' : '專案另存為'}: ${saveAsName}`);
    };

    const handleMenuClick = (action) => {
        switch (action) {
            case 'home':
                setIsProjectOpen(false);
                addActivityLog('returnedHome', 'info');
                break;
            case 'newProject':
                fileInputRef.current?.click();
                addActivityLog('newProjectInitiated', 'info');
                break;
            case 'openProject':
                fileInputRef.current?.click();
                addActivityLog('openProjectInitiated', 'info');
                break;
            case 'save':
                handleSaveProject();
                break;
            case 'saveAs':
                setShowSaveModal(true);
                break;
            case 'zoomIn':
                setZoomLevel(prev => {
                    const newZoom = Math.min(prev + 25, 200);
                    addActivityLog(`zoomedIn_${newZoom}`, 'info');
                    return newZoom;
                });
                break;
            case 'zoomOut':
                setZoomLevel(prev => {
                    const newZoom = Math.max(prev - 25, 50);
                    addActivityLog(`zoomedOut_${newZoom}`, 'info');
                    return newZoom;
                });
                break;
            case 'fullScreen':
                setIsFullScreen(!isFullScreen);
                addActivityLog('fullScreenToggled', 'info');
                break;
            case 'about':
                setShowAboutModal(true);
                break;
            case 'settings':
                setShowSettingsModal(true);
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
        setActiveDropdown(null);
    };

    const addActivityLog = (action, type) => {
        const newLog = {
            id: Date.now(),
            action,
            timestamp: new Date().toLocaleString(),
            type
        };
        setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep max 50 logs
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

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

    const handleExport = () => {
        const exportData = {
            project: {
                name: projectData?.name || 'KiwiSmart Project',
                exportDate: new Date().toISOString(),
                settings: {
                    language,
                    zoomLevel
                }
            },
            labels: labelData,
            statistics: {
                totalBuildings: labelData.length,
                buildingTypes: {
                    residential: labelData.filter(item => item.buildingType === 'residential').length,
                    commercial: labelData.filter(item => item.buildingType === 'commercial').length,
                    industrial: labelData.filter(item => item.buildingType === 'industrial').length
                }
            },
            activitySummary: activityLogs.slice(0, 20)
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `kiwismart_export_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        addActivityLog('labelsExported', 'success');
    };

    const loadSampleImage = (imageType) => {
        const sampleImages = {
            satellite: 'https://picsum.photos/1200/800?random=1',
            aerial: 'https://picsum.photos/1200/800?random=2',
            map: 'https://picsum.photos/1200/800?random=3'
        };

        setMapBackground(sampleImages[imageType]);
        setProjectData({
            name: `Sample ${imageType} image`,
            type: 'image/jpeg',
            size: 1024000,
            lastModified: Date.now(),
            isImage: true,
            isSample: true
        });
        addActivityLog('sampleImageLoaded', 'info');
    };

    const MainPage = () => (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="text-center">
                            {/* Language Selector */}
                            <div className="mb-4">
                                <div className="btn-group">
                                    <button
                                        className={`btn btn-sm ${language === 'en' ? 'btn-light' : 'btn-outline-light'}`}
                                        onClick={() => setLanguage('en')}
                                    >
                                        🇺🇸 English
                                    </button>
                                    <button
                                        className={`btn btn-sm ${language === 'zh' ? 'btn-light' : 'btn-outline-light'}`}
                                        onClick={() => setLanguage('zh')}
                                    >
                                        🇹🇼 中文
                                    </button>
                                </div>
                            </div>

                            <div className="card shadow-lg border-0">
                                <div
                                    className={`card-body p-5 ${isDragOver ? 'bg-light border-primary border-3' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="mb-4">
                                        <h1 className="display-4 fw-bold text-primary mb-3">
                                            {t.appTitle}
                                        </h1>
                                        <p className="lead text-muted">{t.appSubtitle}</p>
                                    </div>

                                    {isDragOver && (
                                        <div className="alert alert-primary text-center mb-4">
                                            <div style={{ fontSize: '2rem' }}>☁️</div>
                                            <div className="mt-2">
                                                {language === 'en' ? 'Drop your file here!' : '在此放置檔案！'}
                                            </div>
                                        </div>
                                    )}

                                    <div className="d-grid gap-3">
                                        <button
                                            className="btn btn-primary btn-lg"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            ➕ {t.newProject}
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary btn-lg"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            📁 {t.openProject}
                                        </button>

                                        <div className="mt-3">
                                            <small className="text-muted d-block mb-2">
                                                {language === 'en' ? 'Try Sample Images:' : '試用範例圖片：'}
                                            </small>
                                            <div className="btn-group w-100" role="group">
                                                <button
                                                    className="btn btn-outline-info btn-sm"
                                                    onClick={() => {
                                                        loadSampleImage('satellite');
                                                        setIsProjectOpen(true);
                                                    }}
                                                >
                                                    🛰️ {language === 'en' ? 'Satellite' : '衛星'}
                                                </button>
                                                <button
                                                    className="btn btn-outline-success btn-sm"
                                                    onClick={() => {
                                                        loadSampleImage('aerial');
                                                        setIsProjectOpen(true);
                                                    }}
                                                >
                                                    ✈️ {language === 'en' ? 'Aerial' : '航拍'}
                                                </button>
                                                <button
                                                    className="btn btn-outline-warning btn-sm"
                                                    onClick={() => {
                                                        loadSampleImage('map');
                                                        setIsProjectOpen(true);
                                                    }}
                                                >
                                                    🗺️ {language === 'en' ? 'Map' : '地圖'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <small className="text-muted d-block">
                                            {t.supportedFormats}
                                        </small>
                                        <small className="text-muted d-block mt-1">
                                            {language === 'en' ? 'Or drag & drop files here' : '或直接拖放檔案至此處'}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                className="d-none"
                accept=".shp,.json,.geojson,.gpkg,.tiff,.tif,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                onChange={handleFileUpload}
            />
        </div>
    );

    const ProjectInterface = () => (
        <div className={`vh-100 d-flex flex-column ${isFullScreen ? 'position-fixed top-0 start-0 w-100 h-100' : ''}`} style={{ zIndex: isFullScreen ? 9999 : 'auto' }}>
            {/* Navigation Bar */}
            <nav className="navbar navbar-dark bg-dark px-3" style={{ minHeight: '48px' }}>
                <div className="d-flex w-100 justify-content-between align-items-center">
                    <div className="d-flex">
                        {/* File Menu */}
                        <div className="dropdown me-3">
                            <button
                                className="btn btn-dark btn-sm dropdown-toggle border-0"
                                type="button"
                                onClick={() => setActiveDropdown(activeDropdown === 'file' ? null : 'file')}
                            >
                                {t.file}
                            </button>
                            {activeDropdown === 'file' && (
                                <div className="dropdown-menu show position-absolute" style={{ zIndex: 1050 }}>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('home')}>
                                        🏠 {t.home}
                                    </button>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('newProject')}>
                                        📄 {t.newProjectMenu}
                                    </button>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('openProject')}>
                                        📁 {t.openProjectMenu}
                                    </button>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('save')}>
                                        💾 {t.save}
                                    </button>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('saveAs')}>
                                        💾 {t.saveAs}
                                    </button>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item" onClick={() => setIsProjectOpen(false)}>
                                        ❌ {t.closeProject}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Edit Menu */}
                        <div className="dropdown me-3">
                            <button
                                className="btn btn-dark btn-sm dropdown-toggle border-0"
                                type="button"
                                onClick={() => setActiveDropdown(activeDropdown === 'edit' ? null : 'edit')}
                            >
                                {t.edit}
                            </button>
                            {activeDropdown === 'edit' && (
                                <div className="dropdown-menu show position-absolute" style={{ zIndex: 1050 }}>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('undo')}>
                                        ↶ {t.undo}
                                    </button>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('redo')}>
                                        ↷ {t.redo}
                                    </button>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('cut')}>
                                        ✂️ {t.cut}
                                    </button>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('copy')}>
                                        📋 {t.copy}
                                    </button>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('paste')}>
                                        📌 {t.paste}
                                    </button>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('delete')}>
                                        🗑️ {t.delete}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* View Menu */}
                        <div className="dropdown me-3">
                            <button
                                className="btn btn-dark btn-sm dropdown-toggle border-0"
                                type="button"
                                onClick={() => setActiveDropdown(activeDropdown === 'view' ? null : 'view')}
                            >
                                {t.view}
                            </button>
                            {activeDropdown === 'view' && (
                                <div className="dropdown-menu show position-absolute" style={{ zIndex: 1050 }}>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('zoomIn')}>
                                        🔍 {t.zoomIn} ({zoomLevel}%)
                                    </button>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('zoomOut')}>
                                        🔍 {t.zoomOut} ({zoomLevel}%)
                                    </button>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('fullScreen')}>
                                        ⛶ {t.fullScreen}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Window Menu */}
                        <div className="dropdown me-3">
                            <button
                                className="btn btn-dark btn-sm dropdown-toggle border-0"
                                type="button"
                                onClick={() => setActiveDropdown(activeDropdown === 'window' ? null : 'window')}
                            >
                                {t.window}
                            </button>
                            {activeDropdown === 'window' && (
                                <div className="dropdown-menu show position-absolute" style={{ zIndex: 1050 }}>
                                    <button className="dropdown-item" onClick={() => setSidebarPanel('activity')}>
                                        📋 {t.activityLogs}
                                    </button>
                                    <button className="dropdown-item" onClick={() => setSidebarPanel('table')}>
                                        📊 {t.labelTable}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Help Menu */}
                        <div className="dropdown">
                            <button
                                className="btn btn-dark btn-sm dropdown-toggle border-0"
                                type="button"
                                onClick={() => setActiveDropdown(activeDropdown === 'help' ? null : 'help')}
                            >
                                {t.help}
                            </button>
                            {activeDropdown === 'help' && (
                                <div className="dropdown-menu show position-absolute" style={{ zIndex: 1050 }}>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('about')}>
                                        ℹ️ {t.about}
                                    </button>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('settings')}>
                                        ⚙️ {t.settings}
                                    </button>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('userManual')}>
                                        📖 {t.userManual}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="d-flex align-items-center">
                        {/* Language Switcher */}
                        <div className="btn-group me-3">
                            <button
                                className={`btn btn-sm ${language === 'en' ? 'btn-light' : 'btn-outline-light'}`}
                                onClick={() => setLanguage('en')}
                            >
                                EN
                            </button>
                            <button
                                className={`btn btn-sm ${language === 'zh' ? 'btn-light' : 'btn-outline-light'}`}
                                onClick={() => setLanguage('zh')}
                            >
                                中
                            </button>
                        </div>

                        {/* Window Controls */}
                        <button className="btn btn-outline-light btn-sm me-1" onClick={() => handleMenuClick('minimize')}>─</button>
                        <button className="btn btn-outline-light btn-sm me-1" onClick={() => handleMenuClick('fullScreen')}>
                            {isFullScreen ? '🗗' : '☐'}
                        </button>
                        <button className="btn btn-outline-light btn-sm" onClick={() => setIsProjectOpen(false)}>✕</button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-grow-1 position-relative bg-light" onClick={() => setActiveDropdown(null)}>
                {/* Map Area Container with Proper Zoom */}
                <div className="h-100 position-relative overflow-hidden">
                    <div
                        className="h-100 position-relative d-flex align-items-center justify-content-center"
                        style={{
                            backgroundImage: mapBackground
                                ? `url(${mapBackground})`
                                : 'linear-gradient(45deg, #e9ecef 25%, transparent 25%), linear-gradient(-45deg, #e9ecef 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e9ecef 75%), linear-gradient(-45deg, transparent 75%, #e9ecef 75%)',
                            backgroundSize: mapBackground ? 'cover' : '20px 20px',
                            backgroundPosition: mapBackground ? 'center' : '0 0, 0 10px, 10px -10px, -10px 0px',
                            backgroundRepeat: mapBackground ? 'no-repeat' : 'repeat',
                            transform: `scale(${zoomLevel / 100})`,
                            transformOrigin: 'center',
                            transition: 'transform 0.3s ease-in-out',
                            cursor: selectedTool === 'manual' ? 'crosshair' : selectedTool === 'delete' ? 'not-allowed' : 'default'
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={() => {
                            setIsDrawing(false);
                            setCurrentPath([]);
                        }}
                    >
                        {/* Map placeholder or uploaded image info */}
                        {!mapBackground ? (
                            <div className="text-center text-muted">
                                <div style={{ fontSize: '4rem' }}>📍</div>
                                <h4>{t.satelliteMapView}</h4>
                                {projectData && (
                                    <div className="mt-3">
                                        <small className="badge bg-primary">{projectData.name}</small>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="position-absolute top-0 end-0 m-3" style={{
                                transform: `scale(${100 / zoomLevel})`,
                                transformOrigin: 'top right'
                            }}>
                                <div className="card bg-dark text-white" style={{ opacity: 0.9 }}>
                                    <div className="card-body p-2">
                                        <small>
                                            📸 {projectData?.name}<br />
                                            {Math.round(projectData?.size / 1024)} KB<br />
                                            Zoom: {zoomLevel}%
                                        </small>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SVG Drawing Layer */}
                        <svg
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{
                                pointerEvents: 'none',
                                zIndex: 10
                            }}
                        >
                            {/* Existing Drawings */}
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

                            {/* Current Drawing Path */}
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

                        {/* Building Outlines - Now Optional */}
                        {showBuildingOutlines && (
                            <>
                                <div
                                    className="position-absolute border border-danger border-2 rounded"
                                    style={{
                                        top: '25%',
                                        right: '33%',
                                        width: '100px',
                                        height: '60px',
                                        opacity: 0.8,
                                        animation: 'pulse 2s infinite'
                                    }}
                                ></div>
                                <div
                                    className="position-absolute border border-danger border-2 rounded"
                                    style={{
                                        bottom: '33%',
                                        right: '25%',
                                        width: '120px',
                                        height: '80px',
                                        opacity: 0.8,
                                        animation: 'pulse 2s infinite'
                                    }}
                                ></div>
                            </>
                        )}
                    </div>

                    {/* Map Controls - Fixed Position */}
                    <div className="position-absolute top-0 start-0 m-3" style={{ zIndex: 1001 }}>
                        <div className="btn-group-vertical" role="group">
                            <button
                                className="btn btn-light btn-sm border"
                                onClick={() => handleMenuClick('zoomIn')}
                                title="Zoom In"
                                disabled={zoomLevel >= 200}
                            >
                                ➕
                            </button>
                            <button
                                className="btn btn-light btn-sm border"
                                onClick={() => handleMenuClick('zoomOut')}
                                title="Zoom Out"
                                disabled={zoomLevel <= 50}
                            >
                                ➖
                            </button>
                            <button
                                className="btn btn-info btn-sm border"
                                title={`Current Zoom: ${zoomLevel}%`}
                                disabled
                            >
                                {zoomLevel}%
                            </button>
                            {mapBackground && (
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
                        </div>
                    </div>

                    {/* Sidebar Tools - Fixed Position */}
                    <div className="position-absolute bottom-0 start-0 m-3 mb-5" style={{ zIndex: 1001 }}>
                        <div className="btn-group-vertical" role="group">
                            <button
                                className={`btn btn-sm border mb-1 d-flex flex-column align-items-center py-2 ${sidebarPanel === 'activity' ? 'btn-primary' : 'btn-light'
                                    }`}
                                onClick={() => setSidebarPanel(sidebarPanel === 'activity' ? null : 'activity')}
                            >
                                📋
                                <small className="mt-1" style={{ fontSize: '9px' }}>{t.activityLog}</small>
                            </button>
                            <button
                                className={`btn btn-sm border mb-1 d-flex flex-column align-items-center py-2 ${sidebarPanel === 'table' ? 'btn-primary' : 'btn-light'
                                    }`}
                                onClick={() => setSidebarPanel(sidebarPanel === 'table' ? null : 'table')}
                            >
                                📊
                                <small className="mt-1" style={{ fontSize: '9px' }}>{t.labelTableSidebar}</small>
                            </button>
                            <button
                                className={`btn btn-sm border d-flex flex-column align-items-center py-2 ${sidebarPanel === 'filters' ? 'btn-primary' : 'btn-light'
                                    }`}
                                onClick={() => setSidebarPanel(sidebarPanel === 'filters' ? null : 'filters')}
                            >
                                🔍
                                <small className="mt-1" style={{ fontSize: '9px' }}>{t.filters}</small>
                            </button>
                        </div>
                    </div>

                    {/* FAB Tools - Fixed Position */}
                    <div className="position-absolute bottom-0 end-0 m-3 mb-5" style={{ zIndex: 1001 }}>
                        {fabExpanded && (
                            <div className="d-flex align-items-center mb-3 p-2 rounded-pill" style={{
                                background: 'rgba(0,0,0,0.85)'
                            }}>
                                {fabTools.map((tool) => (
                                    <button
                                        key={tool.id}
                                        className={`btn btn-sm rounded-circle me-2 d-flex align-items-center justify-content-center fab-tool ${selectedTool === tool.id ? 'btn-primary' : 'btn-light'
                                            }`}
                                        style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}
                                        onClick={() => {
                                            if (tool.id === 'undo') {
                                                handleUndo();
                                            } else if (tool.id === 'redo') {
                                                handleRedo();
                                            } else if (tool.id === 'delete') {
                                                handleDelete();
                                            } else {
                                                handleToolClick(tool.id);
                                            }
                                        }}
                                        title={tool.label}
                                        disabled={
                                            (tool.id === 'undo' && historyIndex <= 0) ||
                                            (tool.id === 'redo' && historyIndex >= drawingHistory.length - 1) ||
                                            (tool.id === 'delete' && drawingData.length === 0)
                                        }
                                    >
                                        {tool.icon}
                                    </button>
                                ))}
                            </div>
                        )}
                        <button
                            className="btn btn-secondary rounded-circle d-flex align-items-center justify-content-center shadow fab-tool"
                            style={{ width: '56px', height: '56px', fontSize: '1.5rem' }}
                            onClick={() => setFabExpanded(!fabExpanded)}
                        >
                            {fabExpanded ? '✕' : '🔧'}
                        </button>
                    </div>

                    {/* Sidebar Panel - Fixed Position */}
                    {sidebarPanel && (
                        <div
                            className="card position-absolute shadow-lg border-0"
                            style={{
                                left: '80px',
                                bottom: '80px',
                                width: '320px',
                                height: '400px',
                                zIndex: 1002
                            }}
                        >
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">
                                    {sidebarPanel === 'activity' ? t.activityLog :
                                        sidebarPanel === 'table' ? t.labelTableSidebar : t.filters}
                                </h6>
                                <button
                                    className="btn btn-link btn-sm p-0 text-muted"
                                    onClick={() => setSidebarPanel(null)}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="card-body p-3 overflow-auto">
                                {sidebarPanel === 'activity' && (
                                    <div>
                                        {activityLogs.map((log) => (
                                            <div key={log.id} className={`border-start border-3 ps-3 py-2 mb-3 border-${log.type === 'success' ? 'success' : log.type === 'info' ? 'primary' : 'warning'}`}>
                                                <div className="fw-semibold">{t[log.action] || log.action}</div>
                                                <small className="text-muted">{log.timestamp}</small>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {sidebarPanel === 'table' && (
                                    <div className="table-responsive">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>{t.groupId}</th>
                                                    <th>{t.subGroupId}</th>
                                                    <th>{t.buildingType}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {labelData.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.groupId}</td>
                                                        <td>{item.subGroupId}</td>
                                                        <td>
                                                            <span className={`badge bg-${item.buildingType === 'residential' ? 'success' : item.buildingType === 'commercial' ? 'primary' : 'warning'}`}>
                                                                {t[item.buildingType]}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {sidebarPanel === 'filters' && (
                                    <div>
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <strong>Drawing Tools Status:</strong>
                                                <span className="badge bg-info">{drawingData.length} drawings</span>
                                            </div>
                                            <div className="small">
                                                <div>Selected Tool: <span className="badge bg-primary">{selectedTool}</span></div>
                                                <div>Undo Available: <span className={`badge bg-${historyIndex > 0 ? 'success' : 'secondary'}`}>{historyIndex > 0 ? 'Yes' : 'No'}</span></div>
                                                <div>Redo Available: <span className={`badge bg-${historyIndex < drawingHistory.length - 1 ? 'success' : 'secondary'}`}>{historyIndex < drawingHistory.length - 1 ? 'Yes' : 'No'}</span></div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="mb-3">
                                            <label className="form-label">{t.groupId}</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder={`${language === 'en' ? 'Enter' : '輸入'} ${t.groupId}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">{t.buildingType}</label>
                                            <select className="form-select form-select-sm">
                                                <option>{t.all}</option>
                                                <option>{t.residential}</option>
                                                <option>{t.commercial}</option>
                                                <option>{t.industrial}</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Control Bar - Fixed Position */}
                <div className="position-absolute bottom-0 start-0 end-0 bg-dark p-3" style={{ zIndex: 1000 }}>
                    <div className="d-flex justify-content-center gap-3">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setIsProjectOpen(false)}
                        >
                            🏠 {t.backToHome}
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => handleMenuClick('save')}
                        >
                            💾 {t.saveProgress}
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={handleExport}
                        >
                            📥 {t.exportLabels}
                        </button>
                    </div>
                </div>
            </div>

            {/* Auto-labeling Progress Modal */}
            {isAutoLabeling && (
                <div
                    className="modal fade show"
                    style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000 }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{t.autoLabelingInProgress}</h5>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between small text-muted mb-2">
                                        <span>{Math.floor(labelingProgress)} / 100 {t.buildingsLabeled}</span>
                                        <span>{Math.floor(labelingProgress)}%</span>
                                    </div>
                                    <div className="progress">
                                        <div
                                            className="progress-bar bg-primary progress-bar-striped progress-bar-animated"
                                            role="progressbar"
                                            style={{ width: `${labelingProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => setIsAutoLabeling(false)}
                                >
                                    {t.abort}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Save As Modal */}
            {showSaveModal && (
                <div
                    className="modal fade show"
                    style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000 }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{t.saveAsTitle}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowSaveModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">{t.fileName}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={saveAsName}
                                        onChange={(e) => setSaveAsName(e.target.value)}
                                        placeholder={t.enterFileName}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowSaveModal(false)}
                                >
                                    {t.cancel}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSaveAsProject}
                                >
                                    {t.save}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* About Modal */}
            {showAboutModal && (
                <div
                    className="modal fade show"
                    style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000 }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{t.aboutTitle}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowAboutModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body text-center">
                                <div style={{ fontSize: '3rem' }} className="mb-3">🗺️</div>
                                <h4>{t.appTitle}</h4>
                                <p className="text-muted">{t.aboutContent}</p>
                                <hr />
                                <small className="text-muted">
                                    {t.version}<br />
                                    © 2024 KiwiSmart Technologies
                                </small>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowAboutModal(false)}
                                >
                                    {t.close}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettingsModal && (
                <div
                    className="modal fade show"
                    style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000 }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{t.settingsTitle}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowSettingsModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">{t.languageLabel}</label>
                                    <select
                                        className="form-select"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                    >
                                        <option value="en">English</option>
                                        <option value="zh">中文 (Traditional Chinese)</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">{t.theme}</label>
                                    <select className="form-select">
                                        <option>Light</option>
                                        <option>Dark</option>
                                        <option>Auto</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" id="autoSave" defaultChecked />
                                        <label className="form-check-label" htmlFor="autoSave">
                                            {t.autoSave}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowSettingsModal(false)}
                                >
                                    {t.close}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setShowSettingsModal(false);
                                        addActivityLog('settingsSaved', 'success');
                                    }}
                                >
                                    {t.save}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                className="d-none"
                accept=".shp,.json,.geojson,.gpkg,.tiff,.tif,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                onChange={handleFileUpload}
            />
        </div>
    );

    return (
        <div className="App">
            <style>{`
        @keyframes pulse {
          0%, 100% {
            border-color: #dc3545;
            opacity: 0.8;
          }
          50% {
            border-color: #bd2130;
            opacity: 1;
          }
        }
        
        .fab-tool {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .fab-tool:hover {
          transform: scale(1.05);
        }
        
        .dropdown-menu.show {
          display: block;
          animation: fadeIn 0.15s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .card {
          backdrop-filter: blur(10px);
        }
        
        .progress-bar-animated {
          animation: progress-bar-stripes 1s linear infinite;
        }
        
        @keyframes progress-bar-stripes {
          0% { background-position: 1rem 0; }
          100% { background-position: 0 0; }
        }
        
        .btn {
          transition: all 0.15s ease-in-out;
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        
        .modal {
          backdrop-filter: blur(3px);
        }
        
        /* Fix for zoom controls at different zoom levels */
        .position-absolute {
          pointer-events: auto;
        }
        
        /* Ensure UI elements stay visible at all zoom levels */
        .fixed-ui {
          position: fixed !important;
          z-index: 1001;
        }
      `}</style>

            {!isProjectOpen ? <MainPage /> : <ProjectInterface />}
        </div>
    );
};

export default KiwiSmartApp;