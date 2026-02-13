"use strict";

"use strict";
import {
    LayoutDashboard,
    Database,
    Server,
    DownloadCloud,
    Monitor,
    Container,
    SearchIcon,
    File,
    CloudDownload,
    ClockArrowDown,
    Github
} from "lucide-react";

import "./TopBarNavigation.css";

export default function TopBarNavigation({
}) {
    return (

        <ul className="top-navigation">
            <li>
                <a href="/dashboard">
                    <LayoutDashboard /><span>Dashboard</span>
                </a>
            </li>
            <li>
                <a href="https://db.petterssonhome.se">
                    <Database /><span>Database</span>
                </a>
            </li>
            <li>
                <a href="https://api.petterssonhome.se">
                    <Server /><span>API</span>
                </a>
            </li>
            <li>
                <a href="https://cdn.petterssonhome.se">
                    <DownloadCloud /><span>CDN</span>
                </a>
            </li>
            <li>
                <a href="https://grafana.petterssonhome.se">
                    <Monitor /><span>Grafana</span>
                </a>
            </li>
            <li>
                <a href="https://docker.petterssonhome.se">
                    <Container /><span>Portainer</span>
                </a>
            </li>
            <li>
                <a href="https://sonarqube.petterssonhome.se">
                    <SearchIcon /><span>SonarQube</span>
                </a>
            </li>
            <li>
                <a href="https://torrent.petterssonhome.se">
                    <ClockArrowDown /><span>Overseerr</span>
                </a>
            </li>
            <li>
                <a href="https://transmission.petterssonhome.se">
                    <CloudDownload /> <span>Transmission</span>
                </a>
            </li>

            <li>
                <a href="https://media.petterssonhome.se">
                    <File /> <span>Media</span>
                </a>
            </li>
            <li>
                <a href="https://github.com/realmaacke/General">
                    <Github /> <span>Github</span>
                </a>
            </li>

        </ul>
    );
}