"use strict";

import "../assets/base.css";
import "../assets/dashboard.css";

import GeneralIcon from "../assets/General_icon.png";

// NAVIGATION
import Navigation from "../components/navigation/Navigation";

import { Information } from "../components/information/Information";

import { ArrowUp, ArrowDown } from "lucide-react";

import { useEffect, useState } from "react";

import {gatherData, subscribeToMetrics} from "../models/data";
import type { Metrics } from "../types/metrics";

const fakelogs = {
    "Dashboard": [
        "12:41:30 PM [vite] (client) hmr update /src/assets/dashboard.css (x4)",
        "12:41:46 PM [vite] (client) hmr update /src/assets/dashboard.css (x5)",
        "12:41:53 PM [vite] (client) hmr update /src/assets/dashboard.css (x6)",
        "12:42:27 PM [vite] (client) hmr update /src/assets/dashboard.css (x7)",
        "12:42:33 PM [vite] (client) hmr update /src/assets/dashboard.css (x8)",
        "12:42:38 PM [vite] (client) hmr update /src/assets/dashboard.css (x9)",
        "12:42:47 PM [vite] (client) hmr update /src/assets/dashboard.css (x10)",
        "12:42:50 PM [vite] (client) hmr update /src/assets/dashboard.css (x11)",
    ],
    "Transmission": [
        "2026-05-13 22:08:53 AEAD Decrypt error: bad packet ID (may be a replay)",
        "2026-05-13 22:08:53 AEAD Decrypt error: bad packet ID (may be a replay)",
        "2026-05-13 22:08:53 AEAD Decrypt error: bad packet ID (may be a replay)",
        "2026-05-13 22:08:53 AEAD Decrypt error: bad packet ID (may be a replay)",
        "2026-05-13 22:08:53 AEAD Decrypt error: bad packet ID (may be a replay)",
    ],
    "Nginx": [
        'nginx | 66.132.195.54 - -[03 / May / 2026: 13: 58: 47 +0000] "GET /./favicon.ico HTTP/1.1" 301 47 "-" "Mozilla/5.0 (compatible; CensysInspect/1.1; +https://about.censys.io/)',
        'nginx | 66.132.195.54 - -[03 / May / 2026: 13: 58: 53 +0000] "GET /favicon.ico HTTP/1.1" 200 15086 "-" "Mozilla/5.0 (compatible; CensysInspect/1.1; +https://about.censys.io/)',
        'nginx | 66.132.195.54 - -[03 / May / 2026: 13: 59: 23 +0000] "GET /api/v1/targets HTTP/1.1" 200 529 "-" "Mozilla/5.0 (compatible; CensysInspect/1.1; +https://about.censys.io/)',
        'nginx | 66.132.195.54 - -[03 / May / 2026: 13: 59: 25 +0000] "GET /api/v1/label/version/values HTTP/1.1" 200 149 "-" "Mozilla/5.0 (compatible; CensysInspect/1.1; +https://about.censys.io/)',
        'nginx | 66.132.195.54 - -[03 / May / 2026: 13: 59: 27 +0000] "GET /api/v1/label/goversion/values HTTP/1.1" 200 76 "-" "Mozilla/5.0 (compatible; CensysInspect/1.1; +https://about.censys.io/)',
        'nginx | 66.132.195.54 - -[03 / May / 2026: 13: 59: 27 +0000] "GET /api/v1/query?query=prometheus_build_info HTTP/1.1" 200 240 "-" "Mozilla/5.0 (compatible; CensysInspect/1.1; +https://about.censys.io/)',
    ]
}

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

function dedupeDisks(disks: disk_interface[]): disk_interface[] {
    const seen = new Set<string>();

    return disks.filter(disk => {
        if (seen.has(disk.partition)) return false;
        seen.add(disk.partition);
        return true;
    });
}

export default function HomeView() {

    const [openLogs, setOpenLogs] = useState<Record<string, boolean>>({});
    const [usage, setUsage] = useState<usageBody | null>(null);
    const [loading, setLoading] = useState(true);

    const [metrics, setMetrics] = useState<Metrics | null>(null);

    const toggleLogs = (category: string) => {
        setOpenLogs(prev => ({
            ...prev,
            [category]: !(prev[category] ?? true)
        }));
    };

    useEffect(() => {
        const unsubscribe = subscribeToMetrics(setMetrics);
        return unsubscribe;
    }, []);

    useEffect(() => {
        const gather = async () => {
            const result = await gatherData();
            setUsage({
                ...result,
                disk: dedupeDisks(result.disk)
            });
            setLoading(false);
        };

        gather();
    }, []);

    if (!metrics) {
        return <p>Waiting for metrics...</p>;
    }

    return (
        <div className="two-split">
            <aside className="aside home-aside">
                <div className="dashboard-logo-container">
                    <img src={GeneralIcon} alt="General Icon" />
                </div>
                <Navigation />
            </aside>

            <main className="main home-main">
                <div className="home-information-container">
                    <div className="home-information-header">
                        <h1>Server statistics</h1>
                    </div>
                    <div className="home-information-body">

                    {loading ? (
                        <p>Loading...</p>
                    ) : usage ? (
                        <Information {...usage} />
                    ) : (
                        <p>Failed to load data</p>
                    )}

                    </div>
                </div>

                <div className="home-services-container">
                    <div className="home-services-header">
                        <h1>Usage</h1>
                    </div>

                    <div className="home-services-content">
                            <p>Real time data</p>

                            <div>
                                <p>CPU: {metrics.cpu.usage.toFixed(1)}%</p>
                                <p>Memory: {metrics.memory.usage.toFixed(1)}%</p>
                            </div>
                    </div>
                </div>

                <div className="home-logs-container">
                    <div className="home-logs-header">
                        <h1>Container logs</h1>
                    </div>

                    <div className="home-logs-content">

                        {Object.entries(fakelogs).map(([category, logs]) => {
                            const isOpen = openLogs[category] ?? true;

                            return (
                                <div key={category} id={category} className="home-logs-content-item">
                                    <div className="home-logs-content-header">
                                        <h2>{category}</h2>

                                        {isOpen ? (
                                            <ArrowUp
                                                className="logs-arrow-up"
                                                onClick={() => toggleLogs(category)}
                                            />
                                        ) : (
                                            <ArrowDown
                                                className="logs-arrow-up"
                                                onClick={() => toggleLogs(category)}
                                            />
                                        )}
                                    </div>

                                    <div
                                        className="home-logs-content-body"
                                        style={{ display: isOpen ? "block" : "none" }}
                                    >
                                        {logs.map((log, index) => (
                                            <p key={index}>{log}</p>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </main>
        </div>
    );
};
