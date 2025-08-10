import { useCallback } from 'react';

export const useProjectHandlers = ({
    projectData,
    language,
    zoomLevel,
    mapBackground,
    labelData,
    activityLogs,
    saveAsName,
    setSaveAsName,
    setShowSaveModal,
    addActivityLog
}) => {
    const handleSaveProject = useCallback(() => {
        const projectToSave = {
            name: projectData?.name || 'Untitled Project',
            timestamp: new Date().toISOString(),
            zoomLevel,
            language,
            mapBackground,
            labelData,
            activityLogs: activityLogs.slice(0, 10)
        };

        addActivityLog('projectSaved', 'success');
        alert(language === 'en' ? 'Project saved successfully!' : '專案儲存成功！');
    }, [projectData, language, zoomLevel, mapBackground, labelData, activityLogs, addActivityLog]);

    const handleSaveAsProject = useCallback(() => {
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
    }, [saveAsName, language, zoomLevel, mapBackground, labelData, activityLogs, addActivityLog, setShowSaveModal, setSaveAsName]);

    const handleExport = useCallback(() => {
        const exportData = {
            project: {
                name: projectData?.name || 'KiwiSmart Project',
                exportDate: new Date().toISOString(),
                settings: {
                    language,
                    zoomLevel,
                    is3DView: false
                }
            },
            labels: labelData,
            statistics: {
                totalBuildings: labelData.length,
                buildingTypes: {
                    residential: labelData.filter(b => b.buildingType === 'residential').length,
                    commercial: labelData.filter(b => b.buildingType === 'commercial').length,
                    industrial: labelData.filter(b => b.buildingType === 'industrial').length
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
    }, [projectData, language, zoomLevel, labelData, activityLogs, addActivityLog]);

    const loadSampleImage = useCallback((imageType) => {
        const sampleImages = {
            satellite: 'https://picsum.photos/1200/800?random=1',
            aerial: 'https://picsum.photos/1200/800?random=2',
            map: 'https://picsum.photos/1200/800?random=3'
        };

        return {
            name: `Sample ${imageType} image`,
            type: 'image/jpeg',
            size: 1024000,
            lastModified: Date.now(),
            isImage: true,
            isSample: true,
            url: sampleImages[imageType]
        };
    }, []);

    return {
        handleSaveProject,
        handleSaveAsProject,
        handleExport,
        loadSampleImage
    };
};