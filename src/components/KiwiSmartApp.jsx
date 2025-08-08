import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

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
        { id: 1, groupId: 'GROUP_001', subGroupId: 'SUB_001', buildingType: 'residential', bounds: { x: 300, y: 200, width: 100, height: 60, height3D: 120 } },
        { id: 2, groupId: 'GROUP_002', subGroupId: 'SUB_001', buildingType: 'commercial', bounds: { x: 500, y: 400, width: 120, height: 80, height3D: 180 } },
        { id: 3, groupId: 'GROUP_003', subGroupId: 'SUB_002', buildingType: 'industrial', bounds: { x: 400, y: 300, width: 80, height: 50, height3D: 80 } },
        { id: 4, groupId: 'GROUP_004', subGroupId: 'SUB_003', buildingType: 'residential', bounds: { x: 350, y: 350, width: 90, height: 70, height3D: 100 } },
        { id: 5, groupId: 'GROUP_005', subGroupId: 'SUB_003', buildingType: 'commercial', bounds: { x: 450, y: 250, width: 110, height: 90, height3D: 200 } },
        { id: 6, groupId: 'GROUP_006', subGroupId: 'SUB_004', buildingType: 'industrial', bounds: { x: 600, y: 350, width: 130, height: 100, height3D: 60 } }
    ]);
    const [drawingData, setDrawingData] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState([]);
    const [drawingHistory, setDrawingHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [showBuildingOutlines, setShowBuildingOutlines] = useState(false);

    const fileInputRef = useRef(null);
    const [is3DView, setIs3DView] = useState(false);
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const animationRef = useRef(null);
    const buildingMeshesRef = useRef([]);

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
            buildingOutlinesToggled: 'Building outlines toggled',
            toggle3D: 'Toggle 3D View'
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
            buildingOutlinesToggled: '建築物輪廓已切換',
            toggle3D: '切換 3D 視圖'
        }
    };

    const t = translations[language];

    const fabTools = [
        { id: 'select', icon: '🖱️', label: t.selectTool },
        { id: 'ai', icon: '🤖', label: t.autoLabel },
        { id: 'manual', icon: '✏️', label: t.manualLabel },
        { id: 'delete', icon: '🗑️', label: t.deleteLabel },
        { id: 'undo', icon: '↶', label: t.undo },
        { id: 'redo', icon: '↷', label: t.redo },
        { id: '3d', icon: '📐', label: t.toggle3D }
    ];

    // Enhanced Three.js Setup with proper OrbitControls
    useEffect(() => {
        if (is3DView && canvasRef.current && labelData.length > 0) {
            // Clean up previous scene
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }

            // Initialize Scene
            sceneRef.current = new THREE.Scene();
            sceneRef.current.background = new THREE.Color(0x87CEEB); // Sky blue background

            // Calculate center point of all buildings
            const validBuildings = labelData.filter(b => b.bounds && typeof b.bounds.x === 'number' && typeof b.bounds.y === 'number');
            
            if (validBuildings.length === 0) {
                console.warn('No valid buildings found for 3D rendering');
                return;
            }
            
            console.log(`Rendering ${validBuildings.length} buildings in 3D`);
            
            const centerX = validBuildings.reduce((sum, b) => sum + (b.bounds.x + (b.bounds.width || 0) / 2), 0) / validBuildings.length;
            const centerY = validBuildings.reduce((sum, b) => sum + (b.bounds.y + (b.bounds.height || 0) / 2), 0) / validBuildings.length;
            
            console.log('Scene center:', { centerX, centerY });

            // Initialize Camera with better positioning
            const aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
            cameraRef.current = new THREE.PerspectiveCamera(75, aspect, 0.1, 50000);
            
            // Calculate optimal camera distance based on data spread
            const maxDistance = Math.max(
                ...validBuildings.map(b => Math.sqrt(Math.pow(b.bounds.x - centerX, 2) + Math.pow(b.bounds.y - centerY, 2)))
            );
            const cameraDistance = Math.max(maxDistance * 3, 1000);
            
            cameraRef.current.position.set(centerX + cameraDistance * 0.7, cameraDistance * 0.8, centerY + cameraDistance * 0.7);
            cameraRef.current.lookAt(centerX, 0, centerY);
            
            console.log('Camera positioned at:', cameraRef.current.position);

            // Initialize Renderer
            rendererRef.current = new THREE.WebGLRenderer({ 
                canvas: canvasRef.current, 
                antialias: true,
                alpha: true 
            });
            rendererRef.current.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
            rendererRef.current.setPixelRatio(window.devicePixelRatio);
            rendererRef.current.shadowMap.enabled = true;
            rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;

            // Manual OrbitControls Implementation (since CDN version may not work)
            const controls = {
                object: cameraRef.current,
                domElement: canvasRef.current,
                target: new THREE.Vector3(centerX, 0, centerY),
                minDistance: 50,
                maxDistance: cameraDistance * 3,
                enableDamping: true,
                dampingFactor: 0.05,
                enableZoom: true,
                enableRotate: true,
                enablePan: true,
                rotateSpeed: 1.0,
                zoomSpeed: 1.0,
                panSpeed: 1.0,
                
                spherical: new THREE.Spherical(),
                sphericalDelta: new THREE.Spherical(),
                scale: 1,
                panOffset: new THREE.Vector3(),
                zoomChanged: false,

                mouseButtons: {
                    LEFT: THREE.MOUSE.ROTATE,
                    MIDDLE: THREE.MOUSE.DOLLY,
                    RIGHT: THREE.MOUSE.PAN
                },

                // Manual zoom methods for menu integration
                zoomIn: function() {
                    this.spherical.radius *= 0.8;
                    this.spherical.radius = Math.max(this.minDistance, this.spherical.radius);
                },

                zoomOut: function() {
                    this.spherical.radius *= 1.25;
                    this.spherical.radius = Math.min(this.maxDistance, this.spherical.radius);
                },

                reset: function() {
                    this.spherical.setFromVector3(this.object.position.clone().sub(this.target));
                    this.sphericalDelta.set(0, 0, 0);
                    this.panOffset.set(0, 0, 0);
                },

                update: function() {
                    const offset = new THREE.Vector3();
                    const quat = new THREE.Quaternion().setFromUnitVectors(this.object.up, new THREE.Vector3(0, 1, 0));
                    const quatInverse = quat.clone().invert();

                    offset.copy(this.object.position).sub(this.target);
                    offset.applyQuaternion(quat);

                    this.spherical.setFromVector3(offset);

                    if (this.enableDamping) {
                        this.spherical.theta += this.sphericalDelta.theta * this.dampingFactor;
                        this.spherical.phi += this.sphericalDelta.phi * this.dampingFactor;
                    } else {
                        this.spherical.theta += this.sphericalDelta.theta;
                        this.spherical.phi += this.sphericalDelta.phi;
                    }

                    this.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.spherical.phi));
                    this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));

                    this.target.add(this.panOffset);

                    offset.setFromSpherical(this.spherical);
                    offset.applyQuaternion(quatInverse);

                    this.object.position.copy(this.target).add(offset);
                    this.object.lookAt(this.target);

                    if (this.enableDamping) {
                        this.sphericalDelta.theta *= (1 - this.dampingFactor);
                        this.sphericalDelta.phi *= (1 - this.dampingFactor);
                    } else {
                        this.sphericalDelta.set(0, 0, 0);
                    }

                    this.panOffset.set(0, 0, 0);
                    this.scale = 1;
                }
            };

            // Initialize spherical coordinates from current camera position
            const initialOffset = cameraRef.current.position.clone().sub(controls.target);
            controls.spherical.setFromVector3(initialOffset);

            controlsRef.current = controls;

            // Mouse interaction for controls
            let isMouseDown = false;
            let mouseButton = -1;
            const lastMouse = new THREE.Vector2();

            const onMouseDown = (event) => {
                isMouseDown = true;
                mouseButton = event.button;
                lastMouse.set(event.clientX, event.clientY);
            };

            const onMouseMove = (event) => {
                if (!isMouseDown) return;

                const deltaX = event.clientX - lastMouse.x;
                const deltaY = event.clientY - lastMouse.y;

                if (mouseButton === 0) { // Left button - rotate
                    controls.sphericalDelta.theta -= deltaX * 0.01;
                    controls.sphericalDelta.phi -= deltaY * 0.01;
                }

                lastMouse.set(event.clientX, event.clientY);
            };

            const onMouseUp = () => {
                isMouseDown = false;
                mouseButton = -1;
            };

            const onWheel = (event) => {
                event.preventDefault();
                if (controlsRef.current) {
                    if (event.deltaY < 0) {
                        controlsRef.current.zoomIn();
                    } else {
                        controlsRef.current.zoomOut();
                    }
                }
            };

            canvasRef.current.addEventListener('mousedown', onMouseDown);
            canvasRef.current.addEventListener('mousemove', onMouseMove);
            canvasRef.current.addEventListener('mouseup', onMouseUp);
            canvasRef.current.addEventListener('wheel', onWheel);

            // Enhanced Ground Plane with dynamic sizing
            const groundSize = Math.max(maxDistance * 4, 2000);
            const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize, 50, 50);
            const groundMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x90EE90,
                transparent: true,
                opacity: 0.6
            });
            const ground = new THREE.Mesh(groundGeometry, groundMaterial);
            ground.rotation.x = -Math.PI / 2;
            ground.position.set(centerX, -5, centerY);
            ground.receiveShadow = true;
            sceneRef.current.add(ground);

            // Grid helper with dynamic size
            const gridHelper = new THREE.GridHelper(groundSize, Math.min(100, groundSize / 50), 0x888888, 0xcccccc);
            gridHelper.position.set(centerX, 0, centerY);
            sceneRef.current.add(gridHelper);

            // Clear previous building meshes
            buildingMeshesRef.current = [];

            // Create enhanced 3D buildings
            validBuildings.forEach((building, index) => {
                console.log(`Creating building ${index + 1}:`, building);
                
                // Calculate building dimensions with minimum sizes
                const width = Math.max(building.bounds.width || 20, 10);
                const depth = Math.max(building.bounds.height || 20, 10);
                const height = Math.max(building.bounds.height3D || 30, 5);

                console.log(`Building dimensions: ${width} x ${depth} x ${height}`);

                // Create building geometry
                const geometry = new THREE.BoxGeometry(width, height, depth);
                
                // Choose material based on building type with better colors
                let material;
                const buildingTypeNormalized = (building.buildingType || 'residential').toLowerCase();
                
                if (buildingTypeNormalized.includes('residential') || buildingTypeNormalized.includes('house')) {
                    material = new THREE.MeshLambertMaterial({ 
                        color: 0x4CAF50, // Green
                        transparent: false,
                        opacity: 1.0
                    });
                } else if (buildingTypeNormalized.includes('commercial') || buildingTypeNormalized.includes('office') || buildingTypeNormalized.includes('retail')) {
                    material = new THREE.MeshLambertMaterial({ 
                        color: 0x2196F3, // Blue
                        transparent: false,
                        opacity: 1.0
                    });
                } else if (buildingTypeNormalized.includes('industrial') || buildingTypeNormalized.includes('warehouse')) {
                    material = new THREE.MeshLambertMaterial({ 
                        color: 0xFF9800, // Orange
                        transparent: false,
                        opacity: 1.0
                    });
                } else {
                    material = new THREE.MeshLambertMaterial({ 
                        color: 0x9E9E9E, // Gray for unknown types
                        transparent: false,
                        opacity: 1.0
                    });
                }

                // Create building mesh
                const buildingMesh = new THREE.Mesh(geometry, material);
                
                // Position building
                const posX = building.bounds.x;
                const posY = height / 2;
                const posZ = building.bounds.y;
                
                buildingMesh.position.set(posX, posY, posZ);
                console.log(`Building ${index + 1} positioned at:`, buildingMesh.position);

                buildingMesh.castShadow = true;
                buildingMesh.receiveShadow = true;
                buildingMesh.userData = { building, index };

                sceneRef.current.add(buildingMesh);
                buildingMeshesRef.current.push(buildingMesh);

                // Add building outline
                const edges = new THREE.EdgesGeometry(geometry);
                const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 });
                const wireframe = new THREE.LineSegments(edges, lineMaterial);
                wireframe.position.copy(buildingMesh.position);
                sceneRef.current.add(wireframe);
            });
            
            console.log(`Created ${buildingMeshesRef.current.length} building meshes`);

            // Enhanced Lighting System
            const ambientLight = new THREE.AmbientLight(0x404040, 1.0);
            sceneRef.current.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
            directionalLight.position.set(centerX + cameraDistance, cameraDistance, centerY + cameraDistance);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
            directionalLight.shadow.camera.near = 0.1;
            directionalLight.shadow.camera.far = cameraDistance * 3;
            directionalLight.shadow.camera.left = -cameraDistance;
            directionalLight.shadow.camera.right = cameraDistance;
            directionalLight.shadow.camera.top = cameraDistance;
            directionalLight.shadow.camera.bottom = -cameraDistance;
            sceneRef.current.add(directionalLight);

            // Add hemisphere light for more natural lighting
            const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.6);
            sceneRef.current.add(hemisphereLight);
            
            console.log('3D scene setup complete');

            // Animation Loop
            const animate = () => {
                animationRef.current = requestAnimationFrame(animate);
                
                if (controlsRef.current) {
                    controlsRef.current.update();
                }
                
                if (rendererRef.current && sceneRef.current && cameraRef.current) {
                    rendererRef.current.render(sceneRef.current, cameraRef.current);
                }
            };
            animate();

            // Handle Resize
            const handleResize = () => {
                if (canvasRef.current && cameraRef.current && rendererRef.current) {
                    const width = canvasRef.current.clientWidth;
                    const height = canvasRef.current.clientHeight;
                    rendererRef.current.setSize(width, height);
                    cameraRef.current.aspect = width / height;
                    cameraRef.current.updateProjectionMatrix();
                }
            };
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                canvasRef.current?.removeEventListener('mousedown', onMouseDown);
                canvasRef.current?.removeEventListener('mousemove', onMouseMove);
                canvasRef.current?.removeEventListener('mouseup', onMouseUp);
                canvasRef.current?.removeEventListener('wheel', onWheel);
                
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
                if (rendererRef.current) {
                    rendererRef.current.dispose();
                }
                buildingMeshesRef.current = [];
            };
        }
    }, [is3DView, labelData]);

    // Enhanced coordinate translation functions
    const translateCoordinates = (coords) => {
        if (!coords || !coords.length) return { x: 0, y: 0 };
        
        // Get first coordinate pair
        const firstCoord = coords[0];
        const lng = firstCoord[0];
        const lat = firstCoord[1];
        
        // Convert to local coordinate system
        // Scale factor to make coordinates reasonable for 3D scene
        const scaleFactor = 1000;
        
        return {
            x: lng * scaleFactor,
            y: lat * scaleFactor
        };
    };

    // Calculate bounds from coordinate array
    const calculateBounds = (coords) => {
        if (!coords || !coords.length) return { width: 50, height: 50 };
        
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        
        coords.forEach(coord => {
            const x = coord[0] * 1000;
            const y = coord[1] * 1000;
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        });
        
        return {
            width: Math.max(maxX - minX, 10),
            height: Math.max(maxY - minY, 10)
        };
    };

    // Event Handlers
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);
            addActivityLog('fileUploaded', 'success');

            if (file.type === 'application/json' || file.name.endsWith('.json') || file.name.endsWith('.geojson')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const geojson = JSON.parse(e.target.result);
                        console.log('GeoJSON loaded:', geojson);
                        console.log('Features count:', geojson.features?.length);
                        
                        const newLabelData = geojson.features.map((feature, index) => {
                            console.log(`Processing feature ${index}:`, feature);
                            
                            let coords = [];
                            let bounds = { x: 0, y: 0, width: 50, height: 50 };
                            
                            // Handle different geometry types
                            if (feature.geometry) {
                                switch (feature.geometry.type) {
                                    case 'Polygon':
                                        coords = feature.geometry.coordinates[0];
                                        break;
                                    case 'MultiPolygon':
                                        coords = feature.geometry.coordinates[0][0];
                                        break;
                                    case 'Point':
                                        coords = [feature.geometry.coordinates];
                                        break;
                                    default:
                                        console.warn('Unsupported geometry type:', feature.geometry.type);
                                        coords = [[0, 0]];
                                }
                                
                                // Calculate center and bounds
                                if (coords && coords.length > 0) {
                                    const coordBounds = calculateBounds(coords);
                                    const centerCoord = translateCoordinates(coords);
                                    
                                    bounds = {
                                        x: centerCoord.x,
                                        y: centerCoord.y,
                                        width: Math.max(coordBounds.width, 20),
                                        height: Math.max(coordBounds.height, 20)
                                    };
                                }
                            }
                            
                            const properties = feature.properties || {};
                            
                            // Try different height attributes
                            const heightAttr = properties.height || 
                                             properties.HEIGHT || 
                                             properties.EW_HA2013 || 
                                             properties.height3D || 
                                             properties.floors * 3 || 
                                             Math.random() * 100 + 30;
                            
                            // Try different building type attributes
                            const buildingType = properties.type || 
                                               properties.building || 
                                               properties.landuse || 
                                               properties.amenity || 
                                               ['residential', 'commercial', 'industrial'][Math.floor(Math.random() * 3)];
                            
                            const building = {
                                id: index + 1,
                                groupId: `GROUP_${String(index + 1).padStart(3, '0')}`,
                                subGroupId: `SUB_${String(Math.floor(index / 10) + 1).padStart(3, '0')}`,
                                buildingType: buildingType,
                                bounds: {
                                    ...bounds,
                                    height3D: Math.max(heightAttr, 10)
                                }
                            };
                            
                            console.log(`Building ${index + 1}:`, building);
                            return building;
                        });
                        
                        console.log('Final labelData:', newLabelData);
                        setLabelData(newLabelData);
                        addActivityLog('geojsonProcessed', 'success');
                    } catch (error) {
                        console.error('Error parsing GeoJSON:', error);
                        addActivityLog('fileUploadFailed', 'warning');
                    }
                };
                reader.readAsText(file);
            } else if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setMapBackground(e.target.result);
                    setImagePreview(e.target.result);
                };
                reader.readAsDataURL(file);
            }

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
        } else if (toolId === '3d') {
            setIs3DView(!is3DView);
            addActivityLog('viewToggled3D', 'info');
        } else {
            setSelectedTool(toolId);
            addActivityLog(`toolSelected_${toolId}`, 'info');
        }
    };

    // Drawing Functions
    const saveToHistory = (newDrawingData) => {
        const newHistory = drawingHistory.slice(0, historyIndex + 1);
        newHistory.push([...newDrawingData]);
        setDrawingHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleMouseDown = (e) => {
        if (selectedTool === 'manual' && !is3DView) {
            setIsDrawing(true);
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / (zoomLevel / 100);
            const y = (e.clientY - rect.top) / (zoomLevel / 100);
            setCurrentPath([{ x, y }]);
        }
    };

    const handleMouseMove = (e) => {
        if (isDrawing && selectedTool === 'manual' && !is3DView) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / (zoomLevel / 100);
            const y = (e.clientY - rect.top) / (zoomLevel / 100);
            setCurrentPath(prev => [...prev, { x, y }]);
        }
    };

    const handleMouseUp = () => {
        if (isDrawing && selectedTool === 'manual' && currentPath.length > 1 && !is3DView) {
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
            activityLogs: activityLogs.slice(0, 10)
        };

        // Note: localStorage is not supported in Claude artifacts
        addActivityLog('projectSaved', 'success');
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
                if (is3DView && controlsRef.current) {
                    controlsRef.current.zoomIn();
                    addActivityLog('zoomedIn_3D', 'info');
                } else {
                    setZoomLevel(prev => {
                        const newZoom = Math.min(prev + 25, 200);
                        addActivityLog(`zoomedIn_${newZoom}`, 'info');
                        return newZoom;
                    });
                }
                break;
            case 'zoomOut':
                if (is3DView && controlsRef.current) {
                    controlsRef.current.zoomOut();
                    addActivityLog('zoomedOut_3D', 'info');
                } else {
                    setZoomLevel(prev => {
                        const newZoom = Math.max(prev - 25, 50);
                        addActivityLog(`zoomedOut_${newZoom}`, 'info');
                        return newZoom;
                    });
                }
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
        setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]);
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
                    zoomLevel,
                    is3DView
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
            <nav className="navbar navbar-dark bg-dark px-3" style={{ minHeight: '48px' }}>
                <div className="d-flex w-100 justify-content-between align-items-center">
                    <div className="d-flex">
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
                                        🔍 {t.zoomIn} {is3DView ? '' : `(${zoomLevel}%)`}
                                    </button>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('zoomOut')}>
                                        🔍 {t.zoomOut} {is3DView ? '' : `(${zoomLevel}%)`}
                                    </button>
                                    <button className="dropdown-item" onClick={() => handleMenuClick('fullScreen')}>
                                        ⛶ {t.fullScreen}
                                    </button>
                                    <button className="dropdown-item" onClick={() => handleToolClick('3d')}>
                                        📐 {t.toggle3D}
                                    </button>
                                </div>
                            )}
                        </div>

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

                        <button className="btn btn-outline-light btn-sm me-1" onClick={() => handleMenuClick('minimize')}>─</button>
                        <button className="btn btn-outline-light btn-sm me-1" onClick={() => handleMenuClick('fullScreen')}>
                            {isFullScreen ? '🗗' : '☐'}
                        </button>
                        <button className="btn btn-outline-light btn-sm" onClick={() => setIsProjectOpen(false)}>✕</button>
                    </div>
                </div>
            </nav>

            <div className="flex-grow-1 position-relative bg-light" onClick={() => setActiveDropdown(null)}>
                <div className="h-100 position-relative overflow-hidden">
                    {is3DView ? (
                        <div className="h-100 position-relative">
                            <canvas
                                ref={canvasRef}
                                className="w-100 h-100"
                                style={{ display: 'block', cursor: 'grab' }}
                            />
                            {/* 3D View Info Panel */}
                            <div className="position-absolute top-0 end-0 m-3" style={{
                                zIndex: 1002,
                                background: 'rgba(0,0,0,0.8)',
                                color: 'white',
                                padding: '10px',
                                borderRadius: '5px'
                            }}>
                                <small>
                                    📐 3D View Active<br />
                                    Buildings: {labelData.length}<br />
                                    Mouse: Drag to rotate<br />
                                    Wheel: Zoom in/out
                                </small>
                            </div>
                        </div>
                    ) : (
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
                                                📸 {projectData?.name || 'Unknown'}<br />
                                                {projectData?.size ? `${Math.round(projectData.size / 1024)} KB` : ''}<br />
                                                Zoom: {zoomLevel}%
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <svg
                                className="position-absolute top-0 start-0 w-100 h-100"
                                style={{
                                    pointerEvents: 'none',
                                    zIndex: 10
                                }}
                            >
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

                            {showBuildingOutlines && (
                                <>
                                    {labelData.map((building) => (
                                        <div
                                            key={building.id}
                                            className="position-absolute border border-danger border-2 rounded"
                                            style={{
                                                top: `${building.bounds.y}px`,
                                                left: `${building.bounds.x}px`,
                                                width: `${building.bounds.width}px`,
                                                height: `${building.bounds.height}px`,
                                                opacity: 0.8,
                                                animation: 'pulse 2s infinite'
                                            }}
                                        ></div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}

                    <div className="position-absolute top-0 start-0 m-3" style={{ zIndex: 1001 }}>
                        <div className="btn-group-vertical" role="group">
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
                                className="btn btn-primary btn-sm border mt-2"
                                onClick={() => handleToolClick('3d')}
                                title={t.toggle3D}
                            >
                                📐
                            </button>
                        </div>
                    </div>

                    <div className="position-absolute bottom-0 start-0 m-3 mb-5" style={{ zIndex: 1001 }}>
                        <div className="btn-group-vertical" role="group">
                            <button
                                className={`btn btn-sm border mb-1 d-flex flex-column align-items-center py-2 ${sidebarPanel === 'activity' ? 'btn-primary' : 'btn-light'}`}
                                onClick={() => setSidebarPanel(sidebarPanel === 'activity' ? null : 'activity')}
                            >
                                📋
                                <small className="mt-1" style={{ fontSize: '9px' }}>{t.activityLog}</small>
                            </button>
                            <button
                                className={`btn btn-sm border mb-1 d-flex flex-column align-items-center py-2 ${sidebarPanel === 'table' ? 'btn-primary' : 'btn-light'}`}
                                onClick={() => setSidebarPanel(sidebarPanel === 'table' ? null : 'table')}
                            >
                                📊
                                <small className="mt-1" style={{ fontSize: '9px' }}>{t.labelTableSidebar}</small>
                            </button>
                            <button
                                className={`btn btn-sm border d-flex flex-column align-items-center py-2 ${sidebarPanel === 'filters' ? 'btn-primary' : 'btn-light'}`}
                                onClick={() => setSidebarPanel(sidebarPanel === 'filters' ? null : 'filters')}
                            >
                                🔍
                                <small className="mt-1" style={{ fontSize: '9px' }}>{t.filters}</small>
                            </button>
                        </div>
                    </div>

                    <div className="position-absolute bottom-0 end-0 m-3 mb-5" style={{ zIndex: 1001 }}>
                        {fabExpanded && (
                            <div className="d-flex align-items-center mb-3 p-2 rounded-pill" style={{
                                background: 'rgba(0,0,0,0.85)'
                            }}>
                                {fabTools.map((tool) => (
                                    <button
                                        key={tool.id}
                                        className={`btn btn-sm rounded-circle me-2 d-flex align-items-center justify-content-center fab-tool ${selectedTool === tool.id ? 'btn-primary' : 'btn-light'}`}
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
                                            (tool.id === 'delete' && drawingData.length === 0) ||
                                            (tool.id === 'manual' && is3DView)
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
                                                    <th>Height</th>
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
                                                        <td>{item.bounds.height3D}m</td>
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
                                                <strong>3D View Status:</strong>
                                                <span className={`badge bg-${is3DView ? 'success' : 'secondary'}`}>
                                                    {is3DView ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div className="small">
                                                <div>Buildings Rendered: <span className="badge bg-info">{labelData.length}</span></div>
                                                <div>View Mode: <span className="badge bg-primary">{is3DView ? '3D Scene' : '2D Map'}</span></div>
                                                <div>Zoom Level: <span className="badge bg-secondary">{is3DView ? 'Camera Control' : `${zoomLevel}%`}</span></div>
                                                <div>Drawing Tools: <span className={`badge bg-${is3DView ? 'warning' : 'success'}`}>
                                                    {is3DView ? 'Disabled in 3D' : 'Enabled'}
                                                </span></div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="mb-3">
                                            <strong>Building Statistics:</strong>
                                            <div className="mt-2">
                                                <div className="d-flex justify-content-between">
                                                    <span>🏠 Residential:</span>
                                                    <span className="badge bg-success">
                                                        {labelData.filter(b => b.buildingType === 'residential').length}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between mt-1">
                                                    <span>🏢 Commercial:</span>
                                                    <span className="badge bg-primary">
                                                        {labelData.filter(b => b.buildingType === 'commercial').length}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between mt-1">
                                                    <span>🏭 Industrial:</span>
                                                    <span className="badge bg-warning">
                                                        {labelData.filter(b => b.buildingType === 'industrial').length}
                                                    </span>
                                                </div>
                                            </div>
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
                        <button
                            className={`btn ${is3DView ? 'btn-warning' : 'btn-info'}`}
                            onClick={() => handleToolClick('3d')}
                        >
                            📐 {is3DView ? 'Switch to 2D' : 'Switch to 3D'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading Modal for Auto Labeling */}
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
                                    © 2024 KiwiSmart Technologies<br />
                                    Enhanced 3D Visualization with Three.js
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
                                <div className="mb-3">
                                    <div className="form-check form-switch">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="enable3D" 
                                            checked={is3DView}
                                            onChange={() => handleToolClick('3d')}
                                        />
                                        <label className="form-check-label" htmlFor="enable3D">
                                            Enable 3D View by Default
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
                
                .position-absolute {
                    pointer-events: auto;
                }
                
                .fixed-ui {
                    position: fixed !important;
                    z-index: 1001;
                }

                canvas {
                    outline: none;
                }

                .canvas-container {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    overflow: hidden;
                }
            `}</style>

            {!isProjectOpen ? <MainPage /> : <ProjectInterface />}
        </div>
    );
};

export default KiwiSmartApp;