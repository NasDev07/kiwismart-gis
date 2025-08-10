export const useFileUpload = ({
    setUploadedFile,
    setMapBackground,
    setImagePreview,
    setProjectData,
    setIsProjectOpen,
    setLabelData,
    addActivityLog
}) => {
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('📁 File selected:', file.name, file.type);
            setUploadedFile(file);
            addActivityLog('fileUploaded', 'success');

            if (file.type === 'application/json' || file.name.endsWith('.json') || file.name.endsWith('.geojson')) {
                console.log('📄 Processing GeoJSON file...');
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const geojson = JSON.parse(e.target.result);
                        console.log('GeoJSON loaded:', geojson);

                        const newLabelData = geojson.features.map((feature, index) => {
                            let coords = [];
                            let bounds = { x: 0, y: 0, width: 50, height: 50 };

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
                                        coords = [[0, 0]];
                                }

                                if (coords && coords.length > 0) {
                                    // Better coordinate processing
                                    const lngs = coords.map(c => c[0]);
                                    const lats = coords.map(c => c[1]);
                                    const minLng = Math.min(...lngs);
                                    const maxLng = Math.max(...lngs);
                                    const minLat = Math.min(...lats);
                                    const maxLat = Math.max(...lats);

                                    // Use relative positioning (0-1000 range)
                                    bounds = {
                                        x: (minLng + maxLng) / 2 * 1000 + 200,
                                        y: (minLat + maxLat) / 2 * 1000 + 200,
                                        width: Math.max((maxLng - minLng) * 1000, 20),
                                        height: Math.max((maxLat - minLat) * 1000, 20)
                                    };
                                }
                            }

                            const properties = feature.properties || {};
                            const heightAttr = properties.height ||
                                properties.HEIGHT ||
                                properties.EW_HA2013 ||
                                properties.height3D ||
                                (properties.floors ? properties.floors * 3 : null) ||
                                Math.random() * 100 + 30;

                            const buildingType = properties.type ||
                                properties.building ||
                                properties.landuse ||
                                properties.amenity ||
                                ['residential', 'commercial', 'industrial'][Math.floor(Math.random() * 3)];

                            return {
                                id: index + 1,
                                groupId: `GROUP_${String(index + 1).padStart(3, '0')}`,
                                subGroupId: `SUB_${String(Math.floor(index / 10) + 1).padStart(3, '0')}`,
                                buildingType: buildingType,
                                bounds: {
                                    ...bounds,
                                    height3D: Math.max(heightAttr, 10)
                                }
                            };
                        });

                        console.log('Processed buildings:', newLabelData.length);
                        setLabelData(newLabelData);
                        addActivityLog('geojsonProcessed', 'success');
                    } catch (error) {
                        console.error('Error parsing GeoJSON:', error);
                        addActivityLog('fileUploadFailed', 'warning');
                    }
                };
                reader.readAsText(file);
            } else if (file.type.startsWith('image/')) {
                console.log('🖼️ Processing image file...');
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = e.target.result;
                    console.log('Image loaded, data length:', imageData.length);

                    // PERBAIKAN: Pastikan gambar di-set dengan benar
                    setMapBackground(imageData);
                    setImagePreview(imageData);

                    // Create image element untuk validation
                    const img = new Image();
                    img.onload = () => {
                        console.log('Image validation successful:', img.width, 'x', img.height);
                    };
                    img.onerror = () => {
                        console.error('Image validation failed');
                    };
                    img.src = imageData;
                };
                reader.readAsDataURL(file);
            }

            setTimeout(() => {
                const projectInfo = {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    lastModified: file.lastModified,
                    isImage: file.type.startsWith('image/')
                };

                console.log('Setting project data:', projectInfo);
                setProjectData(projectInfo);
                setIsProjectOpen(true);
            }, 1000);
        }
    };

    return { handleFileUpload };
};