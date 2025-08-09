export const translateCoordinates = (coords) => {
    if (!coords || !coords.length) return { x: 0, y: 0 };
    const firstCoord = coords[0];
    const lng = firstCoord[0];
    const lat = firstCoord[1];
    const scaleFactor = 1000;
    return {
        x: lng * scaleFactor,
        y: lat * scaleFactor
    };
};

export const calculateBounds = (coords) => {
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

// Fungsi untuk konversi koordinat geografis ke screen coordinates
export const geoToScreen = (lng, lat, bounds, screenWidth, screenHeight) => {
    const { minLng, maxLng, minLat, maxLat } = bounds;
    
    const x = ((lng - minLng) / (maxLng - minLng)) * screenWidth;
    const y = ((maxLat - lat) / (maxLat - minLat)) * screenHeight; // Flip Y axis
    
    return { x, y };
};