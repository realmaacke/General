"use strict";

import { useEffect, useState } from "react";
import "../assets/base.css";
import "../assets/dashboard.css";

import GeneralIcon from "../assets/General_icon.png";

// NAVIGATION
import Navigation from "../components/navigation/Navigation";

import { gatherData, type DataGathering } from "../models/data";

import { parseSizeGB } from "../models/utils";

import Chart from "../components/chart/Chart";

export default function HomeView() {
    const [data, setData] = useState<DataGathering | null>(null);
    const [loading, setLoading] = useState<Boolean>(true);
    const [hasGathered, setHasGathered] = useState<Boolean>(false);

    useEffect(() => {

        const fetchData = async () => {
            if (!loading) return;

            const gathered = await gatherData() || null;
            console.log(typeof gathered);

            if (gathered) { 
                setHasGathered(true); 
                setData(gathered);
            }

            if (data) {
                console.log(data?.folders.series)
                setLoading(false);
            }
        }
        fetchData();
    })

    if (loading) return <div>Loading…</div>;

    if (!data) return null;

    if (hasGathered) {
        const totalGB = parseSizeGB(data.disk.total);
        const usedGB = parseSizeGB(data.disk.used);
    
        const ParsedData = [
            { name: 'Movies', current: Number(data.folders.movies.replace(/\D/g, "")) || 0, max: totalGB },
            { name: 'Series', current: Number(data.folders.series.replace(/\D/g, "")) || 0, max: totalGB },
            { name: 'Media', current: Number(data.folders.media.replace(/\D/g, "")) || 0, max: totalGB },
            { name: 'Total', current: usedGB, max: totalGB }
        ];
        return (
            <div className="two-split">
                <aside className="aside home-aside">
                    <div className="dashboard-logo-container">
                        <img src={GeneralIcon} alt="General Icon" />
                    </div>
                    <Navigation />

                </aside>
                <main className="main home-main">
                    <div className="dashboard-two-split">
                        <div className="dashboard-row">

                            <div className="dashboard-col">

                                <div className="usage-container">
                                    <h1>Disk usage (percentage of total)</h1>
                                    <Chart data={ParsedData} />
                                </div>


                            </div>
                            <div className="dashboard-col">
                            </div>
                        </div>

                        <div className="dashboard-row">
                            <div className="dashboard-col span-all">
                                <h1>Container activity</h1>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
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
            <div className="dashboard-two-split">
                <div className="dashboard-row">

                    <div className="dashboard-col">

                        <div className="usage-container">
                            <h1>Disk usage No data available</h1>
                        </div>


                    </div>
                    <div className="dashboard-col">
                    </div>
                </div>

                <div className="dashboard-row">
                    <div className="dashboard-col span-all">
                        <h1>Container activity</h1>
                    </div>
                </div>
            </div>
        </main>
    </div>
    );
};
