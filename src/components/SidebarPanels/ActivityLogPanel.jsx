import React from 'react';

export const ActivityLogPanel = ({ activityLogs, t }) => (
    <div>
        {activityLogs.map((log) => (
            <div key={log.id} className={`border-start border-3 ps-3 py-2 mb-3 border-${log.type === 'success' ? 'success' : log.type === 'info' ? 'primary' : 'warning'}`}>
                <div className="fw-semibold">{t[log.action] || log.action}</div>
                <small className="text-muted">{log.timestamp}</small>
            </div>
        ))}
    </div>
);