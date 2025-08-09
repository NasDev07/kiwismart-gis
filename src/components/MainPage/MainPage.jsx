import React from 'react';
import { LanguageSelector } from './LanguageSelector';
import { SampleImageButtons } from './SampleImageButtons';

export const MainPage = ({
    language,
    setLanguage,
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    fileInputRef,
    setIsProjectOpen,
    loadSampleImage,
    handleFileUpload,
    t
}) => (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="text-center">
                        <LanguageSelector language={language} setLanguage={setLanguage} />

                        <div className="card shadow-lg border-0">
                            <div
                                className={`card-body p-5 ${isDragOver ? 'bg-light border-primary border-3' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div className="mb-4">
                                    <h1 className="display-4 fw-bold text-primary mb-3">
                                        {t.appTitle}
                                    </h1>
                                    <p className="lead text-muted">{t.appSubtitle}</p>
                                </div>

                                {isDragOver && (
                                    <div className="alert alert-primary text-center mb-4">
                                        <div style={{ fontSize: '2rem' }}>☁️</div>
                                        <div className="mt-2">
                                            {language === 'en' ? 'Drop your file here!' : '在此放置檔案！'}
                                        </div>
                                    </div>
                                )}

                                <div className="d-grid gap-3">
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        ➕ {t.newProject}
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary btn-lg"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        📁 {t.openProject}
                                    </button>

                                    <SampleImageButtons 
                                        language={language}
                                        loadSampleImage={loadSampleImage}
                                        setIsProjectOpen={setIsProjectOpen}
                                    />
                                </div>

                                <div className="mt-4">
                                    <small className="text-muted d-block">
                                        {t.supportedFormats}
                                    </small>
                                    <small className="text-muted d-block mt-1">
                                        {language === 'en' ? 'Or drag & drop files here' : '或直接拖放檔案至此處'}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <input
            ref={fileInputRef}
            type="file"
            className="d-none"
            accept=".shp,.json,.geojson,.gpkg,.tiff,.tif,.jpg,.jpeg,.png,.gif,.bmp,.webp"
            onChange={handleFileUpload}
        />
    </div>
);