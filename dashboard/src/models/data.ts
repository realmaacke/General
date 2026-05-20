"use strict";

interface usageBody {
    cpu: cpu_interface,
    disk: disk_interface[]
}

interface cpu_interface {
    name: string,
    cores: number,
    clock: string,
    usage: number
}

interface disk_interface {
    partition: string,
    clock: string,
    size: string,
    inUse: string
}


function isUsageBody(data: unknown): data is usageBody {
    if (typeof data !== "object" || data === null) return false;

    const d = data as any;

    return (
        typeof d.cpu === "object" &&
        d.cpu !== null &&
        typeof d.cpu.name === "string" &&
        typeof d.cpu.cores === "number" &&
        typeof d.cpu.clock === "string" &&
        typeof d.cpu.usage === "number" &&
        Array.isArray(d.disk) &&
        d.disk.every((x: any) =>
            typeof x.partition === "string" &&
            typeof x.clock === "string" &&
            typeof x.size === "string" &&
            typeof x.inUse === "string"
        )
    );
}

export async function gatherData(): Promise<usageBody> {
    const res = await fetch(`/api/telementry/server`);

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    const data: unknown = await res.json();

    if (!isUsageBody(data)) {
        throw new Error("Invalid API response shape for usageBody");
    }

    return data;
}