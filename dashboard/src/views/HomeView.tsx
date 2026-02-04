"use strict";

import { useEffect, useState } from "react";
import "../assets/base.css";
import "../assets/dashboard.css";

import GeneralIcon from "../assets/General_icon.png";

// NAVIGATION
import Navigation from "../components/navigation/Navigation";
import ProgressBar from "../components/progress-bar/ProgressBar";

import {gatherData, type DataGathering} from "../models/data";

import { parsePercent, parseSizeGB } from "../models/utils";

import  Chart  from "../components/chart/Chart";

export default function HomeView() {
    const [data, setData] = useState<DataGathering|null>(null);
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {

        const fetchData = async () => {
            setData(await gatherData());

            if (data) {
                setLoading(false);
            }
            console.log(data);
        }
        fetchData();
    })

    if (loading) return <div>Loading…</div>;

    if (!data) return null;

    const totalGB = parseSizeGB(data.disk.total);
    const usedGB = parseSizeGB(data.disk.used);
    const freeGB = parseSizeGB(data.disk.free);
    const usagePercent = parsePercent(data.disk.usage_percent);


    return (
        <div className="two-split">
            <aside className="aside home-aside">
                <div className="dashboard-logo-container">
                    <img src={GeneralIcon} alt="General Icon"/>
                </div>
                <Navigation/>

            </aside>
            <main className="main home-main">
                <div className="dashboard-two-split">
                    <div className="dashboard-row">

                        <div className="dashboard-col">

                            <div className="usage-container">
                                <h1>Usage</h1>
                                <Chart/>
                                
                        </div>

                        <div className="dashboard-col">
                            
                        </div>

                    </div>

                    <div className="dashboard-row">
                        <div className="dashboard-col span-all">
                            
                        </div>
                    </div>
                </div>


            </main>
        </div>
    );
};
