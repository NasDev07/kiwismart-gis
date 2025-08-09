import React from 'react';

export const AboutModal = ({ showAboutModal, setShowAboutModal, t }) => {
    if (!showAboutModal) return null;

    return (
        <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000 }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{t.aboutTitle}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowAboutModal(false)}
                        ></button>
                    </div>
                    <div className="modal-body text-center">
                        <div style={{ fontSize: '3rem' }} className="mb-3">🗺️</div>
                        <h4>{t.appTitle}</h4>
                        <p className="text-muted">{t.aboutContent}</p>
                        <hr />
                        <small className="text-muted">
                            {t.version}<br />
                            © 2024 KiwiSmart Technologies<br />
                            Enhanced 3D Visualization with Three.js<br />
                            Interactive Camera Controls & Real-time Rendering
                        </small>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setShowAboutModal(false)}
                        >
                            {t.close}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};