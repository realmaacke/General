"use strict";
import {} from "express";
import si from "systeminformation";
export const infoController = async (req, res) => {
    try {
        const cpu = await si.cpu();
        const load = await si.currentLoad();
        const disks = await si.fsSize();
        res.json({
            cpu: {
                name: cpu.brand,
                cores: cpu.cores,
                clock: `${cpu.speed}GHz`,
                usage: Math.round(load.currentLoad)
            },
            disk: disks.map((disk) => ({
                partition: disk.fs,
                clock: "N/A",
                size: `${Math.round(disk.size / 1024 / 1024 / 1024)}GB`,
                inUse: `${Math.round(disk.used / 1024 / 1024 / 1024)}GB`
            }))
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch stats"
        });
    }
};
//# sourceMappingURL=infoController.js.map