import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const use3DVisualization = ({
    is3DView,
    canvasRef,
    labelData,
    sceneRef,
    cameraRef,
    rendererRef,
    controlsRef,
    animationRef,
    buildingMeshesRef,
    setCameraDistance
}) => {
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
            sceneRef.current.background = new THREE.Color(0x87CEEB);

            // Calculate center point of all buildings
            const validBuildings = labelData.filter(b => b.bounds && typeof b.bounds.x === 'number' && typeof b.bounds.y === 'number');
            
            if (validBuildings.length === 0) {
                console.warn('No valid buildings found for 3D rendering');
                return;
            }
            
            const centerX = validBuildings.reduce((sum, b) => sum + (b.bounds.x + (b.bounds.width || 0) / 2), 0) / validBuildings.length;
            const centerY = validBuildings.reduce((sum, b) => sum + (b.bounds.y + (b.bounds.height || 0) / 2), 0) / validBuildings.length;

            // Initialize Camera
            const aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
            cameraRef.current = new THREE.PerspectiveCamera(75, aspect, 0.1, 50000);
            
            const maxDistance = Math.max(
                ...validBuildings.map(b => Math.sqrt(Math.pow(b.bounds.x - centerX, 2) + Math.pow(b.bounds.y - centerY, 2)))
            );
            const initialDistance = Math.max(maxDistance * 3, 1000);
            setCameraDistance(initialDistance);
            
            cameraRef.current.position.set(centerX + initialDistance * 0.7, initialDistance * 0.8, centerY + initialDistance * 0.7);
            cameraRef.current.lookAt(centerX, 0, centerY);

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

            // Use standard OrbitControls
            controlsRef.current = new OrbitControls(cameraRef.current, canvasRef.current);
            controlsRef.current.target.set(centerX, 0, centerY);
            controlsRef.current.enableDamping = true;
            controlsRef.current.dampingFactor = 0.05;
            controlsRef.current.minDistance = 50;
            controlsRef.current.maxDistance = initialDistance * 3;
            controlsRef.current.enablePan = true;
            controlsRef.current.rotateSpeed = 1.0;
            controlsRef.current.zoomSpeed = 1.0;
            controlsRef.current.panSpeed = 1.0;
            controlsRef.current.minPolarAngle = 0.1;
            controlsRef.current.maxPolarAngle = Math.PI - 0.1;
            controlsRef.current.update();

            // Enhanced Ground and Grid
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

            const gridHelper = new THREE.GridHelper(groundSize, Math.min(100, groundSize / 50), 0x888888, 0xcccccc);
            gridHelper.position.set(centerX, 0, centerY);
            sceneRef.current.add(gridHelper);

            // Clear previous building meshes
            buildingMeshesRef.current = [];

            // Create enhanced 3D buildings
            validBuildings.forEach((building, index) => {
                const width = Math.max(building.bounds.width || 20, 10);
                const depth = Math.max(building.bounds.height || 20, 10);
                const height = Math.max(building.bounds.height3D || 30, 5);

                const geometry = new THREE.BoxGeometry(width, height, depth);
                
                let material;
                const buildingTypeNormalized = (building.buildingType || 'residential').toLowerCase();
                
                if (buildingTypeNormalized.includes('residential')) {
                    material = new THREE.MeshLambertMaterial({ color: 0x4CAF50 });
                } else if (buildingTypeNormalized.includes('commercial')) {
                    material = new THREE.MeshLambertMaterial({ color: 0x2196F3 });
                } else if (buildingTypeNormalized.includes('industrial')) {
                    material = new THREE.MeshLambertMaterial({ color: 0xFF9800 });
                } else {
                    material = new THREE.MeshLambertMaterial({ color: 0x9E9E9E });
                }

                const buildingMesh = new THREE.Mesh(geometry, material);
                buildingMesh.position.set(building.bounds.x, height / 2, building.bounds.y);
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

            // Enhanced Lighting
            const ambientLight = new THREE.AmbientLight(0x404040, 1.0);
            sceneRef.current.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
            directionalLight.position.set(centerX + initialDistance, initialDistance, centerY + initialDistance);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
            directionalLight.shadow.camera.near = 0.1;
            directionalLight.shadow.camera.far = initialDistance * 3;
            directionalLight.shadow.camera.left = -initialDistance;
            directionalLight.shadow.camera.right = initialDistance;
            directionalLight.shadow.camera.top = initialDistance;
            directionalLight.shadow.camera.bottom = -initialDistance;
            sceneRef.current.add(directionalLight);

            const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.6);
            sceneRef.current.add(hemisphereLight);

            // Animation Loop
            const animate = () => {
                animationRef.current = requestAnimationFrame(animate);
                
                controlsRef.current.update();
                
                rendererRef.current.render(sceneRef.current, cameraRef.current);
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
};