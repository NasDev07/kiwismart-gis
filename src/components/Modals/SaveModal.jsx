import React from 'react';

export const SaveModal = ({ 
    showSaveModal, 
    setShowSaveModal, 
    saveAsName, 
    setSaveAsName, 
    handleSaveAsProject, 
    t 
}) => {
    if (!showSaveModal) return null;

    return (
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
    );
};