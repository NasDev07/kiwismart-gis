import React from 'react';

export const SampleImageButtons = ({ language, loadSampleImage, setIsProjectOpen }) => (
    <div className="mt-3">
        <small className="text-muted d-block mb-2">
            {language === 'en' ? 'Try Sample Images:' : '試用範例圖片：'}
        </small>
        <div className="btn-group w-100" role="group">
            <button
                className="btn btn-outline-info btn-sm"
                onClick={() => {
                    loadSampleImage('satellite');
                    setIsProjectOpen(true);
                }}
            >
                🛰️ {language === 'en' ? 'Satellite' : '衛星'}
            </button>
            <button
                className="btn btn-outline-success btn-sm"
                onClick={() => {
                    loadSampleImage('aerial');
                    setIsProjectOpen(true);
                }}
            >
                ✈️ {language === 'en' ? 'Aerial' : '航拍'}
            </button>
            <button
                className="btn btn-outline-warning btn-sm"
                onClick={() => {
                    loadSampleImage('map');
                    setIsProjectOpen(true);
                }}
            >
                🗺️ {language === 'en' ? 'Map' : '地圖'}
            </button>
        </div>
    </div>
);