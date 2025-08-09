import React from 'react';

export const LanguageSelector = ({ language, setLanguage }) => (
    <div className="mb-4">
        <div className="btn-group">
            <button
                className={`btn btn-sm ${language === 'en' ? 'btn-light' : 'btn-outline-light'}`}
                onClick={() => setLanguage('en')}
            >
                🇺🇸 English
            </button>
            <button
                className={`btn btn-sm ${language === 'zh' ? 'btn-light' : 'btn-outline-light'}`}
                onClick={() => setLanguage('zh')}
            >
                🇹🇼 中文
            </button>
        </div>
    </div>
);