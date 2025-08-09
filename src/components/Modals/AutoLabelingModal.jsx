import React from 'react';

export const AutoLabelingModal = ({ isAutoLabeling, setIsAutoLabeling, labelingProgress, t }) => {
    if (!isAutoLabeling) return null;

    return (
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
    );
};