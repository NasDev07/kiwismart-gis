import React from 'react';
import { FileMenu } from './FileMenu';
import { EditMenu } from './EditMenu';
import { ViewMenu } from './ViewMenu';

export const NavigationBar = ({
    language,
    setLanguage,
    activeDropdown,
    setActiveDropdown,
    handleMenuClick,
    handleToolClick,
    isFullScreen,
    setIsProjectOpen,
    setSidebarPanel,
    historyIndex,
    drawingHistory,
    drawingData,
    is3DView,
    t
}) => (
    <nav className="navbar navbar-dark bg-dark px-3" style={{ minHeight: '48px' }}>
        <div className="d-flex w-100 justify-content-between align-items-center">
            <div className="d-flex">
                <FileMenu 
                    activeDropdown={activeDropdown}
                    setActiveDropdown={setActiveDropdown}
                    handleMenuClick={handleMenuClick}
                    t={t}
                />
                <EditMenu 
                    activeDropdown={activeDropdown}
                    setActiveDropdown={setActiveDropdown}
                    handleMenuClick={handleMenuClick}
                    historyIndex={historyIndex}
                    drawingHistory={drawingHistory}
                    drawingData={drawingData}
                    is3DView={is3DView}
                    t={t}
                />
                <ViewMenu 
                    activeDropdown={activeDropdown}
                    setActiveDropdown={setActiveDropdown}
                    handleMenuClick={handleMenuClick}
                    handleToolClick={handleToolClick}
                    is3DView={is3DView}
                    t={t}
                />

                <div className="dropdown me-3">
                    <button
                        className="btn btn-dark btn-sm dropdown-toggle border-0"
                        type="button"
                        onClick={() => setActiveDropdown(activeDropdown === 'window' ? null : 'window')}
                    >
                        {t.window}
                    </button>
                    {activeDropdown === 'window' && (
                        <div className="dropdown-menu show position-absolute" style={{ zIndex: 1050 }}>
                            <button className="dropdown-item" onClick={() => setSidebarPanel('activity')}>
                                📋 {t.activityLogs}
                            </button>
                            <button className="dropdown-item" onClick={() => setSidebarPanel('table')}>
                                📊 {t.labelTable}
                            </button>
                        </div>
                    )}
                </div>

                <div className="dropdown">
                    <button
                        className="btn btn-dark btn-sm dropdown-toggle border-0"
                        type="button"
                        onClick={() => setActiveDropdown(activeDropdown === 'help' ? null : 'help')}
                    >
                        {t.help}
                    </button>
                    {activeDropdown === 'help' && (
                        <div className="dropdown-menu show position-absolute" style={{ zIndex: 1050 }}>
                            <button className="dropdown-item" onClick={() => handleMenuClick('about')}>
                                ℹ️ {t.about}
                            </button>
                            <button className="dropdown-item" onClick={() => handleMenuClick('settings')}>
                                ⚙️ {t.settings}
                            </button>
                            <button className="dropdown-item" onClick={() => handleMenuClick('userManual')}>
                                📖 {t.userManual}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex align-items-center">
                <div className="btn-group me-3">
                    <button
                        className={`btn btn-sm ${language === 'en' ? 'btn-light' : 'btn-outline-light'}`}
                        onClick={() => setLanguage('en')}
                    >
                        EN
                    </button>
                    <button
                        className={`btn btn-sm ${language === 'zh' ? 'btn-light' : 'btn-outline-light'}`}
                        onClick={() => setLanguage('zh')}
                    >
                        中
                    </button>
                </div>

                <button className="btn btn-outline-light btn-sm me-1" onClick={() => handleMenuClick('minimize')}>─</button>
                <button className="btn btn-outline-light btn-sm me-1" onClick={() => handleMenuClick('fullScreen')}>
                    {isFullScreen ? '🗗' : '☐'}
                </button>
                <button className="btn btn-outline-light btn-sm" onClick={() => setIsProjectOpen(false)}>✕</button>
            </div>
        </div>
    </nav>
);