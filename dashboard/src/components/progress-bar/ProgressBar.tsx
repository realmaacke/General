"use strict";
import "./ProgressBar.css";

export interface ProgressBarProps {
    name: string,
    current: number,
    total: number,
    color: string
};

export default function ProgressBar({ name, current, total, color } : ProgressBarProps ) {
    const currentStatus = Math.min(100, (current / total) * 100);
    return (
        <div className="progress">
            <div className="progress-info">
                <p>{name}</p>            
                <p>{Math.round(currentStatus)}%</p>
            </div>
            <div className="ProgressBar-container">
                <div className="ProgressBar-value"
                style={{
                    width: `${currentStatus}%`,
                    // background: '#ffffff14',
                    background: `${color}`,
                    height: 30,
                    borderRadius: 6
                }}
                >
                </div>
            </div>
        </div>
    );
}