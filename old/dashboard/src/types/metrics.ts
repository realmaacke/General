// src/types/metrics.ts
export interface Metrics {
    cpu: {
        usage: number;
    };
    memory: {
        total: number;
        used: number;
        free: number;
        usage: number;
    };
    disks: {
        filesystem: string;
        mount: string;
        size: number;
        used: number;
        available: number;
        usage: number;
    }[];
    timestamp: number;
}