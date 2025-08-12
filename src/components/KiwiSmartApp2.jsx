import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

const KiwiSmart3D = () => {
    const [isProjectOpen, setIsProjectOpen] = useState(false);
    const [is3DView, setIs3DView] = useState(false);
    const [selectedTool, setSelectedTool] = useState('select');
    const [language, setLanguage] = useState('zh');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [projectData, setProjectData] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [isDragOver, setIsDragOver] = useState(false);
    const [visualizationMode, setVisualizationMode] = useState('realistic'); // realistic, colorCoded, wireframe
    const [lightingMode, setLightingMode] = useState('day'); // day, sunset, night
    const [showRoads, setShowRoads] = useState(true);
    const [showVegetation, setShowVegetation] = useState(true);
    const [showWater, setShowWater] = useState(true);
    
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
        { id: 'trees_1', type: 'trees', bounds: { x: -300, y: -300, width: 600, height: 50 } }, // Tree line
        { id: 'trees_2', type: 'trees', bounds: { x: -300, y: 250, width: 600, height: 50 } } // Tree line
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
            appSubtitle: 'Advanced Urban Visualization System',
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
            uploadFile: 'Upload 3D City Data',
            supportedFormats: 'Supported: GeoJSON, CityJSON, KML, 3D Models',
            buildings: 'Buildings',
            roads: 'Roads',
            landscape: 'Landscape'
        },
        zh: {
            appTitle: 'KiwiSmart 3D',
            appSubtitle: '先進城市視覺化系統',
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
            uploadFile: '上傳 3D 城市資料',
            supportedFormats: '支援格式：GeoJSON、CityJSON、KML、3D 模型',
            buildings: '建築物',
            roads: '道路',
            landscape: '景觀'
        }
    };

    const t = translations[language];

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
                residential: 0x4CAF50, // Green
                commercial: 0x2196F3,  // Blue
                industrial: 0xFF9800,  // Orange
                mixed: 0x9C27B0       // Purple
            };
            return new THREE.MeshLambertMaterial({
                color: colors[buildingType] || 0x9E9E9E,
                transparent: true,
                opacity: 0.9
            });
        }
        
        // Realistic mode
        let baseColor, roughness, metalness;
        
        switch (material) {
            case 'glass':
                baseColor = new THREE.Color(0.8, 0.9, 1.0);
                roughness = 0.1;
                metalness = 0.1;
                break;
            case 'concrete':
                baseColor = new THREE.Color(0.7, 0.7, 0.7);
                roughness = 0.8;
                metalness = 0.0;
                break;
            case 'brick':
                baseColor = new THREE.Color(0.8, 0.5, 0.4);
                roughness = 0.9;
                metalness = 0.0;
                break;
            case 'metal':
                baseColor = new THREE.Color(0.6, 0.6, 0.7);
                roughness = 0.3;
                metalness = 0.8;
                break;
            default:
                baseColor = new THREE.Color(0.7, 0.7, 0.7);
                roughness = 0.7;
                metalness = 0.0;
        }
        
        // Vary color slightly based on height/floors for more realism
        const heightVariation = Math.min(floors / 50, 0.3);
        baseColor.multiplyScalar(1 - heightVariation * 0.2);
        
        return new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: roughness,
            metalness: metalness,
            transparent: material === 'glass',
            opacity: material === 'glass' ? 0.7 : 1.0
        });
    };

    // Create road geometry
    const createRoadGeometry = (road) => {
        const points = road.points.map(p => new THREE.Vector2(p[0], p[1]));
        const shape = new THREE.Shape();
        
        // Create road as extruded rectangle
        const width = road.width;
        const length = Math.sqrt(
            Math.pow(points[1].x - points[0].x, 2) + 
            Math.pow(points[1].y - points[0].y, 2)
        );
        
        shape.moveTo(-width/2, 0);
        shape.lineTo(width/2, 0);
        shape.lineTo(width/2, length);
        shape.lineTo(-width/2, length);
        shape.lineTo(-width/2, 0);
        
        const extrudeSettings = {
            depth: 0.5,
            bevelEnabled: false
        };
        
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    };

    // Create landscape elements
    const createLandscapeElement = (element) => {
        const { type, bounds } = element;
        const geometry = new THREE.PlaneGeometry(bounds.width, bounds.height);
        let material;
        
        switch (type) {
            case 'park':
                material = new THREE.MeshLambertMaterial({ 
                    color: 0x4CAF50,
                    transparent: true,
                    opacity: 0.7
                });
                break;
            case 'water':
                material = new THREE.MeshStandardMaterial({ 
                    color: 0x2196F3,
                    transparent: true,
                    opacity: 0.8,
                    roughness: 0.1,
                    metalness: 0.1
                });
                break;
            case 'trees':
                material = new THREE.MeshLambertMaterial({ 
                    color: 0x2E7D32,
                    transparent: true,
                    opacity: 0.6
                });
                break;
            default:
                material = new THREE.MeshLambertMaterial({ color: 0x8BC34A });
        }
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(bounds.x + bounds.width/2, 0.1, bounds.y + bounds.height/2);
        
        return mesh;
    };

    // Setup lighting based on mode
    const setupLighting = (scene, mode) => {
        // Clear existing lights
        const lights = scene.children.filter(child => child.isLight);
        lights.forEach(light => scene.remove(light));
        
        let ambientIntensity, directionalColor, directionalIntensity, directionalPosition;
        
        switch (mode) {
            case 'day':
                ambientIntensity = 0.6;
                directionalColor = 0xffffff;
                directionalIntensity = 1.0;
                directionalPosition = [1000, 2000, 1000];
                scene.background = new THREE.Color(0x87CEEB); // Sky blue
                break;
            case 'sunset':
                ambientIntensity = 0.4;
                directionalColor = 0xffa500;
                directionalIntensity = 0.8;
                directionalPosition = [2000, 500, 1000];
                scene.background = new THREE.Color(0xFF6B35); // Orange sunset
                break;
            case 'night':
                ambientIntensity = 0.2;
                directionalColor = 0x4169E1;
                directionalIntensity = 0.3;
                directionalPosition = [500, 1000, 500];
                scene.background = new THREE.Color(0x191970); // Midnight blue
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
        
        // Additional hemisphere light for more natural lighting
        const hemisphereLight = new THREE.HemisphereLight(
            mode === 'night' ? 0x080820 : 0x87CEEB,
            mode === 'night' ? 0x080808 : 0x8B4513,
            0.4
        );
        scene.add(hemisphereLight);
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

            // Initialize Renderer
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

            // Setup controls (using basic mouse controls since OrbitControls import might not work)
            const handleMouseMove = (event) => {
                if (event.buttons === 1) { // Left mouse button
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

            // Create ground
            const groundSize = sceneSize * 2;
            const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
            const groundMaterial = new THREE.MeshLambertMaterial({ 
                color: 0xf0f0f0,
                transparent: true,
                opacity: 0.8
            });
            const ground = new THREE.Mesh(groundGeometry, groundMaterial);
            ground.rotation.x = -Math.PI / 2;
            ground.position.set(centerX, -1, centerY);
            ground.receiveShadow = true;
            sceneRef.current.add(ground);

            // Create roads
            if (showRoads) {
                roadData.forEach(road => {
                    const roadGeometry = new THREE.PlaneGeometry(
                        Math.abs(road.points[1][0] - road.points[0][0]) || road.width,
                        Math.abs(road.points[1][1] - road.points[0][1]) || road.width
                    );
                    const roadMaterial = new THREE.MeshLambertMaterial({ 
                        color: road.type === 'highway' ? 0x2C2C2C : 0x404040 
                    });
                    const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
                    roadMesh.rotation.x = -Math.PI / 2;
                    roadMesh.position.set(
                        (road.points[0][0] + road.points[1][0]) / 2,
                        0,
                        (road.points[0][1] + road.points[1][1]) / 2
                    );
                    sceneRef.current.add(roadMesh);
                });
            }

            // Create landscape elements
            if (showVegetation || showWater) {
                landscapeData.forEach(element => {
                    if ((element.type === 'park' || element.type === 'trees') && showVegetation) {
                        const landscapeElement = createLandscapeElement(element);
                        sceneRef.current.add(landscapeElement);
                    } else if (element.type === 'water' && showWater) {
                        const landscapeElement = createLandscapeElement(element);
                        sceneRef.current.add(landscapeElement);
                    }
                });
            }

            // Create buildings
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

                // Add building outlines for better definition
                if (visualizationMode !== 'wireframe') {
                    const edges = new THREE.EdgesGeometry(geometry);
                    const lineMaterial = new THREE.LineBasicMaterial({ 
                        color: 0x000000, 
                        opacity: 0.3,
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
    }, [is3DView, labelData, visualizationMode, lightingMode, showRoads, showVegetation, showWater]);

    // File upload handler
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);
            
            if (file.type === 'application/json' || file.name.endsWith('.geojson')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const geojson = JSON.parse(e.target.result);
                        console.log('GeoJSON loaded:', geojson);
                        
                        // Process GeoJSON features into building data
                        const newLabelData = geojson.features.map((feature, index) => {
                            const properties = feature.properties || {};
                            const geometry = feature.geometry;
                            
                            let bounds = { x: 0, y: 0, width: 20, height: 20 };
                            
                            if (geometry && geometry.coordinates) {
                                // Extract coordinates and calculate bounds
                                let coords = [];
                                if (geometry.type === 'Polygon') {
                                    coords = geometry.coordinates[0];
                                } else if (geometry.type === 'Point') {
                                    coords = [geometry.coordinates];
                                }
                                
                                if (coords.length > 0) {
                                    const xs = coords.map(c => c[0] * 1000); // Scale up
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
                            type: file.type,
                            buildings: newLabelData.length
                        });
                        setIsProjectOpen(true);
                        setIs3DView(true);
                        
                    } catch (error) {
                        console.error('Error parsing GeoJSON:', error);
                        alert('Error parsing file. Please check the format.');
                    }
                };
                reader.readAsText(file);
            } else {
                // Handle other file types or show sample data
                setProjectData({
                    name: file.name,
                    type: file.type,
                    buildings: labelData.length
                });
                setIsProjectOpen(true);
                setIs3DView(true);
            }
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
        // Generate different sample city layouts
        let sampleData = [];
        
        switch (cityType) {
            case 'downtown':
                // Dense urban core with tall buildings
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
                // Suburban residential area
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
                // Mixed-use development
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
        
        setLabelData(sampleData);
        setProjectData({
            name: `Sample ${cityType} City`,
            type: 'sample',
            buildings: sampleData.length
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
                                                {language === 'en' ? 'Drop your 3D city file here!' : '在此放置3D城市檔案！'}
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
                                                <div style={{ fontSize: '2rem' }}>📁</div>
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
                                                    🏙️ {language === 'en' ? 'Downtown Sample' : '市中心範例'}
                                                </button>
                                                <button
                                                    className="btn btn-outline-success flex-fill d-flex align-items-center justify-content-center"
                                                    onClick={() => loadSampleCity('residential')}
                                                >
                                                    🏘️ {language === 'en' ? 'Residential Sample' : '住宅區範例'}
                                                </button>
                                                <button
                                                    className="btn btn-outline-warning flex-fill d-flex align-items-center justify-content-center"
                                                    onClick={() => loadSampleCity('mixed')}
                                                >
                                                    🏢 {language === 'en' ? 'Mixed Use Sample' : '混合使用範例'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <small className="text-muted d-block text-center">
                                            {language === 'en' ? 'Drag & drop files or choose from sample cities' : '拖放檔案或選擇範例城市'}
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
                accept=".json,.geojson,.kml,.gml,.cityjson"
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
                        <span className="badge bg-warning">{landscapeData.length} {t.landscape}</span>
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
                        
                        {/* 3D Controls Panel */}
                        <div className="position-absolute top-0 start-0 m-3" style={{ zIndex: 1001 }}>
                            <div className="card bg-dark text-white" style={{ opacity: 0.95 }}>
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
                                        className="btn btn-success btn-sm w-100"
                                        onClick={resetCamera}
                                    >
                                        🔄 {t.resetView}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats Panel */}
                        <div className="position-absolute top-0 end-0 m-3" style={{ zIndex: 1001 }}>
                            <div className="card bg-dark text-white" style={{ opacity: 0.95 }}>
                                <div className="card-body p-3">
                                    <h6 className="mb-3">Statistics</h6>
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
                                        <div className="d-flex justify-content-between">
                                            <span>Total:</span>
                                            <span className="badge bg-secondary">{labelData.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="position-absolute bottom-0 start-0 end-0 p-3" style={{ zIndex: 1000 }}>
                            <div className="d-flex justify-content-center">
                                <div className="card bg-dark text-white" style={{ opacity: 0.9 }}>
                                    <div className="card-body p-2 px-3">
                                        <small>
                                            🖱️ {language === 'en' ? 'Drag to rotate • Scroll to zoom • Use controls to customize view' : '拖曳旋轉 • 滾輪縮放 • 使用控制面板自訂視圖'}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-100 d-flex align-items-center justify-content-center bg-light">
                        <div className="text-center">
                            <div style={{ fontSize: '4rem' }}>🏙️</div>
                            <h4>2D View Not Available</h4>
                            <p className="text-muted">This enhanced version focuses on 3D visualization</p>
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
                    }
                    
                    .position-absolute.top-0.end-0 {
                        position: fixed !important;
                        top: 200px !important;
                        right: 10px !important;
                        z-index: 1002 !important;
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
            `}</style>

            {!isProjectOpen ? <MainPage /> : <ProjectInterface />}
        </div>
    );
};

export default KiwiSmart3D;