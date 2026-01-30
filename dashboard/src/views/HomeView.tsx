"use strict";

import "../assets/base.css";

import "../assets/dashboard.css";

import GeneralIcon from "../assets/General_icon.png";

// NAVIGATION
import Navigation from "../components/navigation/Navigation";

export default function HomeView() {
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
