import React from 'react';

export const FileMenu = ({ activeDropdown, setActiveDropdown, handleMenuClick, t }) => (
    <div className="dropdown me-3">
        <button
            className="btn btn-dark btn-sm dropdown-toggle border-0"
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'file' ? null : 'file')}
        >
            {t.file}
        </button>
        {activeDropdown === 'file' && (
            <div className="dropdown-menu show position-absolute" style={{ zIndex: 1050 }}>
                <button className="dropdown-item" onClick={() => handleMenuClick('home')}>
                    🏠 {t.home}
                </button>
                <button className="dropdown-item" onClick={() => handleMenuClick('newProject')}>
                    📄 {t.newProjectMenu}
                </button>
                <button className="dropdown-item" onClick={() => handleMenuClick('openProject')}>
                    📁 {t.openProjectMenu}
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => handleMenuClick('save')}>
                    💾 {t.save}
                </button>
                <button className="dropdown-item" onClick={() => handleMenuClick('saveAs')}>
                    💾 {t.saveAs}
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => handleMenuClick('closeProject')}>
                    ❌ {t.closeProject}
                </button>
            </div>
        )}
    </div>
);