import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import GeoTIFF from 'geotiff';

const KiwiSmart3D = () => {
    const [isProjectOpen, setIsProjectOpen] = useState(false);
    const [is3DView, setIs3DView] = useState(false);
    const [selectedTool, setSelectedTool] = useState('select');
    const [language, setLanguage] = useState('zh');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [projectData, setProjectData] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [isDragOver, setIsDragOver] = useState(false);
    const [visualizationMode, setVisualizationMode] = useState('realistic');
    const [lightingMode, setLightingMode] = useState('day');
    const [showRoads, setShowRoads] = useState(true);
    const [showVegetation, setShowVegetation] = useState(true);
    const [showWater, setShowWater] = useState(true);
    const [showTerrain, setShowTerrain] = useState(true);
    const [terrainData, setTerrainData] = useState(null);
    const [elevationScale, setElevationScale] = useState(1.0);
    const [terrainResolution, setTerrainResolution] = useState(256);

    // Enhanced sample data for realistic urban visualization
    const [labelData, setLabelData] = useState([
        // Residential buildings
        { id: 1, groupId: 'RES_001', buildingType: 'residential', bounds: { x: -200, y: -150, width: 40, height: 30, height3D: 45 }, floors: 15, material: 'concrete' },
        { id: 2, groupId: 'RES_002', buildingType: 'residential', bounds: { x: -150, y: -120, width: 35, height: 25, height3D: 38 }, floors: 12, material: 'brick' },
        { id: 3, groupId: 'RES_003', buildingType: 'residential', bounds: { x: -100, y: -140, width: 45, height: 35, height3D: 52 }, floors: 17, material: 'glass' },
        { id: 4, groupId: 'RES_004', buildingType: 'residential', bounds: { x: -50, y: -110, width: 38, height: 28, height3D: 41 }, floors: 14, material: 'concrete' },

        // Commercial/Office buildings
        { id: 5, groupId: 'COM_001', buildingType: 'commercial', bounds: { x: 50, y: -100, width: 60, height: 40, height3D: 120 }, floors: 30, material: 'glass' },
        { id: 6, groupId: 'COM_002', buildingType: 'commercial', bounds: { x: 120, y: -80, width: 55, height: 35, height3D: 95 }, floors: 24, material: 'glass' },
        { id: 7, groupId: 'COM_003', buildingType: 'commercial', bounds: { x: 180, y: -60, width: 70, height: 50, height3D: 150 }, floors: 40, material: 'glass' },
        { id: 8, groupId: 'COM_004', buildingType: 'commercial', bounds: { x: 260, y: -40, width: 65, height: 45, height3D: 135 }, floors: 35, material: 'glass' },

        // Mixed-use and smaller buildings
        { id: 9, groupId: 'MIX_001', buildingType: 'mixed', bounds: { x: -180, y: 50, width: 30, height: 20, height3D: 25 }, floors: 8, material: 'brick' },
        { id: 10, groupId: 'MIX_002', buildingType: 'mixed', bounds: { x: -130, y: 70, width: 35, height: 25, height3D: 30 }, floors: 10, material: 'concrete' },
        { id: 11, groupId: 'MIX_003', buildingType: 'mixed', bounds: { x: -80, y: 90, width: 40, height: 30, height3D: 35 }, floors: 12, material: 'glass' },

        // Industrial/Warehouse
        { id: 12, groupId: 'IND_001', buildingType: 'industrial', bounds: { x: 100, y: 100, width: 80, height: 60, height3D: 25 }, floors: 2, material: 'metal' },
        { id: 13, groupId: 'IND_002', buildingType: 'industrial', bounds: { x: 200, y: 120, width: 90, height: 70, height3D: 30 }, floors: 3, material: 'metal' },

        // Additional residential cluster
        { id: 14, groupId: 'RES_005', buildingType: 'residential', bounds: { x: -50, y: 150, width: 25, height: 20, height3D: 20 }, floors: 6, material: 'brick' },
        { id: 15, groupId: 'RES_006', buildingType: 'residential', bounds: { x: -20, y: 170, width: 28, height: 22, height3D: 22 }, floors: 7, material: 'brick' },
        { id: 16, groupId: 'RES_007', buildingType: 'residential', bounds: { x: 10, y: 150, width: 30, height: 25, height3D: 25 }, floors: 8, material: 'concrete' }
    ]);

    // Road network data
    const roadData = [
        // Main roads
        { id: 'main_1', type: 'highway', points: [[-300, -200], [300, -200]], width: 12 },
        { id: 'main_2', type: 'highway', points: [[-300, 200], [300, 200]], width: 12 },
        { id: 'main_3', type: 'highway', points: [[-200, -300], [-200, 300]], width: 10 },
        { id: 'main_4', type: 'highway', points: [[200, -300], [200, 300]], width: 10 },

        // Secondary roads
        { id: 'sec_1', type: 'street', points: [[-100, -300], [-100, 300]], width: 8 },
        { id: 'sec_2', type: 'street', points: [[100, -300], [100, 300]], width: 8 },
        { id: 'sec_3', type: 'street', points: [[-300, -100], [300, -100]], width: 8 },
        { id: 'sec_4', type: 'street', points: [[-300, 100], [300, 100]], width: 8 },

        // Local streets
        { id: 'local_1', type: 'local', points: [[-50, -300], [-50, 300]], width: 6 },
        { id: 'local_2', type: 'local', points: [[50, -300], [50, 300]], width: 6 },
        { id: 'local_3', type: 'local', points: [[-300, -50], [300, -50]], width: 6 },
        { id: 'local_4', type: 'local', points: [[-300, 50], [300, 50]], width: 6 }
    ];

    // Green spaces and water bodies
    const landscapeData = [
        { id: 'park_1', type: 'park', bounds: { x: -250, y: -50, width: 80, height: 60 } },
        { id: 'park_2', type: 'park', bounds: { x: 150, y: 50, width: 70, height: 50 } },
        { id: 'water_1', type: 'water', bounds: { x: -80, y: 0, width: 160, height: 40 } },
        { id: 'trees_1', type: 'trees', bounds: { x: -300, y: -300, width: 600, height: 50 } },
        { id: 'trees_2', type: 'trees', bounds: { x: -300, y: 250, width: 600, height: 50 } }
    ];

    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const animationRef = useRef(null);
    const fileInputRef = useRef(null);

    // Translations
    const translations = {
        en: {
            appTitle: 'KiwiSmart 3D',
            appSubtitle: 'Advanced Urban Visualization System with TIFF Support',
            newProject: 'Start New Project',
            openProject: 'Open Existing Project',
            toggle3D: 'Toggle 3D View',
            resetView: 'Reset View',
            visualizationMode: 'Visualization Mode',
            realistic: 'Realistic',
            colorCoded: 'Color Coded',
            wireframe: 'Wireframe',
            lightingMode: 'Lighting',
            day: 'Day',
            sunset: 'Sunset',
            night: 'Night',
            showRoads: 'Show Roads',
            showVegetation: 'Show Vegetation',
            showWater: 'Show Water Bodies',
            showTerrain: 'Show Terrain',
            uploadFile: 'Upload 3D City Data',
            supportedFormats: 'Supported: GeoJSON, CityJSON, KML, TIFF, 3D Models',
            buildings: 'Buildings',
            roads: 'Roads',
            landscape: 'Landscape',
            elevationScale: 'Elevation Scale',
            terrainResolution: 'Terrain Resolution'
        },
        zh: {
            appTitle: 'KiwiSmart 3D',
            appSubtitle: '支援TIFF格式的先進城市視覺化系統',
            newProject: '開始新專案',
            openProject: '開啟現有專案',
            toggle3D: '切換 3D 視圖',
            resetView: '重設視圖',
            visualizationMode: '視覺化模式',
            realistic: '真實',
            colorCoded: '色彩編碼',
            wireframe: '線框',
            lightingMode: '燈光',
            day: '白天',
            sunset: '黃昏',
            night: '夜晚',
            showRoads: '顯示道路',
            showVegetation: '顯示植被',
            showWater: '顯示水體',
            showTerrain: '顯示地形',
            uploadFile: '上傳 3D 城市資料',
            supportedFormats: '支援格式：GeoJSON、CityJSON、KML、TIFF、3D 模型',
            buildings: '建築物',
            roads: '道路',
            landscape: '景觀',
            elevationScale: '高程比例',
            terrainResolution: '地形解析度'
        }
    };

    const t = translations[language];

    // Function to read TIFF files and create terrain
    const readTIFFFile = async (file) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
            const image = await tiff.getImage();

            const raster = await image.readRasters({ interleave: true });
            const width = image.getWidth();
            const height = image.getHeight();

            const bbox = image.getBoundingBox(); // [minX, minY, maxX, maxY] dalam koordinat geospasial
            const elevationData = raster[0]; // jika channel pertama adalah elevasi

            return {
                width,
                height,
                data: elevationData,
                bounds: {
                    minX: bbox[0],
                    maxX: bbox[2],
                    minY: bbox[1],
                    maxY: bbox[3]
                },
                synthetic: false
            };
        } catch (error) {
            console.error("TIFF read error:", error);
            return createSyntheticTerrain(file.name);
        }
    };


    // Create synthetic terrain data when TIFF parsing fails
    const createSyntheticTerrain = (fileName, arrayBuffer = null) => {
        console.log('Creating synthetic terrain for:', fileName);

        const width = Math.min(terrainResolution, 512); // Limit resolution for performance
        const height = Math.min(terrainResolution, 512);
        const elevationData = new Float32Array(width * height);

        // Create different terrain patterns based on filename
        const fileNameLower = fileName.toLowerCase();
        let terrainType = 'hills';

        if (fileNameLower.includes('mountain') || fileNameLower.includes('peak')) {
            terrainType = 'mountains';
        } else if (fileNameLower.includes('valley') || fileNameLower.includes('river')) {
            terrainType = 'valley';
        } else if (fileNameLower.includes('flat') || fileNameLower.includes('plain')) {
            terrainType = 'flat';
        }

        // Generate terrain based on type
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const x = (i / width) * 6 - 3; // Extend range for more variation
                const y = (j / height) * 6 - 3;

                let elevation = 0;

                switch (terrainType) {
                    case 'mountains':
                        elevation += 50 * Math.sin(x * 0.3) * Math.cos(y * 0.3);
                        elevation += 30 * Math.sin(x * 0.8) * Math.cos(y * 0.8);
                        elevation += 15 * Math.sin(x * 1.5) * Math.cos(y * 1.5);
                        elevation += 20 * Math.cos(x * 0.5 + y * 0.5);
                        break;
                    case 'valley':
                        elevation += -20 + 30 * Math.exp(-(x * x + y * y) * 0.3);
                        elevation += 10 * Math.sin(x * 1.2) * Math.cos(y * 1.2);
                        elevation += 5 * Math.sin(x * 2.0) * Math.cos(y * 2.0);
                        break;
                    case 'flat':
                        elevation += 2 * Math.sin(x * 0.8) * Math.cos(y * 0.8);
                        elevation += 1 * Math.sin(x * 2.0) * Math.cos(y * 2.0);
                        break;
                    default: // hills
                        elevation += 25 * Math.sin(x * 0.5) * Math.cos(y * 0.5);
                        elevation += 15 * Math.sin(x * 1.2) * Math.cos(y * 1.2);
                        elevation += 8 * Math.sin(x * 2.5) * Math.cos(y * 2.5);
                        elevation += 12 * Math.cos(x * 0.8 + y * 0.8);
                        break;
                }

                // Add noise for realism
                elevation += (Math.random() - 0.5) * 4;

                // Ensure reasonable elevation range
                elevation = Math.max(elevation, -10);
                elevation = Math.min(elevation, 100);

                elevationData[i * height + j] = elevation;
            }
        }

        return {
            width: width,
            height: height,
            data: elevationData,
            bounds: { minX: -400, maxX: 400, minY: -400, maxY: 400 },
            synthetic: true,
            terrainType: terrainType
        };
    };

    // Create realistic terrain from elevation data
    const createTerrain = (terrainData) => {
        const { width, height, data, bounds } = terrainData;
        const geometry = new THREE.PlaneGeometry(
            bounds.maxX - bounds.minX,
            bounds.maxY - bounds.minY,
            width - 1,
            height - 1
        );

        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < data.length; i++) {
            vertices[i * 3 + 2] = data[i] * elevationScale; // apply elevasi asli
        }

        geometry.computeVertexNormals();
        const material = new THREE.MeshStandardMaterial({ color: 0x888866, wireframe: false });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        return mesh;
    };


    // Enhanced material creation based on building type and visualization mode
    const createBuildingMaterial = (building, mode) => {
        const { buildingType, material, floors } = building;

        if (mode === 'wireframe') {
            return new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                wireframe: true,
                transparent: true,
                opacity: 0.8
            });
        }

        if (mode === 'colorCoded') {
            const colors = {
                residential: 0x4CAF50,
                commercial: 0x2196F3,
                industrial: 0xFF9800,
                mixed: 0x9C27B0
            };
            return new THREE.MeshLambertMaterial({
                color: colors[buildingType] || 0x9E9E9E,
                transparent: true,
                opacity: 0.9
            });
        }

        // Realistic mode with enhanced materials
        let baseColor, roughness, metalness, emissive;

        switch (material) {
            case 'glass':
                baseColor = new THREE.Color(0.7, 0.8, 0.9);
                roughness = 0.05;
                metalness = 0.1;
                emissive = new THREE.Color(0.05, 0.05, 0.1);
                break;
            case 'concrete':
                baseColor = new THREE.Color(0.6, 0.6, 0.6);
                roughness = 0.9;
                metalness = 0.0;
                emissive = new THREE.Color(0, 0, 0);
                break;
            case 'brick':
                baseColor = new THREE.Color(0.7, 0.4, 0.3);
                roughness = 0.95;
                metalness = 0.0;
                emissive = new THREE.Color(0, 0, 0);
                break;
            case 'metal':
                baseColor = new THREE.Color(0.5, 0.5, 0.6);
                roughness = 0.2;
                metalness = 0.9;
                emissive = new THREE.Color(0, 0, 0);
                break;
            default:
                baseColor = new THREE.Color(0.7, 0.7, 0.7);
                roughness = 0.7;
                metalness = 0.0;
                emissive = new THREE.Color(0, 0, 0);
        }

        // Vary color slightly based on height/floors for more realism
        const heightVariation = Math.min(floors / 50, 0.3);
        baseColor.multiplyScalar(1 - heightVariation * 0.15);

        // Add subtle lighting at night
        if (lightingMode === 'night' && Math.random() > 0.3) {
            emissive = new THREE.Color(0.1, 0.08, 0.05);
        }

        return new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: roughness,
            metalness: metalness,
            emissive: emissive,
            transparent: material === 'glass',
            opacity: material === 'glass' ? 0.7 : 1.0
        });
    };

    // Create road geometry with realistic appearance
    const createRoadGeometry = (road) => {
        const points = road.points.map(p => new THREE.Vector2(p[0], p[1]));
        const width = road.width;
        const length = Math.sqrt(
            Math.pow(points[1].x - points[0].x, 2) +
            Math.pow(points[1].y - points[0].y, 2)
        );

        const geometry = new THREE.PlaneGeometry(width, length);
        return geometry;
    };

    // Create landscape elements with better materials
    const createLandscapeElement = (element) => {
        const { type, bounds } = element;
        const geometry = new THREE.PlaneGeometry(bounds.width, bounds.height);
        let material;

        switch (type) {
            case 'park':
                material = new THREE.MeshLambertMaterial({
                    color: 0x4CAF50,
                    transparent: true,
                    opacity: 0.8
                });
                break;
            case 'water':
                material = new THREE.MeshStandardMaterial({
                    color: 0x1976D2,
                    transparent: true,
                    opacity: 0.85,
                    roughness: 0.0,
                    metalness: 0.0
                });
                break;
            case 'trees':
                material = new THREE.MeshLambertMaterial({
                    color: 0x2E7D32,
                    transparent: true,
                    opacity: 0.7
                });
                break;
            default:
                material = new THREE.MeshLambertMaterial({ color: 0x8BC34A });
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(bounds.x + bounds.width / 2, 1, bounds.y + bounds.height / 2);
        mesh.receiveShadow = true;

        return mesh;
    };

    // Enhanced lighting setup
    const setupLighting = (scene, mode) => {
        // Clear existing lights
        const lights = scene.children.filter(child => child.isLight);
        lights.forEach(light => scene.remove(light));

        let ambientIntensity, directionalColor, directionalIntensity, directionalPosition;

        switch (mode) {
            case 'day':
                ambientIntensity = 0.5;
                directionalColor = 0xffffff;
                directionalIntensity = 1.2;
                directionalPosition = [1000, 2000, 1000];
                scene.background = new THREE.Color(0x87CEEB);
                scene.fog = new THREE.Fog(0x87CEEB, 1000, 5000);
                break;
            case 'sunset':
                ambientIntensity = 0.3;
                directionalColor = 0xffa500;
                directionalIntensity = 0.9;
                directionalPosition = [2000, 500, 1000];
                scene.background = new THREE.Color(0xFF6B35);
                scene.fog = new THREE.Fog(0xFF6B35, 800, 4000);
                break;
            case 'night':
                ambientIntensity = 0.15;
                directionalColor = 0x4169E1;
                directionalIntensity = 0.4;
                directionalPosition = [500, 1000, 500];
                scene.background = new THREE.Color(0x191970);
                scene.fog = new THREE.Fog(0x191970, 500, 3000);
                break;
        }

        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, ambientIntensity);
        scene.add(ambientLight);

        // Directional light (sun/moon)
        const directionalLight = new THREE.DirectionalLight(directionalColor, directionalIntensity);
        directionalLight.position.set(...directionalPosition);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 5000;
        directionalLight.shadow.camera.left = -1000;
        directionalLight.shadow.camera.right = 1000;
        directionalLight.shadow.camera.top = 1000;
        directionalLight.shadow.camera.bottom = -1000;
        scene.add(directionalLight);

        // Hemisphere light for more natural lighting
        const hemisphereLight = new THREE.HemisphereLight(
            mode === 'night' ? 0x080820 : 0x87CEEB,
            mode === 'night' ? 0x080808 : 0x8B4513,
            0.3
        );
        scene.add(hemisphereLight);

        // Add point lights for night mode (street lighting effect)
        if (mode === 'night') {
            for (let i = 0; i < 10; i++) {
                const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
                pointLight.position.set(
                    (Math.random() - 0.5) * 400,
                    20,
                    (Math.random() - 0.5) * 400
                );
                scene.add(pointLight);
            }
        }
    };

    // Enhanced Three.js setup
    useEffect(() => {
        if (is3DView && canvasRef.current) {
            // Clean up previous scene
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }

            // Initialize Scene
            sceneRef.current = new THREE.Scene();

            // Calculate scene bounds
            const validBuildings = labelData.filter(b => b.bounds);
            if (validBuildings.length === 0) return;

            const bounds = {
                minX: Math.min(...validBuildings.map(b => b.bounds.x)),
                maxX: Math.max(...validBuildings.map(b => b.bounds.x + b.bounds.width)),
                minY: Math.min(...validBuildings.map(b => b.bounds.y)),
                maxY: Math.max(...validBuildings.map(b => b.bounds.y + b.bounds.height))
            };

            const centerX = (bounds.minX + bounds.maxX) / 2;
            const centerY = (bounds.minY + bounds.maxY) / 2;
            const sceneSize = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);

            // Initialize Camera
            const aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
            cameraRef.current = new THREE.PerspectiveCamera(60, aspect, 1, sceneSize * 10);

            const initialDistance = sceneSize * 1.5;
            cameraRef.current.position.set(
                centerX + initialDistance * 0.8,
                initialDistance * 0.6,
                centerY + initialDistance * 0.8
            );
            cameraRef.current.lookAt(centerX, 0, centerY);

            // Initialize Renderer with enhanced settings
            rendererRef.current = new THREE.WebGLRenderer({
                canvas: canvasRef.current,
                antialias: true,
                alpha: true
            });
            rendererRef.current.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
            rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            rendererRef.current.shadowMap.enabled = true;
            rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
            rendererRef.current.toneMapping = THREE.ACESFilmicToneMapping;
            rendererRef.current.toneMappingExposure = 1.0;
            rendererRef.current.outputEncoding = THREE.sRGBEncoding;

            // Enhanced mouse controls
            const handleMouseMove = (event) => {
                if (event.buttons === 1) {
                    const deltaX = event.movementX * 0.01;
                    const deltaY = event.movementY * 0.01;

                    const spherical = new THREE.Spherical();
                    spherical.setFromVector3(cameraRef.current.position.clone().sub(new THREE.Vector3(centerX, 0, centerY)));
                    spherical.theta -= deltaX;
                    spherical.phi += deltaY;
                    spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

                    const newPosition = new THREE.Vector3().setFromSpherical(spherical).add(new THREE.Vector3(centerX, 0, centerY));
                    cameraRef.current.position.copy(newPosition);
                    cameraRef.current.lookAt(centerX, 0, centerY);
                }
            };

            const handleWheel = (event) => {
                const scale = event.deltaY > 0 ? 1.1 : 0.9;
                const direction = cameraRef.current.position.clone().sub(new THREE.Vector3(centerX, 0, centerY));
                direction.multiplyScalar(scale);
                cameraRef.current.position.copy(direction.add(new THREE.Vector3(centerX, 0, centerY)));
            };

            canvasRef.current.addEventListener('mousemove', handleMouseMove);
            canvasRef.current.addEventListener('wheel', handleWheel);

            // Setup lighting
            setupLighting(sceneRef.current, lightingMode);

            // Create terrain
            if (showTerrain && terrainData) {
                const terrain = createTerrain(terrainData);
                if (terrain) {
                    sceneRef.current.add(terrain);
                }
            } else if (showTerrain) {
                // Create default ground with some elevation variation
                const groundSize = sceneSize * 2;
                const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize, 100, 100);

                // Add slight elevation variation to ground
                const vertices = groundGeometry.attributes.position.array;
                for (let i = 0; i < vertices.length; i += 3) {
                    vertices[i + 2] = (Math.random() - 0.5) * 5; // Z coordinate
                }
                groundGeometry.computeVertexNormals();

                const groundMaterial = new THREE.MeshStandardMaterial({
                    color: 0x5d7c47,
                    roughness: 0.8,
                    metalness: 0.0
                });

                const ground = new THREE.Mesh(groundGeometry, groundMaterial);
                ground.rotation.x = -Math.PI / 2;
                ground.position.set(centerX, -2, centerY);
                ground.receiveShadow = true;
                sceneRef.current.add(ground);
            }

            // Create roads with realistic materials
            if (showRoads) {
                roadData.forEach(road => {
                    const roadGeometry = createRoadGeometry(road);
                    const roadMaterial = new THREE.MeshStandardMaterial({
                        color: road.type === 'highway' ? 0x2C2C2C : 0x404040,
                        roughness: 0.7,
                        metalness: 0.1
                    });
                    const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
                    roadMesh.rotation.x = -Math.PI / 2;
                    roadMesh.position.set(
                        (road.points[0][0] + road.points[1][0]) / 2,
                        0.5,
                        (road.points[0][1] + road.points[1][1]) / 2
                    );
                    roadMesh.receiveShadow = true;
                    sceneRef.current.add(roadMesh);

                    // Add road markings
                    if (road.type !== 'local') {
                        const markingGeometry = new THREE.PlaneGeometry(
                            road.width * 0.1,
                            Math.abs(road.points[1][1] - road.points[0][1]) || Math.abs(road.points[1][0] - road.points[0][0])
                        );
                        const markingMaterial = new THREE.MeshBasicMaterial({
                            color: 0xFFFFFF,
                            transparent: true,
                            opacity: 0.8
                        });
                        const markingMesh = new THREE.Mesh(markingGeometry, markingMaterial);
                        markingMesh.rotation.x = -Math.PI / 2;
                        markingMesh.position.set(
                            (road.points[0][0] + road.points[1][0]) / 2,
                            0.6,
                            (road.points[0][1] + road.points[1][1]) / 2
                        );
                        sceneRef.current.add(markingMesh);
                    }
                });
            }

            // Create landscape elements
            if (showVegetation || showWater) {
                landscapeData.forEach(element => {
                    if ((element.type === 'park' || element.type === 'trees') && showVegetation) {
                        const landscapeElement = createLandscapeElement(element);
                        sceneRef.current.add(landscapeElement);

                        // Add trees for parks
                        if (element.type === 'park') {
                            const treeCount = Math.floor((element.bounds.width * element.bounds.height) / 200);
                            for (let i = 0; i < treeCount; i++) {
                                const treeGeometry = new THREE.ConeGeometry(2, 8, 8);
                                const treeMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
                                const tree = new THREE.Mesh(treeGeometry, treeMaterial);

                                const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3);
                                const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
                                const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
                                trunk.position.y = -2.5;
                                tree.add(trunk);

                                tree.position.set(
                                    element.bounds.x + Math.random() * element.bounds.width,
                                    4,
                                    element.bounds.y + Math.random() * element.bounds.height
                                );
                                tree.castShadow = true;
                                sceneRef.current.add(tree);
                            }
                        }
                    } else if (element.type === 'water' && showWater) {
                        const landscapeElement = createLandscapeElement(element);
                        sceneRef.current.add(landscapeElement);
                    }
                });
            }

            // Create buildings with enhanced details
            validBuildings.forEach((building) => {
                const width = Math.max(building.bounds.width, 5);
                const depth = Math.max(building.bounds.height, 5);
                const height = Math.max(building.bounds.height3D, 5);

                const geometry = new THREE.BoxGeometry(width, height, depth);
                const material = createBuildingMaterial(building, visualizationMode);

                const buildingMesh = new THREE.Mesh(geometry, material);
                buildingMesh.position.set(
                    building.bounds.x + width / 2,
                    height / 2,
                    building.bounds.y + depth / 2
                );
                buildingMesh.castShadow = true;
                buildingMesh.receiveShadow = true;
                buildingMesh.userData = { building };

                sceneRef.current.add(buildingMesh);

                // Add building details
                if (visualizationMode === 'realistic') {
                    // Add windows
                    const windowCount = Math.floor(building.floors / 2);
                    for (let i = 0; i < windowCount; i++) {
                        const windowGeometry = new THREE.PlaneGeometry(width * 0.8, 2);
                        const windowMaterial = new THREE.MeshBasicMaterial({
                            color: lightingMode === 'night' ? 0xFFFF99 : 0x87CEEB,
                            transparent: true,
                            opacity: lightingMode === 'night' ? 0.8 : 0.3
                        });
                        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
                        windowMesh.position.set(0, (i - windowCount / 2) * 4, depth / 2 + 0.1);
                        buildingMesh.add(windowMesh);
                    }
                }

                // Add building outlines for better definition
                if (visualizationMode !== 'wireframe') {
                    const edges = new THREE.EdgesGeometry(geometry);
                    const lineMaterial = new THREE.LineBasicMaterial({
                        color: 0x000000,
                        opacity: 0.2,
                        transparent: true
                    });
                    const wireframe = new THREE.LineSegments(edges, lineMaterial);
                    wireframe.position.copy(buildingMesh.position);
                    sceneRef.current.add(wireframe);
                }
            });

            // Animation loop
            const animate = () => {
                animationRef.current = requestAnimationFrame(animate);

                // Add subtle camera movement for more dynamic feel
                if (cameraRef.current) {
                    const time = Date.now() * 0.0001;
                    cameraRef.current.position.y += Math.sin(time * 2) * 0.5;
                }

                rendererRef.current.render(sceneRef.current, cameraRef.current);
            };
            animate();

            // Handle resize
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
                if (canvasRef.current) {
                    canvasRef.current.removeEventListener('mousemove', handleMouseMove);
                    canvasRef.current.removeEventListener('wheel', handleWheel);
                }
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
                if (rendererRef.current) {
                    rendererRef.current.dispose();
                }
            };
        }
    }, [is3DView, labelData, visualizationMode, lightingMode, showRoads, showVegetation, showWater, showTerrain, terrainData, elevationScale]);

    // Enhanced file upload handler with improved TIFF support
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);

            // Show loading indicator
            const loadingToast = document.createElement('div');
            loadingToast.className = 'position-fixed top-50 start-50 translate-middle bg-dark text-white p-3 rounded';
            loadingToast.style.zIndex = '9999';
            loadingToast.innerHTML = `
                <div class="d-flex align-items-center">
                    <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                    <span>Loading ${file.name}...</span>
                </div>
            `;
            document.body.appendChild(loadingToast);

            try {
                if (file.type === 'image/tiff' || file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff')) {
                    console.log('Processing TIFF file:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');

                    const tiffData = await readTIFFFile(file);
                    setTerrainData(tiffData);

                    let statusMessage = 'TIFF Elevation Data';
                    if (tiffData.synthetic) {
                        statusMessage = `Synthetic ${tiffData.terrainType} terrain (TIFF parsing fallback)`;
                    }

                    setProjectData({
                        name: file.name,
                        type: statusMessage,
                        buildings: labelData.length,
                        terrain: true,
                        terrainType: tiffData.terrainType || 'elevation'
                    });
                    setIsProjectOpen(true);
                    setIs3DView(true);

                } else if (file.type === 'application/json' || file.name.endsWith('.geojson')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const geojson = JSON.parse(e.target.result);
                            console.log('GeoJSON loaded:', geojson);

                            const newLabelData = geojson.features.map((feature, index) => {
                                const properties = feature.properties || {};
                                const geometry = feature.geometry;

                                let bounds = { x: 0, y: 0, width: 20, height: 20 };

                                if (geometry && geometry.coordinates) {
                                    let coords = [];
                                    if (geometry.type === 'Polygon') {
                                        coords = geometry.coordinates[0];
                                    } else if (geometry.type === 'Point') {
                                        coords = [geometry.coordinates];
                                    }

                                    if (coords.length > 0) {
                                        const xs = coords.map(c => c[0] * 1000);
                                        const ys = coords.map(c => c[1] * 1000);
                                        bounds = {
                                            x: Math.min(...xs),
                                            y: Math.min(...ys),
                                            width: Math.max(...xs) - Math.min(...xs) || 20,
                                            height: Math.max(...ys) - Math.min(...ys) || 20
                                        };
                                    }
                                }

                                return {
                                    id: index + 1,
                                    groupId: `GROUP_${String(index + 1).padStart(3, '0')}`,
                                    buildingType: properties.building || properties.landuse || 'residential',
                                    bounds: {
                                        ...bounds,
                                        height3D: properties.height || properties.levels * 3 || Math.random() * 100 + 20
                                    },
                                    floors: properties.levels || Math.floor((properties.height || 30) / 3),
                                    material: properties.material || 'concrete'
                                };
                            });

                            setLabelData(newLabelData);
                            setProjectData({
                                name: file.name,
                                type: 'GeoJSON Building Data',
                                buildings: newLabelData.length
                            });
                            setIsProjectOpen(true);
                            setIs3DView(true);

                        } catch (error) {
                            console.error('Error parsing GeoJSON:', error);
                            alert('Error parsing GeoJSON file. Please check the format.');
                        } finally {
                            document.body.removeChild(loadingToast);
                        }
                    };
                    reader.readAsText(file);
                } else {
                    // Handle other file types
                    setProjectData({
                        name: file.name,
                        type: 'Unknown format - using sample data',
                        buildings: labelData.length
                    });
                    setIsProjectOpen(true);
                    setIs3DView(true);
                    document.body.removeChild(loadingToast);
                }
            } catch (error) {
                console.error('Error processing file:', error);
                alert(`Error processing file: ${error.message || 'Unknown error'}`);
                document.body.removeChild(loadingToast);
            }

            // Remove loading toast after delay if still exists
            setTimeout(() => {
                if (document.body.contains(loadingToast)) {
                    document.body.removeChild(loadingToast);
                }
            }, 5000);
        }
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
            const event = { target: { files: [files[0]] } };
            handleFileUpload(event);
        }
    };

    const loadSampleCity = (cityType) => {
        let sampleData = [];

        switch (cityType) {
            case 'downtown':
                for (let i = 0; i < 50; i++) {
                    const x = (Math.random() - 0.5) * 400;
                    const y = (Math.random() - 0.5) * 400;
                    sampleData.push({
                        id: i + 1,
                        groupId: `DOWN_${String(i + 1).padStart(3, '0')}`,
                        buildingType: Math.random() > 0.3 ? 'commercial' : 'residential',
                        bounds: {
                            x: x,
                            y: y,
                            width: 20 + Math.random() * 40,
                            height: 20 + Math.random() * 40,
                            height3D: 50 + Math.random() * 200
                        },
                        floors: Math.floor(Math.random() * 50) + 10,
                        material: Math.random() > 0.5 ? 'glass' : 'concrete'
                    });
                }
                break;

            case 'residential':
                for (let i = 0; i < 80; i++) {
                    const x = (Math.random() - 0.5) * 600;
                    const y = (Math.random() - 0.5) * 600;
                    sampleData.push({
                        id: i + 1,
                        groupId: `RES_${String(i + 1).padStart(3, '0')}`,
                        buildingType: 'residential',
                        bounds: {
                            x: x,
                            y: y,
                            width: 15 + Math.random() * 25,
                            height: 15 + Math.random() * 25,
                            height3D: 8 + Math.random() * 20
                        },
                        floors: Math.floor(Math.random() * 5) + 1,
                        material: Math.random() > 0.3 ? 'brick' : 'concrete'
                    });
                }
                break;

            case 'mixed':
                for (let i = 0; i < 60; i++) {
                    const x = (Math.random() - 0.5) * 500;
                    const y = (Math.random() - 0.5) * 500;
                    const types = ['residential', 'commercial', 'mixed', 'industrial'];
                    const type = types[Math.floor(Math.random() * types.length)];
                    sampleData.push({
                        id: i + 1,
                        groupId: `MIX_${String(i + 1).padStart(3, '0')}`,
                        buildingType: type,
                        bounds: {
                            x: x,
                            y: y,
                            width: 20 + Math.random() * 35,
                            height: 20 + Math.random() * 35,
                            height3D: 15 + Math.random() * 100
                        },
                        floors: Math.floor(Math.random() * 25) + 3,
                        material: type === 'industrial' ? 'metal' : Math.random() > 0.4 ? 'glass' : 'concrete'
                    });
                }
                break;
        }

        // Create sample terrain data for demonstration
        const sampleTerrainData = {
            width: 128,
            height: 128,
            data: new Float32Array(128 * 128),
            bounds: { minX: -400, maxX: 400, minY: -400, maxY: 400 }
        };

        for (let i = 0; i < 128; i++) {
            for (let j = 0; j < 128; j++) {
                const x = (i / 128) * 4 - 2;
                const y = (j / 128) * 4 - 2;
                let elevation = 10 * Math.sin(x * 0.3) * Math.cos(y * 0.3);
                elevation += 5 * Math.sin(x * 1.1) * Math.cos(y * 1.1);
                elevation += (Math.random() - 0.5) * 2;
                sampleTerrainData.data[i * 128 + j] = Math.max(elevation, -2);
            }
        }

        setTerrainData(sampleTerrainData);
        setLabelData(sampleData);
        setProjectData({
            name: `Sample ${cityType} City with Terrain`,
            type: 'sample',
            buildings: sampleData.length,
            terrain: true
        });
        setIsProjectOpen(true);
        setIs3DView(true);
    };

    const resetCamera = () => {
        if (cameraRef.current && sceneRef.current) {
            const validBuildings = labelData.filter(b => b.bounds);
            if (validBuildings.length === 0) return;

            const bounds = {
                minX: Math.min(...validBuildings.map(b => b.bounds.x)),
                maxX: Math.max(...validBuildings.map(b => b.bounds.x + b.bounds.width)),
                minY: Math.min(...validBuildings.map(b => b.bounds.y)),
                maxY: Math.max(...validBuildings.map(b => b.bounds.y + b.bounds.height))
            };

            const centerX = (bounds.minX + bounds.maxX) / 2;
            const centerY = (bounds.minY + bounds.maxY) / 2;
            const sceneSize = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
            const initialDistance = sceneSize * 1.5;

            cameraRef.current.position.set(
                centerX + initialDistance * 0.8,
                initialDistance * 0.6,
                centerY + initialDistance * 0.8
            );
            cameraRef.current.lookAt(centerX, 0, centerY);
        }
    };

    const MainPage = () => (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-8">
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
                                                {language === 'en' ? 'Drop your TIFF/3D city file here!' : '在此放置TIFF/3D城市檔案！'}
                                            </div>
                                        </div>
                                    )}

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <button
                                                className="btn btn-primary btn-lg w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                                                onClick={() => fileInputRef.current?.click()}
                                                style={{ minHeight: '120px' }}
                                            >
                                                <div style={{ fontSize: '2rem' }}>🗺️</div>
                                                <div className="mt-2">{t.uploadFile}</div>
                                                <small className="mt-1 opacity-75">{t.supportedFormats}</small>
                                            </button>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="d-grid gap-2 h-100">
                                                <button
                                                    className="btn btn-outline-primary flex-fill d-flex align-items-center justify-content-center"
                                                    onClick={() => loadSampleCity('downtown')}
                                                >
                                                    🏙️ {language === 'en' ? 'Downtown + Terrain' : '市中心+地形'}
                                                </button>
                                                <button
                                                    className="btn btn-outline-success flex-fill d-flex align-items-center justify-content-center"
                                                    onClick={() => loadSampleCity('residential')}
                                                >
                                                    🏘️ {language === 'en' ? 'Residential + Hills' : '住宅區+丘陵'}
                                                </button>
                                                <button
                                                    className="btn btn-outline-warning flex-fill d-flex align-items-center justify-content-center"
                                                    onClick={() => loadSampleCity('mixed')}
                                                >
                                                    🌄 {language === 'en' ? 'Mixed + Mountains' : '混合+山地'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <small className="text-muted d-block text-center">
                                            {language === 'en' ? 'Drag & drop TIFF elevation files or choose from realistic sample cities' : '拖放TIFF高程檔案或選擇真實範例城市'}
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
                accept=".json,.geojson,.kml,.gml,.cityjson,.tif,.tiff"
                onChange={handleFileUpload}
            />
        </div>
    );

    const ProjectInterface = () => (
        <div className="vh-100 d-flex flex-column">
            {/* Top toolbar */}
            <nav className="navbar navbar-dark bg-dark px-3" style={{ minHeight: '48px' }}>
                <div className="d-flex w-100 justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <h6 className="text-light mb-0 me-3">{projectData?.name || 'KiwiSmart 3D'}</h6>
                        <span className="badge bg-info me-2">{labelData.length} {t.buildings}</span>
                        <span className="badge bg-success me-2">{roadData.length} {t.roads}</span>
                        <span className="badge bg-warning me-2">{landscapeData.length} {t.landscape}</span>
                        {terrainData && <span className="badge bg-secondary">✓ Terrain</span>}
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
                        <button
                            className="btn btn-outline-light btn-sm"
                            onClick={() => setIsProjectOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main content area */}
            <div className="flex-grow-1 position-relative">
                {is3DView ? (
                    <div className="h-100 position-relative">
                        <canvas
                            ref={canvasRef}
                            className="w-100 h-100"
                            style={{ display: 'block', cursor: 'grab' }}
                            onMouseDown={(e) => e.target.style.cursor = 'grabbing'}
                            onMouseUp={(e) => e.target.style.cursor = 'grab'}
                        />

                        {/* Enhanced 3D Controls Panel */}
                        <div className="position-absolute top-0 start-0 m-3" style={{ zIndex: 1001 }}>
                            <div className="card bg-dark text-white" style={{ opacity: 0.95, maxHeight: '80vh', overflowY: 'auto' }}>
                                <div className="card-body p-3">
                                    <h6 className="mb-3">{t.visualizationMode}</h6>
                                    <div className="btn-group-vertical w-100 mb-3" role="group">
                                        <button
                                            className={`btn btn-sm ${visualizationMode === 'realistic' ? 'btn-primary' : 'btn-outline-light'}`}
                                            onClick={() => setVisualizationMode('realistic')}
                                        >
                                            🏗️ {t.realistic}
                                        </button>
                                        <button
                                            className={`btn btn-sm ${visualizationMode === 'colorCoded' ? 'btn-primary' : 'btn-outline-light'}`}
                                            onClick={() => setVisualizationMode('colorCoded')}
                                        >
                                            🎨 {t.colorCoded}
                                        </button>
                                        <button
                                            className={`btn btn-sm ${visualizationMode === 'wireframe' ? 'btn-primary' : 'btn-outline-light'}`}
                                            onClick={() => setVisualizationMode('wireframe')}
                                        >
                                            📐 {t.wireframe}
                                        </button>
                                    </div>

                                    <h6 className="mb-3">{t.lightingMode}</h6>
                                    <div className="btn-group-vertical w-100 mb-3" role="group">
                                        <button
                                            className={`btn btn-sm ${lightingMode === 'day' ? 'btn-warning' : 'btn-outline-light'}`}
                                            onClick={() => setLightingMode('day')}
                                        >
                                            ☀️ {t.day}
                                        </button>
                                        <button
                                            className={`btn btn-sm ${lightingMode === 'sunset' ? 'btn-warning' : 'btn-outline-light'}`}
                                            onClick={() => setLightingMode('sunset')}
                                        >
                                            🌅 {t.sunset}
                                        </button>
                                        <button
                                            className={`btn btn-sm ${lightingMode === 'night' ? 'btn-warning' : 'btn-outline-light'}`}
                                            onClick={() => setLightingMode('night')}
                                        >
                                            🌙 {t.night}
                                        </button>
                                    </div>

                                    <div className="form-check form-switch mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="showRoads"
                                            checked={showRoads}
                                            onChange={() => setShowRoads(!showRoads)}
                                        />
                                        <label className="form-check-label small" htmlFor="showRoads">
                                            {t.showRoads}
                                        </label>
                                    </div>
                                    <div className="form-check form-switch mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="showVegetation"
                                            checked={showVegetation}
                                            onChange={() => setShowVegetation(!showVegetation)}
                                        />
                                        <label className="form-check-label small" htmlFor="showVegetation">
                                            {t.showVegetation}
                                        </label>
                                    </div>
                                    <div className="form-check form-switch mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="showWater"
                                            checked={showWater}
                                            onChange={() => setShowWater(!showWater)}
                                        />
                                        <label className="form-check-label small" htmlFor="showWater">
                                            {t.showWater}
                                        </label>
                                    </div>

                                    <button
                                        className="btn btn-success btn-sm w-100 mb-2"
                                        onClick={resetCamera}
                                    >
                                        🔄 {t.resetView}
                                    </button>

                                    <button
                                        className="btn btn-info btn-sm w-100"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        📁 Load TIFF
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Stats Panel */}
                        <div className="position-absolute top-0 end-0 m-3" style={{ zIndex: 1001 }}>
                            <div className="card bg-dark text-white" style={{ opacity: 0.95 }}>
                                <div className="card-body p-3">
                                    <h6 className="mb-3">📊 Statistics</h6>
                                    <div className="small">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>🏠 Residential:</span>
                                            <span className="badge bg-success">
                                                {labelData.filter(b => b.buildingType === 'residential').length}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>🏢 Commercial:</span>
                                            <span className="badge bg-primary">
                                                {labelData.filter(b => b.buildingType === 'commercial').length}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>🏭 Industrial:</span>
                                            <span className="badge bg-warning">
                                                {labelData.filter(b => b.buildingType === 'industrial').length}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>🏘️ Mixed:</span>
                                            <span className="badge bg-info">
                                                {labelData.filter(b => b.buildingType === 'mixed').length}
                                            </span>
                                        </div>
                                        <hr className="my-2" />
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>🗺️ Terrain:</span>
                                            <span className="badge bg-secondary">
                                                {terrainData ? '✓ Active' : '✗ None'}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>🛣️ Roads:</span>
                                            <span className="badge bg-dark">{roadData.length}</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span>Total Buildings:</span>
                                            <span className="badge bg-light text-dark">{labelData.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* File Format Info Panel */}
                        <div className="position-absolute bottom-0 end-0 m-3" style={{ zIndex: 1000 }}>
                            <div className="card bg-dark text-white" style={{ opacity: 0.9 }}>
                                <div className="card-body p-2 px-3">
                                    <h6 className="small mb-2">📁 Supported Formats</h6>
                                    <div className="small">
                                        <div className="mb-1">🗺️ <strong>TIFF/TIF:</strong> Elevation data</div>
                                        <div className="mb-1">🌍 <strong>GeoJSON:</strong> Building data</div>
                                        <div className="mb-1">🏙️ <strong>CityJSON:</strong> 3D city models</div>
                                        <div>📍 <strong>KML:</strong> Geographic data</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Instructions */}
                        <div className="position-absolute bottom-0 start-0 end-0 p-3" style={{ zIndex: 1000 }}>
                            <div className="d-flex justify-content-center">
                                <div className="card bg-dark text-white" style={{ opacity: 0.9 }}>
                                    <div className="card-body p-2 px-3">
                                        <small>
                                            🖱️ {language === 'en' ? 'Drag to rotate • Scroll to zoom • Upload TIFF for realistic terrain • Use controls for customization' : '拖曳旋轉 • 滾輪縮放 • 上傳TIFF獲得真實地形 • 使用控制面板自訂'}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-100 d-flex align-items-center justify-content-center bg-light">
                        <div className="text-center">
                            <div style={{ fontSize: '4rem' }}>🗺️</div>
                            <h4>2D View Not Available</h4>
                            <p className="text-muted">This enhanced version focuses on 3D visualization with terrain support</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => setIs3DView(true)}
                            >
                                Switch to 3D View
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="App">
            <style>{`
                body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                }
                
                .btn {
                    transition: all 0.2s ease;
                }
                
                .btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }
                
                .card {
                    border: none;
                    border-radius: 12px;
                    backdrop-filter: blur(10px);
                }
                
                .form-check-input:checked {
                    background-color: #0d6efd;
                    border-color: #0d6efd;
                }
                
                .form-range {
                    background: transparent;
                }
                
                .form-range::-webkit-slider-track {
                    background: #495057;
                    border-radius: 3px;
                }
                
                .form-range::-webkit-slider-thumb {
                    background: #0d6efd;
                }
                
                canvas {
                    outline: none;
                    user-select: none;
                }
                
                .navbar {
                    backdrop-filter: blur(10px);
                }
                
                .badge {
                    font-size: 0.75em;
                }
                
                @media (max-width: 768px) {
                    .position-absolute.top-0.start-0 {
                        position: fixed !important;
                        top: 60px !important;
                        left: 10px !important;
                        right: 10px !important;
                        z-index: 1002 !important;
                        max-height: 50vh !important;
                    }
                    
                    .position-absolute.top-0.end-0 {
                        position: fixed !important;
                        top: 200px !important;
                        right: 10px !important;
                        z-index: 1002 !important;
                    }
                    
                    .position-absolute.bottom-0.end-0 {
                        display: none !important;
                    }
                }
                
                /* Enhanced 3D visualization styles */
                .city-controls {
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.2);
                }
                
                .building-realistic {
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                }
                
                .lighting-day {
                    filter: brightness(1.2) contrast(1.1);
                }
                
                .lighting-sunset {
                    filter: sepia(0.3) saturate(1.4) hue-rotate(15deg);
                }
                
                .lighting-night {
                    filter: brightness(0.7) contrast(1.2) hue-rotate(240deg);
                }
                
                /* Terrain visualization styles */
                .terrain-realistic {
                    background: linear-gradient(45deg, #4a5c3a, #6b8e47);
                }
                
                /* Scrollbar styles for control panel */
                .card-body::-webkit-scrollbar {
                    width: 6px;
                }
                
                .card-body::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.1);
                    border-radius: 3px;
                }
                
                .card-body::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.3);
                    border-radius: 3px;
                }
                
                .card-body::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,255,255,0.5);
                }
            `}</style>

            {!isProjectOpen ? <MainPage /> : <ProjectInterface />}
        </div>
    );
};

export default KiwiSmart3D;