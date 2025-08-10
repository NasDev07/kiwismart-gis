import React from 'react';
import { AutoLabelingModal } from './AutoLabelingModal';
import { SaveModal } from './SaveModal';
import { AboutModal } from './AboutModal';
import { SettingsModal } from './SettingsModal';

export const Modals = ({
    isAutoLabeling,
    setIsAutoLabeling,
    labelingProgress,
    showSaveModal,
    setShowSaveModal,
    saveAsName,
    setSaveAsName,
    handleSaveAsProject,
    showAboutModal,
    setShowAboutModal,
    showSettingsModal,
    setShowSettingsModal,
    language,
    setLanguage,
    showBuildingOutlines,
    setShowBuildingOutlines,
    addActivityLog,
    t
}) => (
    <>
        <AutoLabelingModal 
            isAutoLabeling={isAutoLabeling}
            setIsAutoLabeling={setIsAutoLabeling}
            labelingProgress={labelingProgress}
            t={t}
        />
        <SaveModal 
            showSaveModal={showSaveModal}
            setShowSaveModal={setShowSaveModal}
            saveAsName={saveAsName}
            setSaveAsName={setSaveAsName}
            handleSaveAsProject={handleSaveAsProject}
            t={t}
        />
        <AboutModal 
            showAboutModal={showAboutModal}
            setShowAboutModal={setShowAboutModal}
            t={t}
        />
        <SettingsModal 
            showSettingsModal={showSettingsModal}
            setShowSettingsModal={setShowSettingsModal}
            language={language}
            setLanguage={setLanguage}
            showBuildingOutlines={showBuildingOutlines}
            setShowBuildingOutlines={setShowBuildingOutlines}
            addActivityLog={addActivityLog}
            t={t}
        />
    </>
);