import React from 'react';

export const LabelTablePanel = ({ labelData, t }) => (
    <div className="table-responsive">
        <table className="table table-sm">
            <thead>
                <tr>
                    <th>{t.groupId}</th>
                    <th>{t.subGroupId}</th>
                    <th>{t.buildingType}</th>
                    <th>Height</th>
                </tr>
            </thead>
            <tbody>
                {labelData.map((item) => (
                    <tr key={item.id}>
                        <td>{item.groupId}</td>
                        <td>{item.subGroupId}</td>
                        <td>
                            <span className={`badge bg-${item.buildingType === 'residential' ? 'success' : item.buildingType === 'commercial' ? 'primary' : 'warning'}`}>
                                {t[item.buildingType]}
                            </span>
                        </td>
                        <td>{item.bounds.height3D}m</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);