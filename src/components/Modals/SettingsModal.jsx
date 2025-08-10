import React from 'react';

export const SettingsModal = ({ 
    showSettingsModal, 
    setShowSettingsModal, 
    language, 
    setLanguage, 
    showBuildingOutlines, 
    setShowBuildingOutlines,
    addActivityLog, 
    t 
}) => {
    if (!showSettingsModal) return null;

    return (
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
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    id="showBuildingOutlines" 
                                    checked={showBuildingOutlines}
                                    onChange={() => setShowBuildingOutlines(!showBuildingOutlines)}
                                />
                                <label className="form-check-label" htmlFor="showBuildingOutlines">
                                    Show Building Outlines
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
    );
};